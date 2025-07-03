import { NextResponse } from 'next/server';

interface GitHubSearchRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  topics: string[];
  owner: {
    login: string;
    type: string;
  };
}

interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubSearchRepository[];
}

interface LanguageStats {
  [language: string]: number;
}

interface TrendData {
  totalRepositories: number;
  languageStats: LanguageStats;
  repositories: GitHubSearchRepository[];
  period: string;
}

// 過去30日間の人気リポジトリを取得
async function getTrendingRepositories(): Promise<GitHubSearchRepository[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dateString = thirtyDaysAgo.toISOString().split('T')[0];

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-Trends-App',
  };

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    // 過去30日間に作成され、スター10以上のリポジトリを検索
    const searchQuery = `created:>${dateString} stars:>10`;
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
      searchQuery
    )}&sort=stars&order=desc&per_page=100`;

    const response = await fetch(url, {
      headers,
      next: { revalidate: 3600 }, // 1時間キャッシュ
    });

    if (!response.ok) {
      console.error('GitHub API Error:', response.status, response.statusText);
      return [];
    }

    const data: GitHubSearchResponse = await response.json();
    return data.items;
  } catch (error) {
    console.error('Failed to fetch trending repositories:', error);
    return [];
  }
}

// 各リポジトリの言語構成を取得
async function getRepositoryLanguages(
  owner: string,
  repo: string
): Promise<LanguageStats> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-Trends-App',
  };

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      {
        headers,
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch languages for ${owner}/${repo}:`, error);
    return {};
  }
}

// 言語統計を集計
async function aggregateLanguageStats(
  repositories: GitHubSearchRepository[]
): Promise<LanguageStats> {
  const languageStats: LanguageStats = {};

  // 並列処理でAPIリクエストを最適化（最大20件）
  const limitedRepos = repositories.slice(0, 20);
  const languagePromises = limitedRepos.map(repo =>
    getRepositoryLanguages(repo.owner.login, repo.name)
  );

  try {
    const languageResults = await Promise.all(languagePromises);

    languageResults.forEach(languages => {
      for (const [language, bytes] of Object.entries(languages)) {
        languageStats[language] = (languageStats[language] || 0) + bytes;
      }
    });

    return languageStats;
  } catch (error) {
    console.error('Failed to aggregate language stats:', error);
    return {};
  }
}

export async function GET() {
  try {
    // 1. トレンドリポジトリを取得
    const repositories = await getTrendingRepositories();

    if (repositories.length === 0) {
      return NextResponse.json(
        {
          error: 'No trending repositories found',
          totalRepositories: 0,
          languageStats: {},
          repositories: [],
          period: 'last 30 days',
        },
        { status: 200 }
      );
    }

    // 2. 言語統計を集計
    const languageStats = await aggregateLanguageStats(repositories);

    // 3. レスポンス作成
    const trendData: TrendData = {
      totalRepositories: repositories.length,
      languageStats,
      repositories: repositories.slice(0, 10), // 上位10件のみ返す
      period: 'last 30 days',
    };

    return NextResponse.json(trendData);
  } catch (error) {
    console.error('Trends API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
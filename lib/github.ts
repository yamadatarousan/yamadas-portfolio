// GitHub API関連の関数

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  topics: string[];
  visibility: 'public' | 'private';
  archived: boolean;
  disabled: boolean;
  fork: boolean;
}

export interface GitHubUser {
  login: string;
  name: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  html_url: string;
}

// 指定したユーザーのリポジトリ一覧を取得（すべてのページを取得）
export async function getGitHubRepositories(
  username: string,
  options?: {
    type?: 'all' | 'owner' | 'member';
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
    getAllPages?: boolean; // 全ページを取得するかどうか
  }
): Promise<GitHubRepository[]> {
  const {
    type = 'owner',
    sort = 'updated',
    direction = 'desc',
    per_page = 100,
    page = 1,
    getAllPages = true,
  } = options || {};

  try {
    const params = new URLSearchParams({
      type,
      sort,
      direction,
      per_page: per_page.toString(),
      page: page.toString(),
    });

    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-App',
    };

    // GitHub Personal Access Tokenがある場合は認証ヘッダーを追加
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?${params}`,
      {
        headers,
        next: { revalidate: 3600 }, // 1時間キャッシュ
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(
          `GitHub user '${username}' not found or has no public repositories`
        );
      } else {
        console.error(
          'GitHub API Error:',
          response.status,
          response.statusText
        );
      }
      return [];
    }

    let repositories: GitHubRepository[] = await response.json();

    // 全ページを取得する場合
    if (getAllPages && repositories.length === per_page) {
      let currentPage = page + 1;
      let hasMore = true;

      while (hasMore) {
        try {
          const nextParams = new URLSearchParams({
            type,
            sort,
            direction,
            per_page: per_page.toString(),
            page: currentPage.toString(),
          });

          const nextResponse = await fetch(
            `https://api.github.com/users/${username}/repos?${nextParams}`,
            {
              headers,
              next: { revalidate: 3600 },
            }
          );

          if (!nextResponse.ok) break;

          const nextRepositories: GitHubRepository[] =
            await nextResponse.json();

          if (nextRepositories.length === 0) {
            hasMore = false;
          } else {
            repositories = [...repositories, ...nextRepositories];
            currentPage++;

            // 安全のため最大500件で制限
            if (repositories.length >= 500) {
              hasMore = false;
            }
          }
        } catch (error) {
          console.error('Error fetching additional pages:', error);
          hasMore = false;
        }
      }
    }

    // フォークされたリポジトリを除外し、アーカイブされていないものだけを返す
    return repositories.filter(repo => !repo.fork && !repo.archived);
  } catch (error) {
    console.error('Failed to fetch GitHub repositories:', error);
    return [];
  }
}

// ユーザー情報を取得
export async function getGitHubUser(
  username: string
): Promise<GitHubUser | null> {
  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-App',
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      next: { revalidate: 86400 }, // 24時間キャッシュ
    });

    if (!response.ok) {
      console.error('GitHub API Error:', response.status, response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch GitHub user:', error);
    return null;
  }
}

// リポジトリの言語統計を取得
export async function getRepositoryLanguages(
  owner: string,
  repo: string
): Promise<Record<string, number>> {
  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-App',
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      {
        headers,
        next: { revalidate: 86400 }, // 24時間キャッシュ
      }
    );

    if (!response.ok) {
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch repository languages:', error);
    return {};
  }
}

// 複数のリポジトリの言語統計を集計
export async function getLanguageStats(
  repositories: GitHubRepository[]
): Promise<Record<string, number>> {
  const languageStats: Record<string, number> = {};

  for (const repo of repositories.slice(0, 20)) {
    // 最大20個のリポジトリから集計
    const languages = await getRepositoryLanguages(
      repo.full_name.split('/')[0],
      repo.name
    );

    for (const [language, bytes] of Object.entries(languages)) {
      languageStats[language] = (languageStats[language] || 0) + bytes;
    }
  }

  return languageStats;
}

// GitHubリポジトリをプロジェクト形式に変換
export function convertRepositoryToProject(repo: GitHubRepository) {
  return {
    id: `github-${repo.id}`,
    title: repo.name,
    slug: `github-${repo.name}`,
    description: repo.description || 'GitHub repository',
    content: `This is a GitHub repository: ${repo.name}`,
    githubUrl: repo.html_url,
    demoUrl: null,
    imageUrl: null,
    featured: repo.stargazers_count > 10, // 10 Star以上は注目プロジェクトとする
    published: true,
    status: 'COMPLETED',
    createdAt: new Date(repo.created_at),
    updatedAt: new Date(repo.updated_at),
    technologies: repo.language
      ? [
          {
            technology: {
              id: repo.language.toLowerCase(),
              name: repo.language,
              slug: repo.language.toLowerCase(),
              color: getLanguageColor(repo.language),
            },
          },
        ]
      : [],
    // GitHub固有の情報
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    topics: repo.topics,
  };
}

// プログラミング言語の色を取得
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    javascript: '#F7DF1E',
    typescript: '#3178C6',
    python: '#3776AB',
    java: '#ED8B00',
    'c++': '#00599C',
    'c#': '#239120',
    php: '#777BB4',
    ruby: '#CC342D',
    go: '#00ADD8',
    rust: '#000000',
    swift: '#FA7343',
    kotlin: '#0095D5',
    dart: '#0175C2',
    html: '#E34F26',
    css: '#1572B6',
    vue: '#4FC08D',
    react: '#61DAFB',
    angular: '#DD0031',
    svelte: '#FF3E00',
  };

  return colors[language.toLowerCase()] || '#6B7280';
}

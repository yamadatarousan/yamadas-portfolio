'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Star, GitFork, ExternalLink } from 'lucide-react';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  topics: string[];
  owner: {
    login: string;
    type: string;
  };
}

interface TrendData {
  totalRepositories: number;
  languageStats: Record<string, number>;
  repositories: Repository[];
  period: string;
}

interface ChartData {
  language: string;
  bytes: number;
  percentage: number;
  color: string;
}

// プログラミング言語の色定義
const getLanguageColor = (language: string): string => {
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
    shell: '#89E051',
    dockerfile: '#384D54',
    yaml: '#CB171E',
    json: '#292929',
  };

  return colors[language.toLowerCase()] || '#6B7280';
};

// バイト数を読みやすい形式に変換
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export function TechTrendsClient() {
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrendData();
  }, []);

  const fetchTrendData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/trends');
      if (!response.ok) {
        throw new Error('Failed to fetch trend data');
      }

      const data = await response.json();
      setTrendData(data);
    } catch (err) {
      setError('データの取得に失敗しました');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = (): ChartData[] => {
    if (!trendData || !trendData.languageStats) return [];

    const total = Object.values(trendData.languageStats).reduce(
      (sum, bytes) => sum + bytes,
      0
    );

    return Object.entries(trendData.languageStats)
      .map(([language, bytes]) => ({
        language,
        bytes,
        percentage: (bytes / total) * 100,
        color: getLanguageColor(language),
      }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 10); // 上位10言語
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-4 text-gray-600 dark:text-gray-300'>
          最新のトレンドデータを取得中...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-16'>
        <div className='text-red-500 mb-4'>⚠️ {error}</div>
        <button
          onClick={fetchTrendData}
          className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          再試行
        </button>
      </div>
    );
  }

  if (!trendData) {
    return (
      <div className='text-center py-16 text-gray-600 dark:text-gray-300'>
        データが見つかりませんでした
      </div>
    );
  }

  const chartData = getChartData();

  return (
    <div className='space-y-12'>
      {/* 統計サマリー */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg'>
          <div className='flex items-center space-x-3'>
            <TrendingUp className='h-8 w-8 text-blue-600' />
            <div>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                分析対象リポジトリ
              </p>
              <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                {trendData.totalRepositories}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg'>
          <div className='flex items-center space-x-3'>
            <Star className='h-8 w-8 text-yellow-500' />
            <div>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                使用言語数
              </p>
              <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                {Object.keys(trendData.languageStats).length}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg'>
          <div className='flex items-center space-x-3'>
            <GitFork className='h-8 w-8 text-green-600' />
            <div>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                分析期間
              </p>
              <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                30日間
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 言語統計グラフ */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* 棒グラフ */}
        <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg'>
          <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-6'>
            使用言語ランキング
          </h2>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='language'
                angle={-45}
                textAnchor='end'
                height={80}
                fontSize={12}
              />
              <YAxis tickFormatter={formatBytes} fontSize={12} />
              <Tooltip
                formatter={(value: number) => [formatBytes(value), 'コード量']}
                labelFormatter={(label: string) => `言語: ${label}`}
              />
              <Bar dataKey='bytes' fill='#3B82F6' />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 円グラフ */}
        <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg'>
          <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-6'>
            言語シェア分布
          </h2>
          <div className='flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6'>
            <div className='flex-shrink-0'>
              <ResponsiveContainer width={250} height={250}>
                <PieChart>
                  <Pie
                    data={chartData.slice(0, 8)}
                    cx='50%'
                    cy='50%'
                    outerRadius={80}
                    dataKey='percentage'
                    label={false}
                  >
                    {chartData.slice(0, 8).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'シェア']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm'>
              {chartData.slice(0, 8).map((entry, index) => (
                <div key={`legend-${index}`} className='flex items-center space-x-2'>
                  <div
                    className='w-3 h-3 rounded-full flex-shrink-0'
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className='text-gray-700 dark:text-gray-300 truncate'>
                    {entry.language} ({entry.percentage.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 注目リポジトリ一覧 */}
      <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-6'>
          注目のリポジトリ（過去30日間）
        </h2>
        <div className='grid gap-4'>
          {trendData.repositories.map(repo => (
            <div
              key={repo.id}
              className='border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
            >
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center space-x-2 mb-2'>
                    <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
                      {repo.name}
                    </h3>
                    {repo.language && (
                      <span
                        className='px-2 py-1 text-xs rounded-full text-white'
                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                      >
                        {repo.language}
                      </span>
                    )}
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-300 mb-2'>
                    {repo.description || 'No description'}
                  </p>
                  <div className='flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400'>
                    <span className='flex items-center space-x-1'>
                      <Star className='h-4 w-4' />
                      <span>{repo.stargazers_count}</span>
                    </span>
                    <span className='flex items-center space-x-1'>
                      <GitFork className='h-4 w-4' />
                      <span>{repo.forks_count}</span>
                    </span>
                    <span>{repo.owner.login}</span>
                  </div>
                </div>
                <a
                  href={repo.html_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='ml-4 p-2 text-gray-400 hover:text-blue-600 transition-colors'
                >
                  <ExternalLink className='h-5 w-5' />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 更新ボタン */}
      <div className='text-center'>
        <button
          onClick={fetchTrendData}
          disabled={loading}
          className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors'
        >
          {loading ? 'データ更新中...' : 'データを更新'}
        </button>
      </div>
    </div>
  );
}
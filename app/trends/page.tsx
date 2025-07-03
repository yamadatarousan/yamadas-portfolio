import { Metadata } from 'next';
import { TechTrendsClient } from '@/components/trends/tech-trends-client';

export const metadata: Metadata = {
  title: 'Tech Trends - GitHub技術トレンド分析',
  description:
    '過去30日間のGitHubで人気を集めた技術スタックの分析。最新の技術トレンドをリアルタイムで可視化します。',
};

export default function TrendsPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'>
      <div className='max-w-7xl mx-auto px-6 py-16'>
        {/* ヘッダー */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
            Tech Trends
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
            過去30日間にGitHubで注目を集めた技術スタックを分析
            <br />
            最新の開発トレンドをリアルタイムで可視化します
          </p>
        </div>

        {/* メインコンテンツ */}
        <TechTrendsClient />
      </div>
    </div>
  );
}
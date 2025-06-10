import { GitHubRepoCard } from '@/components/projects/github-repo-card';
import { ProjectCard } from '@/components/projects/project-card';
import { getGitHubRepositories } from '@/lib/github';
import { getProjects } from '@/lib/projects';
import { Github } from 'lucide-react';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const revalidate = 3600; // 1時間でキャッシュを更新

export const metadata: Metadata = {
  title: 'プロジェクト一覧 | My Portfolio',
  description:
    'これまでに開発したプロジェクトの一覧です。様々な技術を使用したアプリケーションやライブラリを紹介しています。',
  openGraph: {
    title: 'プロジェクト一覧 | My Portfolio',
    description:
      'これまでに開発したプロジェクトの一覧です。様々な技術を使用したアプリケーションやライブラリを紹介しています。',
    type: 'website',
  },
};

async function ProjectGrid() {
  const [projects, repositories] = await Promise.all([
    getProjects({
      published: true,
    }),
    getGitHubRepositories(process.env.GITHUB_USERNAME || 'yamadatarousan', {
      per_page: 100,
      sort: 'updated',
    }).catch(() => []),
  ]);

  const totalItems = projects.length + repositories.length;

  if (totalItems === 0) {
    return (
      <div className='text-center py-12'>
        <div className='text-6xl mb-4'>🔍</div>
        <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>
          プロジェクトが見つかりませんでした
        </h3>
        <p className='text-gray-600 dark:text-gray-400'>
          現在、公開可能なプロジェクトがありません。
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* 手動追加プロジェクト */}
      {projects.length > 0 && (
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6'>
            プロジェクト
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* GitHubリポジトリ */}
      {repositories.length > 0 && (
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2'>
            <Github className='h-6 w-6' />
            GitHub リポジトリ
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {repositories.map(repo => (
              <GitHubRepoCard key={repo.id} repository={repo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectsLoading() {
  return (
    <div className='space-y-8'>
      <div>
        <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6' />
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden'
            >
              <div className='animate-pulse'>
                <div className='aspect-video bg-gray-100 dark:bg-gray-800' />
                <div className='p-6'>
                  <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3' />
                  <div className='space-y-2 mb-4'>
                    <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded' />
                    <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4' />
                  </div>
                  <div className='flex gap-2 mb-4'>
                    {[...Array(3)].map((_, j) => (
                      <div
                        key={j}
                        className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-16'
                      />
                    ))}
                  </div>
                  <div className='flex justify-between items-center'>
                    <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-20' />
                    <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-24' />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ProjectsPage() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* ヘッダー */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
            プロジェクト一覧
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
            これまでに開発したプロジェクトの一覧です。様々な技術を使用したアプリケーションやライブラリを紹介しています。
          </p>
        </div>

        {/* プロジェクト一覧 */}
        <Suspense fallback={<ProjectsLoading />}>
          <ProjectGrid />
        </Suspense>
      </div>
    </div>
  );
}

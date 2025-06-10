import { ProjectCard } from '@/components/projects/project-card';
import {
  getGitHubRepoInfo,
  getProjectBySlug,
  getRelatedProjects,
} from '@/lib/projects';
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Eye,
  Github,
  Star,
} from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'プロジェクトが見つかりません',
    };
  }

  return {
    title: `${project.title} | My Portfolio`,
    description: project.description,
    openGraph: {
      title: `${project.title} | My Portfolio`,
      description: project.description,
      type: 'article',
      images: project.imageUrl ? [{ url: project.imageUrl }] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // 関連プロジェクトを取得
  const relatedProjects = await getRelatedProjects(project.id, 3);

  // GitHub情報を取得（オプション）
  const githubInfo = project.githubUrl
    ? await getGitHubRepoInfo(project.githubUrl)
    : null;

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* ヘッダー */}
      <div className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex items-center gap-4 mb-6'>
            <Link
              href='/projects'
              className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors'
            >
              <ArrowLeft className='h-4 w-4' />
              プロジェクト一覧に戻る
            </Link>
          </div>

          <div className='flex flex-col lg:flex-row gap-8'>
            {/* プロジェクト画像 */}
            <div className='lg:w-1/2'>
              <div className='aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg overflow-hidden relative'>
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <span className='text-6xl opacity-50'>🚀</span>
                  </div>
                )}

                {project.featured && (
                  <div className='absolute top-4 left-4'>
                    <div className='flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded-full'>
                      <Star className='h-4 w-4 fill-current' />
                      Featured
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* プロジェクト情報 */}
            <div className='lg:w-1/2'>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
                {project.title}
              </h1>

              <p className='text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6'>
                {project.description}
              </p>

              {/* リンク */}
              <div className='flex flex-wrap gap-3 mb-6'>
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                  >
                    <ExternalLink className='h-4 w-4' />
                    デモを見る
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors'
                  >
                    <Github className='h-4 w-4' />
                    ソースコード
                  </a>
                )}
              </div>

              {/* GitHub統計（利用可能な場合） */}
              {githubInfo && (
                <div className='grid grid-cols-2 gap-4 mb-6'>
                  <div className='bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center'>
                    <div className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                      {githubInfo.stars}
                    </div>
                    <div className='text-sm text-gray-600 dark:text-gray-400'>
                      Stars
                    </div>
                  </div>
                  <div className='bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center'>
                    <div className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                      {githubInfo.forks}
                    </div>
                    <div className='text-sm text-gray-600 dark:text-gray-400'>
                      Forks
                    </div>
                  </div>
                </div>
              )}

              {/* メタ情報 */}
              <div className='flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400'>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />
                  {new Date(project.createdAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div className='flex items-center gap-1'>
                  <Eye className='h-4 w-4' />
                  プロジェクト詳細
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* メイン情報 */}
          <div className='lg:col-span-2'>
            {/* 詳細説明 */}
            {project.content && (
              <div className='bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 mb-6'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                  プロジェクト詳細
                </h2>
                <div className='prose dark:prose-invert max-w-none'>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: project.content.replace(/\n/g, '<br />'),
                    }}
                  />
                </div>
              </div>
            )}

            {/* 機能・特徴 */}
            {project.features && (
              <div className='bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 mb-6'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                  主な機能・特徴
                </h2>
                <ul className='list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400'>
                  {project.features
                    .split('\n')
                    .map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                </ul>
              </div>
            )}

            {/* 技術的な課題・解決策 */}
            {project.challenges && (
              <div className='bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                  技術的な課題と解決策
                </h2>
                <div className='prose dark:prose-invert max-w-none'>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: project.challenges.replace(/\n/g, '<br />'),
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* サイドバー */}
          <div>
            {/* 技術スタック */}
            {project.technologies && project.technologies.length > 0 && (
              <div className='bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 mb-6'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                  技術スタック
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {project.technologies.map((projectTech: any) => (
                    <span
                      key={projectTech.technology.id}
                      className='px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full'
                      style={{
                        backgroundColor: `${projectTech.technology.color}20`,
                        color: projectTech.technology.color,
                        borderColor: `${projectTech.technology.color}40`,
                      }}
                    >
                      {projectTech.technology.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* プロジェクト情報 */}
            <div className='bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                プロジェクト情報
              </h3>
              <dl className='space-y-3'>
                <div>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    開発期間
                  </dt>
                  <dd className='text-sm text-gray-900 dark:text-gray-100'>
                    {project.startDate ? (
                      <>
                        {new Date(project.startDate).toLocaleDateString(
                          'ja-JP'
                        )}
                        {project.endDate && (
                          <>
                            {' '}
                            〜{' '}
                            {new Date(project.endDate).toLocaleDateString(
                              'ja-JP'
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      '未設定'
                    )}
                  </dd>
                </div>
                <div>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    ステータス
                  </dt>
                  <dd className='text-sm text-gray-900 dark:text-gray-100'>
                    {project.status === 'COMPLETED'
                      ? '完了'
                      : project.status === 'IN_PROGRESS'
                        ? '開発中'
                        : project.status === 'PLANNED'
                          ? '計画中'
                          : project.status === 'ARCHIVED'
                            ? 'アーカイブ済み'
                            : '未設定'}
                  </dd>
                </div>
                {project.demoUrl && (
                  <div>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      デモURL
                    </dt>
                    <dd className='text-sm'>
                      <a
                        href={project.demoUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 dark:text-blue-400 hover:underline'
                      >
                        {project.demoUrl}
                      </a>
                    </dd>
                  </div>
                )}
                {project.githubUrl && (
                  <div>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      リポジトリ
                    </dt>
                    <dd className='text-sm'>
                      <a
                        href={project.githubUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 dark:text-blue-400 hover:underline'
                      >
                        GitHub
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* 関連プロジェクト */}
        {relatedProjects.length > 0 && (
          <div className='mt-12'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6'>
              関連プロジェクト
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {relatedProjects.map((relatedProject: any) => (
                <ProjectCard
                  key={relatedProject.id}
                  project={relatedProject}
                  showFeaturedBadge={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

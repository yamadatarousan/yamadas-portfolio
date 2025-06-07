import { Metadata } from 'next'
import { Suspense } from 'react'
import { Search, Filter, Code, Folder, Star, Github } from 'lucide-react'
import { getProjects, getTechnologies, getProjectStats } from '@/lib/projects'
import { getGitHubRepositories } from '@/lib/github'
import { ProjectCard } from '@/components/projects/project-card'
import { GitHubRepoCard } from '@/components/projects/github-repo-card'

export const revalidate = 3600 // 1時間でキャッシュを更新

export const metadata: Metadata = {
  title: 'プロジェクト一覧 | My Portfolio',
  description: 'これまでに開発したプロジェクトの一覧です。様々な技術を使用したアプリケーションやライブラリを紹介しています。',
  openGraph: {
    title: 'プロジェクト一覧 | My Portfolio',
    description: 'これまでに開発したプロジェクトの一覧です。様々な技術を使用したアプリケーションやライブラリを紹介しています。',
    type: 'website',
  },
}

interface PageProps {
  searchParams: {
    tech?: string
    featured?: string
    search?: string
  }
}

async function ProjectStats() {
  const [stats, repositories] = await Promise.all([
    getProjectStats(),
    getGitHubRepositories(process.env.GITHUB_USERNAME || 'yamadatarousan', { per_page: 100 }).catch(() => [])
  ])
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">            
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Github className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{repositories.length}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">リポジトリ</div>
      </div>
    </div>
  )
}

async function TechnologyFilter({ selectedTech }: { selectedTech?: string }) {
  const technologies = await getTechnologies()
  
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">技術で絞り込み</h3>
      <div className="flex flex-wrap gap-2">
        <a
          href="/projects"
          className={`px-3 py-1 rounded-full border text-sm transition-colors ${
            !selectedTech
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-blue-600'
          }`}
        >
          すべて
        </a>
        {technologies.map((tech: any) => (
          <a
            key={tech.id}
            href={`/projects?tech=${tech.slug}`}
            className={`px-3 py-1 rounded-full border text-sm transition-colors ${
              selectedTech === tech.slug
                ? 'text-white border-blue-600'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-blue-600'
            }`}
            style={{
              backgroundColor: selectedTech === tech.slug ? tech.color : undefined,
              borderColor: selectedTech === tech.slug ? tech.color : undefined,
            }}
          >
            {tech.name}
          </a>
        ))}
      </div>
    </div>
  )
}

async function ProjectGrid({ searchParams }: { searchParams: PageProps['searchParams'] }) {
  const [projects, repositories] = await Promise.all([
    getProjects({
      published: true,
      featured: searchParams.featured === 'true' ? true : undefined,
      technologySlug: searchParams.tech,
    }),
    getGitHubRepositories(process.env.GITHUB_USERNAME || 'yamadatarousan', { 
      per_page: 100, // 最大100件まで取得
      sort: 'updated'
    }).catch(() => [])
  ])
  
  // フィルタリング条件に応じてGitHubリポジトリもフィルタリング
  const filteredRepositories = repositories.filter(repo => {
    if (searchParams.featured === 'true') {
      return repo.stargazers_count > 10
    }
    if (searchParams.tech) {
      return repo.language?.toLowerCase() === searchParams.tech.toLowerCase() ||
             repo.topics.some(topic => topic.toLowerCase().includes(searchParams.tech!.toLowerCase()))
    }
    return true
  })
  
  const totalItems = projects.length + filteredRepositories.length
  
  if (totalItems === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          プロジェクトが見つかりませんでした
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {searchParams.tech
            ? `「${searchParams.tech}」に関連するプロジェクトはありません。`
            : '現在、公開可能なプロジェクトがありません。'}
        </p>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      {/* 手動追加プロジェクト */}
      {projects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            ✨ 注目プロジェクト
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

              {/* GitHubリポジトリ */}
        {filteredRepositories.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Github className="h-6 w-6" />
                GitHub リポジトリ
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {searchParams.tech || searchParams.featured ? (
                  <>
                    {filteredRepositories.length}件 / 全{repositories.length}件
                  </>
                ) : (
                  <>{repositories.length}件のリポジトリ</>
                )}
              </div>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRepositories.map((repository) => (
              <GitHubRepoCard key={repository.id} repository={repository} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            プロジェクト一覧
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            これまでに開発したアプリケーション、ライブラリ、実験的なプロジェクトを紹介しています。
            様々な技術を使用して実用的なソリューションの構築を心がけています。
          </p>
        </div>

        {/* 統計情報 */}
        <Suspense fallback={<div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse mb-8" />}>
          <ProjectStats />
        </Suspense>

        {/* フィルター */}
        <Suspense fallback={<div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse mb-8" />}>
          <TechnologyFilter selectedTech={searchParams.tech} />
        </Suspense>

        {/* 現在のフィルター表示 */}
        {(searchParams.tech || searchParams.featured) && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">現在のフィルター:</span>
            {searchParams.tech && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                技術: {searchParams.tech}
              </span>
            )}
            {searchParams.featured && (
              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm rounded-full">
                注目プロジェクトのみ
              </span>
            )}
            <a
              href="/projects"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              フィルターをクリア
            </a>
          </div>
        )}

        {/* プロジェクト一覧 */}
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 animate-pulse" />
                <div className="p-6">
                  <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-3" />
                  <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-4" />
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
                    <div className="h-6 w-20 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        }>
          <ProjectGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
} 
import Link from 'next/link'
import { ArrowRight, Star, Github } from 'lucide-react'
import { getFeaturedProjects } from '@/lib/projects'
import { getGitHubRepositories } from '@/lib/github'
import { ProjectCard } from './project-card'
import { GitHubRepoCard } from './github-repo-card'

export async function FeaturedProjects() {
  const [featuredProjects, repositories] = await Promise.all([
    getFeaturedProjects(2), // 手動プロジェクトは2個に減らす
    getGitHubRepositories(process.env.GITHUB_USERNAME || 'yamadatarousan', { 
      per_page: 100, // 全件取得してから最適なものを選択
      sort: 'updated'
    }).catch(() => [])
  ])

  // Star数が多いリポジトリを1つ選ぶ
  const popularRepo = repositories
    .filter(repo => repo.stargazers_count > 0)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)[0]

  const hasContent = featuredProjects.length > 0 || popularRepo

  if (!hasContent) {
    return null
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* セクションヘッダー */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="h-6 w-6 text-yellow-500 fill-current" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              注目プロジェクト
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            技術力とクリエイティビティを活かして開発した、特に注目していただきたいプロジェクトをご紹介します。
          </p>
        </div>

        {/* プロジェクトグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {popularRepo && (
            <GitHubRepoCard key={`github-${popularRepo.id}`} repository={popularRepo} />
          )}
        </div>

        {/* すべてのプロジェクトを見るリンク */}
        <div className="text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            すべてのプロジェクトを見る
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
} 
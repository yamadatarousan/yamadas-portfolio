import { ExternalLink, Github, Star, GitFork, Clock } from 'lucide-react'
import { GitHubRepository } from '@/lib/github'

interface GitHubRepoCardProps {
  repository: GitHubRepository
  className?: string
}

export function GitHubRepoCard({ repository, className = '' }: GitHubRepoCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

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
      angular: '#DD0031',
      svelte: '#FF3E00',
    }
    
    return colors[language.toLowerCase()] || '#6B7280'
  }

  return (
    <article className={`group relative bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${className}`}>
      {/* GitHub バッジ */}
      <div className="absolute top-3 left-3 z-10">
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded-full">
          <Github className="h-3 w-3" />
          GitHub
        </div>
      </div>

      {/* Star数が多い場合の注目バッジ */}
      {repository.stargazers_count > 10 && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
            <Star className="h-3 w-3 fill-current" />
            Popular
          </div>
        </div>
      )}

      {/* ヘッダー部分 */}
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 relative overflow-hidden flex items-center justify-center">
        <div className="text-center p-6">
          <Github className="h-16 w-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {repository.name}
          </h2>
          
          {/* 統計情報 */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              {repository.stargazers_count}
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-4 w-4" />
              {repository.forks_count}
            </div>
          </div>
        </div>

        {/* External Links Overlay */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-900/80 text-white rounded-full hover:bg-gray-900 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* コンテンツエリア */}
      <div className="p-6">
        {/* 説明 */}
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">
          {repository.description || 'GitHub repository'}
        </p>

        {/* プログラミング言語 */}
        {repository.language && (
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getLanguageColor(repository.language) }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {repository.language}
            </span>
          </div>
        )}

        {/* トピックス */}
        {repository.topics && repository.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {repository.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
              >
                {topic}
              </span>
            ))}
            {repository.topics.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                +{repository.topics.length - 3}
              </span>
            )}
          </div>
        )}

        {/* フッター */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            {formatDate(repository.updated_at)}
          </span>
          
          <a
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </a>
        </div>
      </div>
    </article>
  )
} 
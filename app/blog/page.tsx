import { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDays, Clock, User, Search } from 'lucide-react'
import { getPosts } from '@/lib/blog'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'ブログ | My Portfolio',
  description: '技術に関する記事やチュートリアルを掲載しています。',
}

export default async function BlogPage() {
  const posts = await getPosts({ published: true })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* ヘッダー */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tech Blog
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            最新の技術トレンド、開発手法、学んだことをシェアしています
          </p>
        </div>

        {/* 記事一覧 */}
        {posts.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-2">
            {posts.map((post: any) => (
              <article
                key={post.id}
                className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-8">
                  {/* タグ */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((postTag: any) => (
                        <span
                          key={postTag.tag.id}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full"
                        >
                          {postTag.tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* タイトル */}
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <Link href={`/blog/${encodeURIComponent(post.slug)}`}>
                      {post.title}
                    </Link>
                  </h2>

                  {/* 概要 */}
                  {post.excerpt && (
                    <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}

                  {/* メタ情報 */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{post.author?.name || 'Unknown'}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>約 {Math.ceil(post.content.length / 500)} 分</span>
                    </div>
                  </div>

                  {/* 続きを読むリンク */}
                  <div className="mt-6">
                    <Link
                      href={`/blog/${encodeURIComponent(post.slug)}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      続きを読む
                      <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              記事がありません
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              最初のブログ記事を作成しましょう
            </p>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              記事を作成
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 
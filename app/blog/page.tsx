import { Suspense } from 'react'
import { PostCard } from '@/components/blog/post-card'
import { getPosts, getCategories, getPopularTags } from '@/lib/blog'
import Link from 'next/link'

// ISRで再生成間隔を設定
export const revalidate = 3600 // 1時間

export default async function BlogPage() {
  // 並列でデータを取得
  const [posts, categories, popularTags] = await Promise.all([
    getPosts({ limit: 12 }),
    getCategories(),
    getPopularTags(8),
  ])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダーセクション */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              ブログ
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              技術、開発、学習について書いています。
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-3">
            {/* 記事一覧 */}
            <Suspense fallback={<PostsLoading />}>
              {posts.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    記事がありません
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    最初の記事を投稿してみましょう！
                  </p>
                </div>
              )}
            </Suspense>

            {/* ページネーション（後で実装）*/}
            {posts.length >= 12 && (
              <div className="mt-12 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  ページネーション機能は後で実装予定
                </div>
              </div>
            )}
          </div>

          {/* サイドバー */}
          <div className="space-y-8">
            {/* カテゴリ */}
            {categories.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  カテゴリ
                </h3>
                <div className="space-y-2">
                  {categories.map((category: any) => (
                    <Link
                      key={category.id}
                      href={`/blog/category/${category.slug}`}
                      className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 人気タグ */}
            {popularTags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  人気タグ
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag: any) => (
                    <Link
                      key={tag.id}
                      href={`/blog/tag/${tag.slug}`}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 最近の記事 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                最近の記事
              </h3>
              <div className="space-y-3">
                {posts.slice(0, 5).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="block group"
                  >
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('ja-JP') : new Date(post.createdAt).toLocaleDateString('ja-JP')}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ローディングコンポーネント
function PostsLoading() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse">
          <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12" />
            </div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User, Tag as TagIcon } from 'lucide-react'
import { getPostBySlug, getRelatedPosts, calculateReadingTime } from '@/lib/blog'
import { MarkdownContent } from '@/components/blog/markdown-content'
import { PostCard } from '@/components/blog/post-card'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// 静的生成のためのメタデータ
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {
      title: '記事が見つかりません',
    }
  }

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author.name],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const [relatedPosts, readingTime] = await Promise.all([
    getRelatedPosts(post.id),
    Promise.resolve(calculateReadingTime(post.content)),
  ])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* 戻るボタン */}
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            ブログ一覧に戻る
          </Link>

          {/* カテゴリ */}
          {post.category && (
            <div className="mb-4">
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                {post.category.name}
              </span>
            </div>
          )}

          {/* タイトル */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* メタデータ */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.publishedAt?.toISOString()}>
                {post.publishedAt 
                  ? new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : new Date(post.createdAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                }
              </time>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{readingTime.text}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author.name}</span>
            </div>
          </div>

          {/* タグ */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              <TagIcon className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-1" />
              {post.tags.map((postTag: any) => (
                <Link
                  key={postTag.tag.id}
                  href={`/blog/tag/${postTag.tag.slug}`}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  #{postTag.tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* コンテンツ */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 lg:p-12">
          <MarkdownContent content={post.content} />
        </div>

        {/* 関連記事 */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              関連記事
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        )}

        {/* シェアボタン（後で実装）*/}
        <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            この記事をシェア
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            シェア機能は後で実装予定です
          </div>
        </div>
      </div>
    </div>
  )
}

// 404ページが必要な場合のためのnot-found.tsx
export function generateStaticParams() {
  // 静的生成のためのパラメータを返す
  // プロダクションではデータベースから記事のスラッグを取得
  return []
} 
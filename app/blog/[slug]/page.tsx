import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, Clock, User, Tag, ArrowLeft } from 'lucide-react'
import { getPostBySlug } from '@/lib/blog'
import { formatDate } from '@/lib/utils'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(decodeURIComponent(params.slug))

  if (!post) {
    return {
      title: 'ページが見つかりません',
    }
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt || `${post.title}についての記事です。`,
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author?.name || 'Unknown'],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(decodeURIComponent(params.slug))

  if (!post || (!post.published && process.env.NODE_ENV === 'production')) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 戻るボタン */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          ブログ一覧に戻る
        </Link>

        <article className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg overflow-hidden">
          {/* ヘッダー */}
          <header className="px-8 py-8 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-4">
              {/* ステータスバッジ */}
              {!post.published && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                  下書き
                </span>
              )}

              {/* タイトル */}
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {post.title}
              </h1>

              {/* 概要 */}
              {post.excerpt && (
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* メタ情報 */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author?.name || 'Unknown Author'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>約 {Math.ceil(post.content.length / 500)} 分で読めます</span>
                </div>
              </div>

              {/* タグ */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-slate-400" />
                  {post.tags.map((postTag: any) => (
                    <span
                      key={postTag.tag.id}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full"
                    >
                      {postTag.tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* コンテンツ */}
          <div className="px-8 py-8">
            <div className="prose prose-slate dark:prose-invert max-w-none prose-lg">
              <div 
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: post.content.replace(/\n/g, '<br />') 
                }} 
              />
            </div>
          </div>

          {/* フッター */}
          <footer className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                最終更新: {formatDate(post.updatedAt)}
              </div>
              
              {/* 編集リンク（開発環境または下書きの場合） */}
              {(process.env.NODE_ENV === 'development' || !post.published) && (
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  編集する
                </Link>
              )}
            </div>
          </footer>
        </article>
      </div>
    </div>
  )
}

// 静的生成用の関数（オプション）
export async function generateStaticParams() {
  // 本番環境では公開済みの記事のみ
  const posts = await import('@/lib/blog').then(lib => lib.getPosts({ published: true }))
  
  return posts.map((post: any) => ({
    slug: post.slug,
  }))
} 
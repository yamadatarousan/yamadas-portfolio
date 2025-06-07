import { Metadata } from 'next'
import Link from 'next/link'
import { 
  PlusCircle, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  Calendar,
  Eye,
  Edit
} from 'lucide-react'
import { getPosts } from '@/lib/blog'
import { getProjectStats } from '@/lib/projects'

export const metadata: Metadata = {
  title: '管理者ダッシュボード | My Portfolio',
  description: 'ブログとプロジェクトの管理画面',
}

async function DashboardStats() {
  const [posts, projectStats] = await Promise.all([
    getPosts({ published: false, limit: 100 }),
    getProjectStats()
  ])

  const publishedPosts = posts.filter(post => post.published)
  const draftPosts = posts.filter(post => !post.published)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">公開記事</span>
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {publishedPosts.length}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          +{posts.filter(post => {
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return new Date(post.createdAt) > weekAgo
          }).length} 今週
        </p>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Edit className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">下書き</span>
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {draftPosts.length}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          編集中の記事
        </p>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <BarChart3 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">プロジェクト</span>
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {projectStats.published}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          公開中のプロジェクト
        </p>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">総記事数</span>
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {posts.length}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          すべての記事
        </p>
      </div>
    </div>
  )
}

async function RecentPosts() {
  const posts = await getPosts({ limit: 5 })

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          最近の記事
        </h2>
        <Link
          href="/admin/posts"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
        >
          すべて表示
        </Link>
      </div>
      
      <div className="space-y-4">
        {posts.map((post: any) => (
          <div key={post.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium text-slate-900 dark:text-slate-100">
                {post.title}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  post.published 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {post.published ? '公開中' : '下書き'}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.createdAt).toLocaleDateString('ja-JP')}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4" />
              </Link>
              <Link
                href={`/blog/${post.slug}`}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            管理者ダッシュボード
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            ブログ記事とプロジェクトを管理しましょう
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-slate-900 dark:text-slate-100">新しい記事</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">ブログ記事を作成</div>
            </div>
          </Link>

          <Link
            href="/admin/posts"
            className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-slate-900 dark:text-slate-100">記事管理</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">記事を編集・削除</div>
            </div>
          </Link>

          <Link
            href="/projects"
            className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-slate-900 dark:text-slate-100">プロジェクト</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">プロジェクト一覧</div>
            </div>
          </Link>

          <Link
            href="/blog"
            className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-slate-900 dark:text-slate-100">ブログ表示</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">公開ページを確認</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
} 
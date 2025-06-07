'use client'

import { Button } from '@/components/ui/button'
import { GitHub, LinkedIn, Twitter, Mail, Download, ExternalLink } from '@/components/ui/icons'
import Link from 'next/link'

export function HeroSection() {
  const skills = [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL'
  ]

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/yamadatarousan',
      icon: GitHub,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/yamadataro',
      icon: LinkedIn,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/yamadataro',
      icon: Twitter,
    },
    {
      name: 'Email',
      href: 'mailto:yamada@example.com',
      icon: Mail,
    },
  ]

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* 左側: テキストコンテンツ */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              こんにちは、
              <br />
              <span className="text-blue-600">山田太郎</span>です
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300">
              フルスタックデベロッパー
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
              モダンなWebテクノロジーを使って、ユーザー体験を重視したアプリケーションを開発しています。
              フロントエンドからバックエンドまで、包括的なソリューションを提供します。
            </p>
          </div>

          {/* スキルタグ */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              主なスキル
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* CTAボタン */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/projects" className="flex items-center gap-2">
                プロジェクトを見る
                <ExternalLink size={16} />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              <a href="/resume.pdf" className="flex items-center gap-2" download>
                履歴書をダウンロード
                <Download size={16} />
              </a>
            </Button>
          </div>

          {/* ソーシャルリンク */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              つながる
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const IconComponent = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label={link.name}
                  >
                    <IconComponent size={20} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* 右側: プロフィール画像とステータス */}
        <div className="relative flex flex-col items-center space-y-6">
          {/* プロフィール画像 */}
          <div className="relative">
            <div className="w-80 h-80 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-600 p-1">
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
                {/* 実際のプロフィール画像がある場合は src を変更 */}
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                  <span className="text-6xl">👨‍💻</span>
                </div>
              </div>
            </div>
            {/* オンラインステータス */}
            <div className="absolute bottom-6 right-6 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-900"></div>
          </div>

          {/* ステータス情報 */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">現在お仕事募集中</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              東京 / リモートワーク可
            </p>
          </div>

          {/* 装飾的な要素 */}
          <div className="absolute top-10 -left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute bottom-10 -right-10 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-50 animate-pulse delay-1000"></div>
        </div>
      </div>
    </section>
  )
} 
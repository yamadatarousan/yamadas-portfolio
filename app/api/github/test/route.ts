import { NextResponse } from 'next/server'
import { getGitHubRepositories, getGitHubUser } from '@/lib/github'

export async function GET() {
  try {
    // テスト用に有名なGitHubユーザーのリポジトリを取得
    const testUsername = 'vercel' // Vercelの公開リポジトリ
    
    const [user, repositories] = await Promise.all([
      getGitHubUser(testUsername),
      getGitHubRepositories(testUsername, { per_page: 5 })
    ])

    return NextResponse.json({
      success: true,
      data: {
        user,
        repositories: repositories.slice(0, 3), // 最初の3つだけ表示
        count: repositories.length,
      },
    })
  } catch (error) {
    console.error('GitHub API test failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'GitHub API test failed',
      },
      { status: 500 }
    )
  }
} 
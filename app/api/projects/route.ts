import { NextRequest, NextResponse } from 'next/server'
import { getProjects } from '@/lib/projects'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const options = {
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      published: searchParams.get('published') === 'false' ? false : true,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      technologySlug: searchParams.get('tech') || undefined,
    }

    const projects = await getProjects(options)

    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length,
    })
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'プロジェクトの取得に失敗しました',
      },
      { status: 500 }
    )
  }
} 
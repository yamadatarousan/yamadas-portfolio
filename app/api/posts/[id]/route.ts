import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        tags: {
          include: {
            tag: true
          }
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: '記事が見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: '記事の取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, tags, published } = body

    // 既存の記事を取得
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: '記事が見つかりません' },
        { status: 404 }
      )
    }

    // スラッグの重複チェック（自分以外）
    const slugDuplicate = await prisma.post.findFirst({
      where: {
        slug,
        NOT: { id: params.id }
      }
    })

    if (slugDuplicate) {
      return NextResponse.json(
        { error: 'このスラッグは既に使用されています' },
        { status: 400 }
      )
    }

    // 既存のタグ関連を削除
    await prisma.postTag.deleteMany({
      where: { postId: params.id }
    })

    // タグを処理
    const tagConnections = []
    for (const tagName of tags) {
      if (tagName.trim()) {
        // タグを取得または作成
        const tag = await prisma.tag.upsert({
          where: { name: tagName.trim() },
          update: {},
          create: {
            name: tagName.trim(),
            slug: tagName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
          }
        })
        tagConnections.push({
          tagId: tag.id
        })
      }
    }

    // 記事を更新
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        excerpt,
        content,
        published,
        publishedAt: published && !existingPost.published ? new Date() : existingPost.publishedAt,
        tags: {
          create: tagConnections
        }
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: '記事の更新に失敗しました' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: '記事が見つかりません' },
        { status: 404 }
      )
    }

    await prisma.post.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: '記事が削除されました' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: '記事の削除に失敗しました' },
      { status: 500 }
    )
  }
} 
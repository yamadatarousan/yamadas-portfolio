import { NextRequest, NextResponse } from 'next/server';
import { getPosts } from '@/lib/blog';
import { prisma } from '@/lib/db';
import { generateExcerpt } from '@/lib/blog';

// GET - ブログ記事一覧を取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!)
      : undefined;
    const published = searchParams.get('published') !== 'false';
    const categorySlug = searchParams.get('category') || undefined;
    const tagSlug = searchParams.get('tag') || undefined;
    const search = searchParams.get('search') || undefined;

    const posts = await getPosts({
      limit,
      published,
      categorySlug,
      tagSlug,
      search,
    });

    return NextResponse.json({
      success: true,
      data: posts,
      count: posts.length,
    });
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch posts',
      },
      { status: 500 }
    );
  }
}

// POST - 新しいブログ記事を作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      categoryId,
      tagIds = [],
      published = false,
      authorId, // 実際の実装では認証から取得
    } = body;

    // バリデーション
    if (!title || !content || !authorId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title, content, and authorId are required',
        },
        { status: 400 }
      );
    }

    // スラッグを生成（簡易版）
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100);

    // 記事を作成
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || generateExcerpt(content),
        published,
        publishedAt: published ? new Date() : null,
        authorId,
        categoryId: categoryId || null,
        tags: {
          create: tagIds.map((tagId: string) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },
      },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create post',
      },
      { status: 500 }
    );
  }
}

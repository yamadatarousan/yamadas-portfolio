import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, tags = [], published } = body;

    // 必須フィールドのバリデーション
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'タイトル、スラッグ、内容は必須です' },
        { status: 400 }
      );
    }

    // スラッグの重複チェック
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: 'このスラッグは既に使用されています' },
        { status: 400 }
      );
    }

    // デフォルトユーザーを取得または作成（認証システムが実装されるまでの仮対応）
    let defaultUser = await prisma.user.findFirst();

    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          name: 'Administrator',
        },
      });
    }

    // タグを処理
    const tagConnections = [];
    for (const tagName of tags) {
      if (tagName.trim()) {
        // タグを取得または作成
        const tag = await prisma.tag.upsert({
          where: { name: tagName.trim() },
          update: {},
          create: {
            name: tagName.trim(),
            slug: tagName
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '-'),
          },
        });
        tagConnections.push({
          tagId: tag.id,
        });
      }
    }

    // 新しい記事を作成
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        published,
        authorId: defaultUser.id,
        publishedAt: published ? new Date() : null,
        tags: {
          create: tagConnections,
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      {
        error: '記事の作成に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const published = searchParams.get('published');
    const tag = searchParams.get('tag');

    const where: any = {};

    if (published === 'true') {
      where.published = true;
    } else if (published === 'false') {
      where.published = false;
    }

    if (tag) {
      where.tags = {
        some: {
          name: tag,
        },
      };
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.post.count({ where });

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: '記事の取得に失敗しました' },
      { status: 500 }
    );
  }
}

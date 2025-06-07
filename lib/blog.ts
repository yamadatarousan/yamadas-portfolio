import { prisma } from '@/lib/db'
import readingTime from 'reading-time'

// ブログ記事一覧を取得
export async function getPosts(options?: {
  limit?: number
  published?: boolean
  categorySlug?: string
  tagSlug?: string
  search?: string
}) {
  const {
    limit,
    published = true,
    categorySlug,
    tagSlug,
    search,
  } = options || {}

  try {
    const posts = await prisma.post.findMany({
      where: {
        published,
        ...(categorySlug && {
          category: {
            slug: categorySlug,
          },
        }),
        ...(tagSlug && {
          tags: {
            some: {
              tag: {
                slug: tagSlug,
              },
            },
          },
        }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
            { excerpt: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
        category: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      ...(limit && { take: limit }),
    })

    return posts as any[]
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return []
  }
}

// スラッグで特定の記事を取得
export async function getPostBySlug(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
        category: true,
      },
    })

    return post as any
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return null
  }
}

// IDで記事を取得（編集用）
export async function getPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
        category: true,
      },
    })

    return post as any
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return null
  }
}

// 関連記事を取得
export async function getRelatedPosts(postId: string, limit = 3) {
  try {
    // 現在の記事を取得してタグを確認
    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!currentPost) return []

    const tagIds = currentPost.tags.map((pt: any) => pt.tag.id)

    // 同じタグを持つ記事を検索（現在の記事は除外）
    const relatedPosts = await prisma.post.findMany({
      where: {
        id: { not: postId },
        published: true,
        tags: {
          some: {
            tagId: { in: tagIds },
          },
        },
      },
      include: {
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
        category: true,
      },
      take: limit,
      orderBy: {
        publishedAt: 'desc',
      },
    })

    return relatedPosts as any[]
  } catch (error) {
    console.error('Failed to fetch related posts:', error)
    return []
  }
}

// 全カテゴリを取得
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return categories
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

// 全タグを取得
export async function getTags() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return tags
  } catch (error) {
    console.error('Failed to fetch tags:', error)
    return []
  }
}

// 人気タグを取得（記事数の多い順）
export async function getPopularTags(limit = 10) {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        posts: {
          _count: 'desc',
        },
      },
      take: limit,
    })

    return tags.filter((tag: any) => tag._count.posts > 0)
  } catch (error) {
    console.error('Failed to fetch popular tags:', error)
    return []
  }
}

// 読了時間を計算
export function calculateReadingTime(content: string) {
  const stats = readingTime(content)
  return {
    text: stats.text,
    minutes: Math.ceil(stats.minutes),
    words: stats.words,
  }
}

// コンテンツからexcerptを生成
export function generateExcerpt(content: string, maxLength = 160) {
  // Markdownの記号を除去
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // ヘッダー
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1') // Italic
    .replace(/`(.*?)`/g, '$1') // Code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/!\[.*?\]\(.*?\)/g, '') // Images
    .replace(/>/g, '') // Blockquotes
    .replace(/\n+/g, ' ') // 改行をスペースに
    .trim()

  if (plainText.length <= maxLength) return plainText
  
  // 文の境界で切り取る
  const sentences = plainText.split('。')
  let excerpt = ''
  
  for (const sentence of sentences) {
    if ((excerpt + sentence + '。').length > maxLength) break
    excerpt += sentence + '。'
  }
  
  return excerpt || plainText.substring(0, maxLength) + '...'
} 
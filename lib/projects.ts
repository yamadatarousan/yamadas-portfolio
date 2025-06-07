import { prisma } from '@/lib/db'

// プロジェクト一覧を取得
export async function getProjects(options?: {
  limit?: number
  published?: boolean
  featured?: boolean
  technologySlug?: string
}) {
  const {
    limit,
    published = true,
    featured,
    technologySlug,
  } = options || {}

  try {
    const projects = await prisma.project.findMany({
      where: {
        published,
        ...(featured !== undefined && { featured }),
        ...(technologySlug && {
          technologies: {
            some: {
              technology: {
                slug: technologySlug,
              },
            },
          },
        }),
      },
      include: {
        technologies: {
          include: {
            technology: true,
          },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      ...(limit && { take: limit }),
    })

    return projects as any[]
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return []
  }
}

// スラッグで特定のプロジェクトを取得
export async function getProjectBySlug(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        technologies: {
          include: {
            technology: true,
          },
        },
      },
    })

    return project as any
  } catch (error) {
    console.error('Failed to fetch project:', error)
    return null
  }
}

// IDでプロジェクトを取得（編集用）
export async function getProjectById(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        technologies: {
          include: {
            technology: true,
          },
        },
      },
    })

    return project as any
  } catch (error) {
    console.error('Failed to fetch project:', error)
    return null
  }
}

// 注目プロジェクトを取得
export async function getFeaturedProjects(limit = 3) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        published: true,
        featured: true,
      },
      include: {
        technologies: {
          include: {
            technology: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return projects as any[]
  } catch (error) {
    console.error('Failed to fetch featured projects:', error)
    return []
  }
}

// 全技術タグを取得
export async function getTechnologies() {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return technologies
  } catch (error) {
    console.error('Failed to fetch technologies:', error)
    return []
  }
}

// 人気技術タグを取得（プロジェクト数の多い順）
export async function getPopularTechnologies(limit = 10) {
  try {
    const technologies = await prisma.technology.findMany({
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
      orderBy: {
        projects: {
          _count: 'desc',
        },
      },
      take: limit,
    })

    return technologies.filter((tech: any) => tech._count.projects > 0)
  } catch (error) {
    console.error('Failed to fetch popular technologies:', error)
    return []
  }
}

// 関連プロジェクトを取得
export async function getRelatedProjects(projectId: string, limit = 3) {
  try {
    // 現在のプロジェクトを取得して技術を確認
    const currentProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        technologies: {
          include: {
            technology: true,
          },
        },
      },
    })

    if (!currentProject) return []

    const technologyIds = currentProject.technologies.map((pt: any) => pt.technology.id)

    // 同じ技術を使うプロジェクトを検索（現在のプロジェクトは除外）
    const relatedProjects = await prisma.project.findMany({
      where: {
        id: { not: projectId },
        published: true,
        technologies: {
          some: {
            technologyId: { in: technologyIds },
          },
        },
      },
      include: {
        technologies: {
          include: {
            technology: true,
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return relatedProjects as any[]
  } catch (error) {
    console.error('Failed to fetch related projects:', error)
    return []
  }
}

// プロジェクトの統計情報を取得
export async function getProjectStats() {
  try {
    const [totalProjects, publishedProjects, featuredProjects, totalTechnologies] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.project.count({ where: { published: true, featured: true } }),
      prisma.technology.count(),
    ])

    return {
      total: totalProjects,
      published: publishedProjects,
      featured: featuredProjects,
      technologies: totalTechnologies,
    }
  } catch (error) {
    console.error('Failed to fetch project stats:', error)
    return {
      total: 0,
      published: 0,
      featured: 0,
      technologies: 0,
    }
  }
}

// GitHub APIからリポジトリ情報を取得（オプション）
export async function getGitHubRepoInfo(repoUrl: string) {
  if (!repoUrl || !process.env.GITHUB_TOKEN) {
    return null
  }

  try {
    // GitHubのURLからowner/repoを抽出
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null

    const [, owner, repo] = match
    const cleanRepo = repo.replace(/\.git$/, '')

    const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) return null

    const data = await response.json()

    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      updatedAt: data.updated_at,
      description: data.description,
    }
  } catch (error) {
    console.error('Failed to fetch GitHub repo info:', error)
    return null
  }
} 
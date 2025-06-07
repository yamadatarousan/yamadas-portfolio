// Blog関連の型
export type PostWithRelations = {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string | null
  published: boolean
  publishedAt?: Date | null
  createdAt: Date
  updatedAt: Date
  authorId: string
  categoryId?: string | null
  author: {
    id: string
    name: string
    email: string
    image?: string | null
  }
  category?: {
    id: string
    name: string
    slug: string
  } | null
  tags: {
    id: string
    tagId: string
    postId: string
    tag: {
      id: string
      name: string
      slug: string
    }
  }[]
}

export type PostTag = {
  postId: string
  tagId: string
  tag: Tag
}

// Project関連の型
export type ProjectWithRelations = Project & {
  technologies: (ProjectTechnology & { technology: Technology })[]
}

export type ProjectTechnology = {
  projectId: string
  technologyId: string
  technology: Technology
}

// GitHub API関連の型
export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
}

export interface GitHubStats {
  totalRepos: number
  totalStars: number
  totalCommits: number
  languages: { [key: string]: number }
}

// Contact Form関連の型
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// Navigation関連の型
export interface NavItem {
  title: string
  href: string
  disabled?: boolean
}

// SEO関連の型
export interface SEOData {
  title: string
  description: string
  image?: string
  url: string
}

// カテゴリの型
export type Category = {
  id: string
  name: string
  slug: string
  description?: string | null
  createdAt: Date
  updatedAt: Date
}

// タグの型
export type Tag = {
  id: string
  name: string
  slug: string
  description?: string | null
  createdAt: Date
  updatedAt: Date
}

// ユーザーの型
export type User = {
  id: string
  name: string
  email: string
  image?: string | null
  role: 'USER' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

// ブログ記事作成用の型
export type CreatePostData = {
  title: string
  content: string
  excerpt?: string
  categoryId?: string
  tagIds?: string[]
  published?: boolean
}

// ブログ記事更新用の型
export type UpdatePostData = Partial<CreatePostData> & {
  id: string
}

// ブログ検索用の型
export type BlogSearchParams = {
  search?: string
  category?: string
  tag?: string
  limit?: number
  published?: boolean
}

// APIレスポンス用の型
export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  count?: number
}

// プロジェクト関連の型
export type Project = {
  id: string
  title: string
  slug: string
  description: string
  content?: string | null
  features?: string | null
  challenges?: string | null
  githubUrl?: string | null
  demoUrl?: string | null
  imageUrl?: string | null
  featured: boolean
  published: boolean
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'
  startDate?: Date | null
  endDate?: Date | null
  createdAt: Date
  updatedAt: Date
}

export type Technology = {
  id: string
  name: string
  slug: string
  description?: string | null
  color?: string | null
  createdAt: Date
  updatedAt: Date
}

// プロジェクト検索用の型
export type ProjectSearchParams = {
  tech?: string
  featured?: string
  search?: string
  limit?: number
  published?: boolean
}

// プロジェクト作成用の型
export type CreateProjectData = {
  title: string
  slug: string
  description: string
  content?: string
  features?: string
  challenges?: string
  githubUrl?: string
  demoUrl?: string
  imageUrl?: string
  featured?: boolean
  published?: boolean
  status?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'
  startDate?: Date
  endDate?: Date
  technologyIds?: string[]
}

// プロジェクト更新用の型
export type UpdateProjectData = Partial<CreateProjectData> & {
  id: string
}

// GitHub情報の型
export type GitHubRepoInfo = {
  stars: number
  forks: number
  language: string | null
  updatedAt: string
  description: string | null
}

// プロジェクト統計の型
export type ProjectStats = {
  total: number
  published: number
  featured: number
  technologies: number
}

// 人気タグの型
export type PopularTag = {
  id: string
  name: string
  slug: string
  description?: string | null
  createdAt: Date
  updatedAt: Date
  _count: {
    posts: number
  }
}

// PostTag関連の型
export type PostTagWithTag = {
  id: string
  tagId: string
  postId: string
  tag: {
    id: string
    name: string
    slug: string
  }
} 
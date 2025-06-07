import { Post, Tag, Category, Project, Technology, User } from '@prisma/client'

// Blog関連の型
export type PostWithRelations = Post & {
  author: User
  tags: (PostTag & { tag: Tag })[]
  category: Category | null
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
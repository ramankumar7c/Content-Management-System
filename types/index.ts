export interface User {
  id: string
  name?: string | null
  email: string
  username?: string | null
  image?: string | null
  role: 'USER' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  thumbnail?: string | null
  excerpt?: string | null
  keywords: string[]
  categoryId?: string | null
  authorId: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: Date
  updatedAt: Date
  author: User
  category?: Category | null
}

export interface Category {
  id: string
  title: string
  slug: string
}

export interface CreatePostData {
  title: string
  content: string
  excerpt?: string
  keywords?: string[]
  categoryId?: string
  thumbnail?: string
  status?: 'DRAFT' | 'PUBLISHED'
}

export interface UpdatePostData extends Partial<CreatePostData> {
  slug?: string
}
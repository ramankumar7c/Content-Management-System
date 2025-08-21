'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  FileText,
  Search,
  Edit,
  Eye,
  Plus,
  ArrowLeft
} from 'lucide-react'

interface AdminPostItem {
  id: string
  title: string
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: string
  category?: { title: string } | null
}

export default function AdminPostsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<AdminPostItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    fetchPosts()
  }, [session, status, router])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/v1/posts?limit=50')
      const data = await res.json()
      if (res.ok) {
        setPosts(data.posts || [])
      }
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') return null

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Content Management</h1>
            </div>
            <CardDescription>Moderate and manage all posts</CardDescription>
          </div>
        </div>
        <Button asChild>
          <Link href="/dashboard/create">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      <Card className="border-0 bg-background/50 backdrop-blur-sm mb-6">
        <CardContent className="p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or slug..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Posts</CardTitle>
          <CardDescription>
            {filtered.length} post{filtered.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filtered.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{p.title}</h3>
                    <Badge variant={p.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                      {p.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">/{p.slug}</p>
                  {p.category?.title && (
                    <p className="text-xs text-muted-foreground">Category: {p.category.title}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/dashboard/edit/${p.slug}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  {p.status === 'PUBLISHED' && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/blog/${p.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No posts found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



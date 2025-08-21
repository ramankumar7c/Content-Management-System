'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  BarChart3, 
  PenTool, 
  Eye, 
  Users, 
  TrendingUp,
  Plus,
  BookOpen,
  Edit,
  Trash2,
  User
} from 'lucide-react'
import { Post } from '@/types'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user?.id) {
      fetchUserPosts()
    }
  }, [session, status, router])

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`/api/v1/posts?authorId=${session?.user?.id}&limit=5`)
      const data = await response.json()
      
      if (response.ok) {
        setPosts(data.posts)
        const published = data.posts.filter((p: Post) => p.status === 'PUBLISHED')
        const drafts = data.posts.filter((p: Post) => p.status === 'DRAFT')
        const totalViews = data.posts.reduce((sum: number, p: any) => sum + (p.views || 0), 0)
        setStats({
          totalPosts: data.posts.length,
          publishedPosts: published.length,
          draftPosts: drafts.length,
          totalViews
        })
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: BookOpen,
      description: 'All your posts'
    },
    {
      title: 'Published',
      value: stats.publishedPosts,
      icon: Eye,
      description: 'Live posts'
    },
    {
      title: 'Drafts',
      value: stats.draftPosts,
      icon: PenTool,
      description: 'Work in progress'
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: TrendingUp,
      description: 'All time views'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your content and activity.
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button asChild variant="outline">
            <Link href="/dashboard/settings">
              <User className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/create">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>
              Your latest blog posts and their status
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/posts">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Start creating your first blog post to see it here.
              </p>
              <Button asChild>
                <Link href="/dashboard/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Post
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <Badge 
                        variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'}
                      >
                        {post.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      {post.category && (
                        <span>{post.category.title}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/edit/${post.slug}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    {post.status === 'PUBLISHED' && (
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
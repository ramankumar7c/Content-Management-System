'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  FileText, 
  FolderOpen, 
  TrendingUp, 
  Shield,
  Plus,
  Settings,
  BarChart3,
  AlertTriangle
} from 'lucide-react'

interface AdminStats {
  totalUsers: number
  totalPosts: number
  totalCategories: number
  publishedPosts: number
  draftPosts: number
  pendingPosts: number
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPosts: 0,
    totalCategories: 0,
    publishedPosts: 0,
    draftPosts: 0,
    pendingPosts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    fetchAdminStats()
  }, [session, status, router])

  const fetchAdminStats = async () => {
    try {
      const [usersRes, postsRes, categoriesRes] = await Promise.all([
        fetch('/api/v1/users'),
        fetch('/api/v1/posts'),
        fetch('/api/v1/categories')
      ])

      const usersData = await usersRes.json()
      const postsData = await postsRes.json()
      const categoriesData = await categoriesRes.json()

      const posts = postsData.posts || []
      const publishedPosts = posts.filter((p: any) => p.status === 'PUBLISHED').length
      const draftPosts = posts.filter((p: any) => p.status === 'DRAFT').length
      const pendingPosts = posts.filter((p: any) => p.status === 'ARCHIVED').length

      setStats({
        totalUsers: usersData.users?.length || 0,
        totalPosts: posts.length,
        totalCategories: categoriesData.categories?.length || 0,
        publishedPosts,
        draftPosts,
        pendingPosts
      })
    } catch (error) {
      console.error('Error fetching admin stats:', error)
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

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      description: 'Registered users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      description: 'All blog posts',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: FolderOpen,
      description: 'Content categories',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Published',
      value: stats.publishedPosts,
      icon: TrendingUp,
      description: 'Live posts',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: Users,
      href: '/admin/users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Content Management',
      description: 'Moderate and manage all posts',
      icon: FileText,
      href: '/admin/posts',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Categories',
      description: 'Manage content categories',
      icon: FolderOpen,
      href: '/admin/categories',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: Settings,
      href: '/admin/settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your content management system
          </p>
        </div>
        <Badge variant="secondary" className="mt-2 md:mt-0">
          Admin Access
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-0 bg-background/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
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

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="border-0 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className={`p-3 rounded-lg ${action.bgColor} w-fit mb-4`}>
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {action.description}
                </p>
                <Button asChild className="w-full">
                  <Link href={action.href}>
                    {action.title}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Posts */}
        <Card className="border-0 bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Recent Posts</span>
            </CardTitle>
            <CardDescription>
              Latest blog posts across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Getting Started with our CMS</p>
                  <p className="text-sm text-muted-foreground">By John Doe</p>
                </div>
                <Badge variant="default">Published</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Advanced Content Management</p>
                  <p className="text-sm text-muted-foreground">By Jane Smith</p>
                </div>
                <Badge variant="secondary">Draft</Badge>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/admin/posts">View All Posts</Link>
            </Button>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-0 bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>System Status</span>
            </CardTitle>
            <CardDescription>
              Current system health and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge variant="default">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Status</span>
                <Badge variant="default">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <Badge variant="secondary">75% Used</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Backup</span>
                <Badge variant="outline">2 hours ago</Badge>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/admin/settings">System Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
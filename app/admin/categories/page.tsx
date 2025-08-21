'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FolderOpen, Plus, ArrowLeft } from 'lucide-react'

interface Category {
  id: string
  title: string
  slug: string
}

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    fetchCategories()
  }, [session, status, router])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/v1/categories')
      const data = await res.json()
      if (res.ok) setCategories(data.categories || [])
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!title || !slug) return setError('Title and slug are required')

    try {
      const res = await fetch('/api/v1/categories?admin=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug })
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess('Category created')
        setCategories(prev => [data, ...prev])
        setTitle('')
        setSlug('')
      } else {
        setError(data.error || 'Failed to create category')
      }
    } catch {
      setError('Failed to create category')
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FolderOpen className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Categories</h1>
            </div>
            <CardDescription>Manage content categories</CardDescription>
          </div>
        </div>
      </div>

      <Card className="border-0 bg-background/50 backdrop-blur-sm mb-6">
        <CardHeader>
          <CardTitle>Create Category</CardTitle>
          <CardDescription>Add a new category</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>
          )}
          {success && (
            <Alert className="mb-4"><AlertDescription>{success}</AlertDescription></Alert>
          )}
          <form onSubmit={createCategory} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Technology" />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={slug} onChange={e => setSlug(e.target.value)} placeholder="e.g. technology" />
            </div>
            <div className="md:col-span-2">
              <Button type="submit"><Plus className="h-4 w-4 mr-2" />Create</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-0 bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>{categories.length} found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map(c => (
              <div key={c.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-sm text-muted-foreground">/{c.slug}</div>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No categories yet</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



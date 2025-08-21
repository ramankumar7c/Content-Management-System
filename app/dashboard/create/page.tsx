'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import RichTextEditor from '@/components/editor/rich-text-editor'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  EyeOff, 
  Upload,
  Image as ImageIcon,
  Tag,
  FileText
} from 'lucide-react'
import { Category } from '@/types'

export default function CreatePostPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    categoryId: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
    thumbnail: '',
    keywords: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    fetchCategories()
  }, [status, router])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/v1/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/v1/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean)
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Post created successfully!')
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError(data.error || 'Failed to create post')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Post</h1>
            <p className="text-muted-foreground">
              Write and publish your next blog post
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Post Title *</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter your post title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="h-12 text-lg"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                label="Content *"
                placeholder="Start writing your post content..."
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                placeholder="Brief description of your post (optional)"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                Leave empty to auto-generate from content
              </p>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                name="keywords"
                type="text"
                placeholder="seo, keywords, separated, by, commas"
                value={formData.keywords}
                onChange={handleInputChange}
              />
              <p className="text-sm text-muted-foreground">
                Separate keywords with commas for better SEO
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center space-x-4 pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !formData.title || !formData.content}
                className="h-12 px-8"
              >
                {isLoading ? (
                  'Creating...'
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {formData.status === 'DRAFT' ? 'Save Draft' : 'Publish Post'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Post Settings */}
          <Card className="border-0 bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Post Settings</span>
              </CardTitle>
              <CardDescription>
                Configure your post settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">
                      <div className="flex items-center space-x-2">
                        <EyeOff className="h-4 w-4" />
                        <span>Draft</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="PUBLISHED">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>Published</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleSelectChange('categoryId', value)}
                  disabled={categories.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={categories.length === 0 ? 'No categories available' : 'Select a category'} />
                  </SelectTrigger>
                  {categories.length > 0 && (
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  )}
                </Select>
                {categories.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No categories found. Go to Admin → Categories to create one.
                  </p>
                )}
              </div>

              <Separator />

              {/* Thumbnail */}
              <div className="space-y-2">
                <Label>Thumbnail URL</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="thumbnail"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.thumbnail}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Optional: Add a featured image for your post
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="border-0 bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.title ? (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">{formData.title}</h3>
                  {formData.excerpt && (
                    <p className="text-sm text-muted-foreground">{formData.excerpt}</p>
                  )}
                  <div className="flex items-center space-x-2">
                    <Badge variant={formData.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                      {formData.status}
                    </Badge>
                    {formData.categoryId && (
                      <Badge variant="outline">
                        {categories.find(c => c.id === formData.categoryId)?.title}
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Start typing to see a preview of your post
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
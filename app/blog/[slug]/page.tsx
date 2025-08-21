'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Tag,
  Share2,
  BookOpen
} from 'lucide-react'
import { Post } from '@/types'

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string)
    }
  }, [params.slug])

  const fetchPost = async (slug: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/v1/posts/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data.post)
        if (data.post.categoryId) {
          fetchRelatedPosts(data.post.categoryId, data.post.id)
        }
      } else {
        setError('Post not found')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      setError('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedPosts = async (categoryId: string, excludePostId: string) => {
    try {
      const response = await fetch(`/api/v1/posts?category=${categoryId}&limit=3&status=PUBLISHED`)
      if (response.ok) {
        const data = await response.json()
        const filtered = data.posts.filter((p: Post) => p.id !== excludePostId)
        setRelatedPosts(filtered.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching related posts:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const sharePost = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could add a toast notification here
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-96 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="h-24 w-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Post not found</h3>
              <p className="text-muted-foreground mb-4">
                The post you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Post Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              {post.category && (
                <Badge variant="outline">
                  {post.category.title}
                </Badge>
              )}
              <Badge variant="secondary">
                {post.status}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Post Meta */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-muted-foreground mb-8">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.image || ''} alt={post.author.name || ''} />
                <AvatarFallback>
                  {post.author.name?.charAt(0) || post.author.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{post.author.name || 'Anonymous'}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.createdAt.toString())}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{estimateReadingTime(post.content)} min read</span>
            </div>
          </div>

          {/* Thumbnail */}
          {post.thumbnail && (
            <div className="relative h-96 md:h-[500px] overflow-hidden rounded-xl mb-8">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="border-0 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div 
                    className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-r"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  
                  {/* Keywords */}
                  {post.keywords && post.keywords.length > 0 && (
                    <div className="mt-8 pt-6 border-t">
                      <div className="flex items-center space-x-2 mb-3">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Keywords:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {post.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Share */}
              <Card className="border-0 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Share this post</h3>
                  <Button onClick={sharePost} className="w-full" variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </CardContent>
              </Card>

              {/* Author Info */}
              <Card className="border-0 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">About the author</h3>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={post.author.image || ''} alt={post.author.name || ''} />
                      <AvatarFallback>
                        {post.author.name?.charAt(0) || post.author.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{post.author.name || 'Anonymous'}</p>
                      <p className="text-sm text-muted-foreground">{post.author.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <Card className="border-0 bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Related posts</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <Link
                          key={relatedPost.id}
                          href={`/blog/${relatedPost.slug}`}
                          className="block group"
                        >
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(relatedPost.createdAt.toString())}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
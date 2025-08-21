import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    let post = null as any
    if (session?.user?.role === 'ADMIN') {
      // Do not count views from admins
      post = await prisma.post.findUnique({
        where: { slug: params.slug },
        include: {
          author: { select: { id: true, name: true, email: true, image: true } },
          category: true,
        },
      })
    } else {
      // Increment views for everyone else
      post = await prisma.post
        .update({
          where: { slug: params.slug },
          data: { views: { increment: 1 } },
          include: {
            author: { select: { id: true, name: true, email: true, image: true } },
            category: true,
          },
        })
        .catch(async () => {
          // If post doesn't exist, fall back to findUnique to return 404
          return null
        })
    }

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()
    const { title, content, excerpt, categoryId, status, thumbnail, keywords } = body

    const post = await prisma.post.update({
      where: { slug: params.slug },
      data: {
        title,
        content,
        excerpt,
        categoryId,
        status,
        thumbnail,
        keywords,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, image: true },
        },
        category: true,
      },
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await prisma.post.delete({
      where: { slug: params.slug },
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
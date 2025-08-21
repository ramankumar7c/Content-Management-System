import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
  // Allow empty string or omit; validate URL only if provided
  thumbnail: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    z.string().url().optional()
  ),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
})

export const updatePostSchema = createPostSchema.partial().extend({
  slug: z.string().optional(),
})

export type CreatePostFormData = z.infer<typeof createPostSchema>
export type UpdatePostFormData = z.infer<typeof updatePostSchema>
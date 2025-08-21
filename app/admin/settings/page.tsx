'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Shield, Save } from 'lucide-react'

export default function AdminSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

  if (status === 'loading' || !session || session.user.role !== 'ADMIN') return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">System Settings</h1>
      </div>

      <Card className="border-0 bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Basic Configuration</CardTitle>
          <CardDescription>These are display-only placeholders for now</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Site Name</Label>
              <Input value="CMS" readOnly />
            </div>
            <div>
              <Label>Environment</Label>
              <Input value={process.env.NODE_ENV || 'development'} readOnly />
            </div>
            <div>
              <Label>NextAuth URL</Label>
              <Input value={process.env.NEXTAUTH_URL || ''} readOnly />
            </div>
            <div>
              <Label>Database URL</Label>
              <Input value={process.env.DATABASE_URL ? 'Configured' : 'Missing'} readOnly />
            </div>
          </div>
          <Separator className="my-6" />
          <Button disabled>
            <Save className="h-4 w-4 mr-2" />
            Save (coming soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}



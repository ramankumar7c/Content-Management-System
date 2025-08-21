import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Users, 
  Shield, 
  Zap, 
  Palette, 
  Globe,
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Rich Content Editor',
      description: 'Create beautiful content with our advanced WYSIWYG editor supporting markdown, media, and more.'
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Complete user system with role-based access control, profiles, and authentication.'
    },
    {
      icon: Shield,
      title: 'Admin Panel',
      description: 'Powerful admin dashboard for managing users, content, and system settings.'
    },
    {
      icon: Zap,
      title: 'Fast & Scalable',
      description: 'Built with Next.js 14 and modern web technologies for optimal performance.'
    },
    {
      icon: Palette,
      title: 'Beautiful Design',
      description: 'Clean, responsive design with dark/light theme support and mobile optimization.'
    },
    {
      icon: Globe,
      title: 'SEO Optimized',
      description: 'Built-in SEO features including meta tags, sitemaps, and structured data.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Content Creator',
      content: 'This CMS has transformed how I manage my blog. The interface is intuitive and the features are exactly what I need.',
      rating: 5
    },
    {
      name: 'Mike Johnson',
      role: 'Tech Blogger',
      content: 'Finally, a CMS that developers actually enjoy using. Clean code, great performance, and excellent documentation.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Manager',
      content: 'The admin panel makes content management a breeze. Our team can collaborate effectively and publish content quickly.',
      rating: 5
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6">
              <Star className="h-3 w-3 mr-1" />
              Now in Beta
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              The Modern{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Content Management
              </span>{' '}
              System
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create, manage, and publish content with ease. Built for creators, developers, and businesses who demand the best.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/auth/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8">
                <Link href="/blog">View Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make content creation and management effortless.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div className="text-primary-foreground/80">Active Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
              <div className="text-primary-foreground/80">Posts Published</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
              <div className="text-primary-foreground/80">Uptime</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-primary-foreground/80">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by creators worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our users are saying about this CMS.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-secondary/5">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join thousands of creators who trust our CMS for their content management needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="h-12 px-8">
                <Link href="/auth/signup">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
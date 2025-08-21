import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  CheckCircle,
  Code,
  Database,
  Server
} from 'lucide-react'

export default function AboutPage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Rich Content Editor',
      description: 'Advanced WYSIWYG editor with markdown support, media embedding, and real-time collaboration.'
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

  const techStack = [
    {
      icon: Code,
      title: 'Frontend',
      description: 'Next.js 14, React 18, TypeScript, Tailwind CSS',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Database,
      title: 'Database',
      description: 'MongoDB with Prisma ORM for type-safe database operations',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Server,
      title: 'Backend',
      description: 'Next.js API routes, NextAuth.js for authentication',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  const team = [
    {
      name: 'Development Team',
      role: 'Full-Stack Development',
      description: 'Building modern web applications with cutting-edge technologies.'
    },
    {
      name: 'Design Team',
      role: 'UI/UX Design',
      description: 'Creating beautiful and intuitive user experiences.'
    },
    {
      name: 'QA Team',
      role: 'Quality Assurance',
      description: 'Ensuring the highest quality standards across all features.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <Badge variant="secondary" className="mb-6">
            <Star className="h-3 w-3 mr-1" />
            About Our CMS
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Building the Future of{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Content Management
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Our CMS is a modern, developer-friendly content management system designed to empower creators, 
            developers, and businesses to build and manage exceptional digital experiences.
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
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe that content management should be powerful yet simple, flexible yet secure, 
              and beautiful yet functional. Our mission is to provide developers and content creators 
              with the tools they need to build amazing digital experiences without compromising on 
              performance, security, or user experience.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our CMS?
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
        </section>

        {/* Tech Stack Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We use the latest and greatest technologies to ensure the best performance and developer experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {techStack.map((tech, index) => (
              <Card key={index} className="border-0 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className={`p-3 rounded-lg ${tech.bgColor} w-fit mx-auto mb-4`}>
                    <tech.icon className={`h-6 w-6 ${tech.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{tech.title}</h3>
                  <p className="text-muted-foreground">{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dedicated professionals working together to build the best CMS experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="rounded-lg bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 bg-background/50 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Quality</h3>
                <p className="text-sm text-muted-foreground">We never compromise on quality</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-background/50 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Innovation</h3>
                <p className="text-sm text-muted-foreground">Always pushing the boundaries</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-background/50 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-sm text-muted-foreground">Building together with our users</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-background/50 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <Shield className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Security</h3>
                <p className="text-sm text-muted-foreground">Your data is always safe</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="border-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to get started?
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
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
                  <Link href="/blog">View Demo</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
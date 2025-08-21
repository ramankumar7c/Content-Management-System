import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          return null
        }

        // Note: For OAuth users, password might be null
        if (user.password && await bcrypt.compare(credentials.password, user.password)) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        }

        return null
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, account }) {
      // On first sign-in, merge DB user fields
      if (user) {
        token.role = (user as any).role
        // Fetch extra fields from DB
        const dbUser = await prisma.user.findUnique({ where: { id: (user as any).id } })
        if (dbUser) {
          token.username = dbUser.username || null
          token.createdAt = dbUser.createdAt?.toISOString()
          token.updatedAt = dbUser.updatedAt?.toISOString()
        }
      } else if (token?.sub) {
        // For subsequent requests, ensure token has latest info
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub } })
        if (dbUser) {
          token.role = dbUser.role
          token.username = dbUser.username || null
          token.createdAt = dbUser.createdAt?.toISOString()
          token.updatedAt = dbUser.updatedAt?.toISOString()
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = (token.role as string) || 'USER'
        session.user.username = (token.username as string | null) || null
        session.user.createdAt = (token.createdAt as string | undefined)
        session.user.updatedAt = (token.updatedAt as string | undefined)
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}
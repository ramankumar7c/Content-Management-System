import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: string
      username?: string | null
      createdAt?: string
      updatedAt?: string
    }
  }

  interface User {
    role?: string | null
    username?: string | null
    createdAt?: string
    updatedAt?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    username?: string | null
    createdAt?: string
    updatedAt?: string
  }
}
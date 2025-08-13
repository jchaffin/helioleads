import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { JWT } from 'next-auth/jwt'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // In production, validate against your database
        if (credentials?.email === 'admin@helioleads.com' && credentials?.password === 'demo123') {
          return {
            id: '1',
            email: 'admin@helioleads.com',
            name: 'Demo Admin',
            company: 'SolarTech Solutions',
            role: 'admin'
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/auth/signin'
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET || 'helio-leads-jwt-secret-key-2024',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      // Persist user data in the JWT token
      if (user && account) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.company = user.company
        token.role = user.role
        token.accessToken = account.access_token
        token.iat = Math.floor(Date.now() / 1000)
        token.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.company = token.company as string
        session.user.role = token.role as string
        session.accessToken = token.accessToken as string
        session.expires = new Date(token.exp as number * 1000).toISOString()
      }
      return session
    }
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log('User signed in:', { user: user.email, timestamp: new Date().toISOString() })
    },
    async signOut({ token }) {
      console.log('User signed out:', { user: token?.email, timestamp: new Date().toISOString() })
    }
  }
})

export { handler as GET, handler as POST }

import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id: string
      email: string
      name: string
      company: string
      role: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    company: string
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string
    company: string
    role: string
    accessToken?: string
    iat: number
    exp: number
  }
}

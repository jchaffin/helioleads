import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

const secret = process.env.NEXTAUTH_SECRET || 'helio-leads-jwt-secret-key-2024'

export async function getJwtToken(req: NextRequest) {
  try {
    const token = await getToken({ 
      req, 
      secret,
      cookieName: 'next-auth.session-token'
    })
    return token
  } catch (error) {
    console.error('Error getting JWT token:', error)
    return null
  }
}

export function isTokenExpired(token: any): boolean {
  if (!token || !token.exp) return true
  
  const currentTime = Math.floor(Date.now() / 1000)
  return token.exp < currentTime
}

export function getTokenTimeRemaining(token: any): number {
  if (!token || !token.exp) return 0
  
  const currentTime = Math.floor(Date.now() / 1000)
  return Math.max(0, token.exp - currentTime)
}

export function formatTokenExpiry(token: any): string {
  if (!token || !token.exp) return 'Invalid token'
  
  const expiryDate = new Date(token.exp * 1000)
  return expiryDate.toLocaleString()
}

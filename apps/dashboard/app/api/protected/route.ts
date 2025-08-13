import { NextRequest, NextResponse } from 'next/server'
import { getJwtToken, isTokenExpired } from '../../../lib/jwt'

export async function GET(req: NextRequest) {
  try {
    const token = await getJwtToken(req)
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token found' }, 
        { status: 401 }
      )
    }
    
    if (isTokenExpired(token)) {
      return NextResponse.json(
        { error: 'Token expired' }, 
        { status: 401 }
      )
    }
    
    // Return protected data
    return NextResponse.json({
      message: 'Access granted',
      user: {
        id: token.id,
        email: token.email,
        name: token.name,
        company: token.company,
        role: token.role
      },
      tokenInfo: {
        issued: new Date(token.iat * 1000).toISOString(),
        expires: new Date(token.exp * 1000).toISOString()
      }
    })
  } catch (error) {
    console.error('Protected route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getJwtToken(req)
    
    if (!token || isTokenExpired(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }
    
    const body = await req.json()
    
    // Example protected operation
    return NextResponse.json({
      message: 'Protected POST operation successful',
      data: body,
      user: token.email
    })
  } catch (error) {
    console.error('Protected POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

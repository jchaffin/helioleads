'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import LandingPage from '../components/LandingPage'
import Dashboard from '../components/Dashboard'

export default function Page() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (session) {
    return <Dashboard />
  }

  return <LandingPage />
}


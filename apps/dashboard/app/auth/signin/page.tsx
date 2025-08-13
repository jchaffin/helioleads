'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Sun, Zap, Phone } from 'lucide-react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.ok) {
      router.push('/dashboard')
    } else {
      alert('Invalid credentials')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-yellow-500 to-orange-600 items-center justify-center p-12">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-8">
              <Sun className="w-16 h-16 mr-4" />
              <h1 className="text-5xl font-bold">HelioLeads</h1>
            </div>
            <p className="text-xl mb-8 opacity-90">
              AI-Powered Voice Solutions for Commercial Solar
            </p>
            <div className="grid grid-cols-1 gap-6 max-w-md">
              <div className="flex items-center">
                <Phone className="w-6 h-6 mr-3" />
                <span>Automated Lead Qualification</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-6 h-6 mr-3" />
                <span>Real-time Analytics</span>
              </div>
              <div className="flex items-center">
                <Sun className="w-6 h-6 mr-3" />
                <span>Solar Industry Focused</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-12">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center lg:hidden mb-4">
                <Sun className="w-12 h-12 mr-3 text-orange-500" />
                <h1 className="text-3xl font-bold text-gray-900">HelioLeads</h1>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-600 mt-2">Sign in to your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="admin@helioleads.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="demo123"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Demo credentials: admin@helioleads.com / demo123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

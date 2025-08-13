'use client'

import { useState, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { 
  Sun, 
  Phone, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  Activity, 
  PhoneCall,
  Calendar,
  Target,
  LogOut,
  BarChart3,
  PieChart,
  Shield,
  Key
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts'
import Badge from './ui/Badge'
import Skeleton from './ui/Skeleton'
import AppShell from './ui/AppShell'

type CallDatum = { name: string; calls: number; qualified: number; appointments: number }
type ConversionDatum = { name: string; value: number; color: string }
type RecentCall = { id: number; company: string; duration: string; status: string; score: number }

function useLeadData() {
  const [callData, setCallData] = useState<CallDatum[]>([])
  const [conversionData, setConversionData] = useState<ConversionDatum[]>([])
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([])
  const [loadingLeads, setLoadingLeads] = useState(true)
  const [leadError, setLeadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoadingLeads(true)
        const res = await fetch('/api/leads', { cache: 'no-store' })
        if (!res.ok) throw new Error(`Failed to load leads: ${res.status}`)
        const data = await res.json()
        if (cancelled) return
        setCallData(data.callData ?? [])
        setConversionData(data.conversionData ?? [])
        setRecentCalls(data.recentCalls ?? [])
      } catch (e: any) {
        if (!cancelled) setLeadError(e?.message || 'Error loading leads')
      } finally {
        if (!cancelled) setLoadingLeads(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { callData, conversionData, recentCalls, loadingLeads, leadError }
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('overview')
  const [tokenInfo, setTokenInfo] = useState<any>(null)
  const [tokenExpiry, setTokenExpiry] = useState<string>('')
  const { callData, conversionData, recentCalls, loadingLeads, leadError } = useLeadData()

  useEffect(() => {
    // Fetch protected data to test JWT token
    const fetchTokenInfo = async () => {
      try {
        const response = await fetch('/api/protected')
        if (response.ok) {
          const data = await response.json()
          setTokenInfo(data)
          if (data.tokenInfo?.expires) {
            setTokenExpiry(new Date(data.tokenInfo.expires).toLocaleString())
          }
        }
      } catch (error) {
        console.error('Error fetching token info:', error)
      }
    }

    if (session) {
      fetchTokenInfo()
    }
  }, [session])

  const stats = [
    {
      title: 'Total Calls Today',
      value: '67',
      change: '+12%',
      icon: PhoneCall,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Qualified Leads',
      value: '29',
      change: '+18%',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Appointments Set',
      value: '18',
      change: '+25%',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Revenue Pipeline',
      value: '$142K',
      change: '+32%',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <AppShell title="Dashboard">
      {/* Header disabled (AppShell provides topbar) */}
      {false && (
      <header className="bg-white/90 backdrop-blur border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sun className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  HelioLeads Dashboard
                </h1>
                <p className="text-sm text-gray-500">{session?.user?.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                <p className="text-xs text-gray-500">{session?.user?.email}</p>
                {tokenExpiry && (
                  <p className="text-xs text-orange-600">Token expires: {tokenExpiry}</p>
                )}
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>
      )}

      {/* Navigation Tabs disabled (AppShell handles nav) */}
      {false && (
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'calls', label: 'Call Analytics', icon: Phone },
              { id: 'performance', label: 'Performance', icon: TrendingUp },
              { id: 'security', label: 'Security', icon: Shield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-card border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-brand-50`}>
                      <stat.icon className={`w-6 h-6 text-brand-600`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Calls Chart */}
              <div className="bg-white rounded-lg p-6 shadow-card border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Call Activity</h3>
                {loadingLeads ? (
                  <Skeleton className="h-72" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={callData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="calls" stroke="#f97316" strokeWidth={2} />
                      <Line type="monotone" dataKey="qualified" stroke="#eab308" strokeWidth={2} />
                      <Line type="monotone" dataKey="appointments" stroke="#22c55e" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Conversion Funnel */}
              <div className="bg-white rounded-lg p-6 shadow-card border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Conversion Funnel</h3>
                {loadingLeads ? (
                  <Skeleton className="h-72" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={conversionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {conversionData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Recent Calls Table */}
            <div className="bg-white rounded-lg shadow-card border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Calls</h3>
              </div>
              {loadingLeads && (
                <div className="p-6 text-gray-500">Loading recent calls...</div>
              )}
              {leadError && (
                <div className="p-6 text-red-600">{leadError}</div>
              )}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        AI Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentCalls.map((call) => (
                      <tr key={call.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {call.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {call.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {call.status === 'Qualified' && <Badge tone="green">Qualified</Badge>}
                          {call.status === 'Appointment' && <Badge tone="blue">Appointment</Badge>}
                          {call.status === 'Follow-up' && <Badge tone="amber">Follow-up</Badge>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="mr-2">{call.score}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full" 
                                style={{ width: `${call.score}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calls' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-card border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Volume Analysis</h3>
              {loadingLeads ? (
                <Skeleton className="h-96" />
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={callData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calls" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                <Activity className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg Call Quality</h3>
                <p className="text-3xl font-bold text-orange-600">87%</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg Call Duration</h3>
                <p className="text-3xl font-bold text-blue-600">11:42</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversion Rate</h3>
                <p className="text-3xl font-bold text-green-600">32%</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8">
            {/* JWT Token Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Key className="w-6 h-6 text-orange-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">JWT Token Information</h3>
              </div>
              
              {tokenInfo ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">User Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">User ID:</span>
                        <span className="font-mono text-gray-900">{tokenInfo.user?.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="text-gray-900">{tokenInfo.user?.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Role:</span>
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                          {tokenInfo.user?.role}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company:</span>
                        <span className="text-gray-900">{tokenInfo.user?.company}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Token Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Issued:</span>
                        <span className="text-gray-900">
                          {tokenInfo.tokenInfo?.issued ? new Date(tokenInfo.tokenInfo.issued).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expires:</span>
                        <span className="text-gray-900">
                          {tokenInfo.tokenInfo?.expires ? new Date(tokenInfo.tokenInfo.expires).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          Valid
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading token information...</p>
                </div>
              )}
            </div>

            {/* Security Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">JWT Authentication</h3>
                <p className="text-sm text-gray-600">Secure token-based authentication with 24-hour expiry</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                <Key className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Management</h3>
                <p className="text-sm text-gray-600">Automatic token refresh and secure session handling</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                <Activity className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Control</h3>
                <p className="text-sm text-gray-600">Role-based permissions and protected API routes</p>
              </div>
            </div>

            {/* API Test */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Protected API Test</h3>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/protected', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ test: 'data', timestamp: new Date().toISOString() })
                    })
                    const data = await response.json()
                    alert(`API Response: ${JSON.stringify(data, null, 2)}`)
                  } catch (error) {
                    alert('API Error: ' + error)
                  }
                }}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-200"
              >
                Test Protected API
              </button>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  )
}

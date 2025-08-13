'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import AppShell from '../../../components/ui/AppShell'
import Badge from '../../../components/ui/Badge'

type Lead = {
  id: string
  company: string
  contact: string
  status: 'New' | 'Qualified' | 'Appointment' | 'Follow-up'
  source: string
  lastActivity: string
  owner: string
}

const mockLeads: Lead[] = [
  { id: '1', company: 'ABC Manufacturing', contact: 'Jane Doe', status: 'Qualified', source: 'Inbound', lastActivity: '2025-08-09 14:10', owner: 'Alex' },
  { id: '2', company: 'Green Energy Co', contact: 'Mark Li', status: 'Appointment', source: 'Website', lastActivity: '2025-08-10 09:20', owner: 'Sam' },
  { id: '3', company: 'Solar Dynamics', contact: 'Priya K', status: 'Follow-up', source: 'Outbound', lastActivity: '2025-08-10 12:45', owner: 'Alex' },
  { id: '4', company: 'Tech Solutions Inc', contact: 'Chris P', status: 'New', source: 'Referral', lastActivity: '2025-08-11 10:05', owner: 'Taylor' }
]

export default function LeadsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) router.push('/auth/signin')
  }, [session, status, router])

  const data = useMemo(() => {
    return mockLeads.filter(l => (
      (!statusFilter || l.status === statusFilter) &&
      (!q || l.company.toLowerCase().includes(q.toLowerCase()) || l.contact.toLowerCase().includes(q.toLowerCase()))
    ))
  }, [q, statusFilter])

  return (
    <AppShell title="Leads">
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search company or contact"
            className="h-9 w-full sm:w-80 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/60"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 w-full sm:w-44 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/60"
          >
            <option value="">All Statuses</option>
            <option>New</option>
            <option>Qualified</option>
            <option>Appointment</option>
            <option>Follow-up</option>
          </select>
          <button className="h-9 px-3 text-sm rounded-md bg-orange-600 text-white hover:bg-orange-700">New Lead</button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-card border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Company</th>
                  <th className="px-4 py-2 text-left font-medium">Contact</th>
                  <th className="px-4 py-2 text-left font-medium">Status</th>
                  <th className="px-4 py-2 text-left font-medium">Source</th>
                  <th className="px-4 py-2 text-left font-medium">Last Activity</th>
                  <th className="px-4 py-2 text-left font-medium">Owner</th>
                  <th className="px-4 py-2 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-900">{l.company}</td>
                    <td className="px-4 py-2 text-gray-700">{l.contact}</td>
                    <td className="px-4 py-2">
                      {l.status === 'Qualified' && <Badge tone="green">Qualified</Badge>}
                      {l.status === 'Appointment' && <Badge tone="blue">Appointment</Badge>}
                      {l.status === 'Follow-up' && <Badge tone="amber">Follow-up</Badge>}
                      {l.status === 'New' && <Badge>New</Badge>}
                    </td>
                    <td className="px-4 py-2 text-gray-700">{l.source}</td>
                    <td className="px-4 py-2 text-gray-700">{l.lastActivity}</td>
                    <td className="px-4 py-2 text-gray-700">{l.owner}</td>
                    <td className="px-4 py-2">
                      <button className="text-orange-600 hover:text-orange-700 mr-3">View</button>
                      <button className="text-gray-600 hover:text-gray-800">Call</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  )
}


'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AppShell from '../../../components/ui/AppShell'

export default function CalendarPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) router.push('/auth/signin')
  }, [session, status, router])

  return (
    <AppShell title="Calendar">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-4 shadow-card border border-gray-100 xl:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h3>
          <div className="h-[360px] grid place-items-center border border-dashed border-gray-200 rounded-md">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Connect your calendar to populate events</p>
              <button className="px-3 py-1.5 text-sm rounded-md bg-orange-600 text-white hover:bg-orange-700">Connect Google</button>
              <button className="ml-2 px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Connect Microsoft</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-card border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between"><span>Mon</span><span>9:00–17:00</span></div>
            <div className="flex justify-between"><span>Tue</span><span>9:00–17:00</span></div>
            <div className="flex justify-between"><span>Wed</span><span>9:00–17:00</span></div>
            <div className="flex justify-between"><span>Thu</span><span>9:00–17:00</span></div>
            <div className="flex justify-between"><span>Fri</span><span>9:00–15:00</span></div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}


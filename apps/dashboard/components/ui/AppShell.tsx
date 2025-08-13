import React from 'react'
import { LayoutDashboard, Users, Calendar as CalendarIcon, PhoneCall, BarChart3, Settings, Database } from 'lucide-react'

type NavItem = { name: string; icon: React.ComponentType<any>; href?: string }

const nav: NavItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Leads', icon: Users, href: '/dashboard/leads' },
  { name: 'Accounts', icon: Database, href: '/dashboard/accounts' },
  { name: 'Calendar', icon: CalendarIcon, href: '/dashboard/calendar' },
  { name: 'Calls', icon: PhoneCall, href: '/dashboard/calls' },
  { name: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' }
]

export default function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-60 border-r border-gray-200 bg-white">
        <div className="h-14 px-4 flex items-center border-b border-gray-200">
          <span className="text-lg font-semibold">HelioLeads</span>
        </div>
        <nav className="p-2 space-y-1">
          {nav.map((item) => (
            <a key={item.name} href={item.href || '#'} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">
              <item.icon className="w-4 h-4 text-gray-500" />
              <span>{item.name}</span>
            </a>
          ))}
        </nav>
        <div className="mt-auto p-3 text-xs text-gray-500">v0.1.0</div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-14 bg-white/90 backdrop-blur border-b border-gray-200 flex items-center">
          <div className="flex-1 px-4 flex items-center gap-3">
            <div className="text-sm text-gray-500">Home</div>
            <div className="text-gray-300">/</div>
            <div className="text-sm font-medium text-gray-900">{title}</div>
          </div>
          <div className="px-4 flex items-center gap-3">
            <input className="hidden sm:block h-8 w-56 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/60" placeholder="Search..." />
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-400" />
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}

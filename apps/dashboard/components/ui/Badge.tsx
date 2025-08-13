import React from 'react'

type BadgeProps = {
  children: React.ReactNode
  tone?: 'green' | 'blue' | 'amber' | 'gray'
}

export default function Badge({ children, tone = 'gray' }: BadgeProps) {
  const tones: Record<string, string> = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    amber: 'bg-amber-100 text-amber-800',
    gray: 'bg-gray-100 text-gray-800',
  }
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${tones[tone]}`}>
      {children}
    </span>
  )
}


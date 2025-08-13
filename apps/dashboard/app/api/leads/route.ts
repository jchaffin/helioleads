import { NextResponse } from 'next/server'

// Temporary mock endpoint to decouple UI from hardcoded data.
// Replace this with a real data source (DB/Redis) later.
export async function GET() {
  const callData = [
    { name: 'Mon', calls: 45, qualified: 18, appointments: 12 },
    { name: 'Tue', calls: 52, qualified: 22, appointments: 15 },
    { name: 'Wed', calls: 38, qualified: 16, appointments: 10 },
    { name: 'Thu', calls: 61, qualified: 28, appointments: 19 },
    { name: 'Fri', calls: 48, qualified: 21, appointments: 14 },
    { name: 'Sat', calls: 33, qualified: 14, appointments: 9 },
    { name: 'Sun', calls: 27, qualified: 11, appointments: 7 }
  ]

  const conversionData = [
    { name: 'Lead Qualification', value: 45, color: '#f97316' },
    { name: 'Appointment Set', value: 30, color: '#eab308' },
    { name: 'Follow-up Required', value: 25, color: '#fb923c' }
  ]

  const recentCalls = [
    { id: 1, company: 'ABC Manufacturing', duration: '12:34', status: 'Qualified', score: 85 },
    { id: 2, company: 'XYZ Warehousing', duration: '8:22', status: 'Appointment', score: 92 },
    { id: 3, company: 'Tech Solutions Inc', duration: '15:41', status: 'Follow-up', score: 67 },
    { id: 4, company: 'Green Energy Co', duration: '11:18', status: 'Qualified', score: 78 },
    { id: 5, company: 'Solar Dynamics', duration: '9:45', status: 'Appointment', score: 88 }
  ]

  return NextResponse.json({ callData, conversionData, recentCalls })
}


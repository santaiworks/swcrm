import { apiFetch } from '@/lib/api'
import CallsClient from '../../dashboard/calls/client'

async function getCalls() {
  try {
    const res = await apiFetch('/calls/')
    if (!res.ok) return []
    return await res.json()
  } catch (error) {
    console.error('Failed to fetch calls:', error)
    return []
  }
}

export default async function CallsPage() {
  const data = await getCalls()
  return <CallsClient data={data || []} />
}

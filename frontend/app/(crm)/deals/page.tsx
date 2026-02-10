import { apiFetch } from '@/lib/api'
import DealsClient from '../../dashboard/deals/client'
import { searchMasterData } from '../../dashboard/leads/master-actions'

async function getDeals() {
  try {
    // Fetch leads with status "Deal" (which services handle as deal filter)
    const res = await apiFetch('/leads?status=Deal')
    if (!res.ok) return []
    return await res.json()
  } catch (error) {
    console.error('Failed to fetch deals (leads):', error)
    return []
  }
}

export default async function DealsPage() {
  const dealsData = getDeals()
  const statusesData = searchMasterData('master_lead_status', '')

  const [deals, statuses] = await Promise.all([dealsData, statusesData])

  const statusOptions = (statuses || []).map((s: any) => ({
    label: s.name,
    value: s.name,
  }))

  return <DealsClient deals={deals} statusOptions={statusOptions} baseUrl="/deals" />
}

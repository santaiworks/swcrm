import { apiFetch } from '@/lib/api'
import LeadsClient from '../../dashboard/leads/client'
import { searchMasterData } from '../../dashboard/leads/master-actions'

async function getLeads() {
  try {
    const res = await apiFetch('/leads?status=Lead')
    if (!res.ok) return []
    const leads = await res.json()
    console.log('DEBUG: First lead from API:', leads[0])
    return leads
  } catch (error) {
    console.error('Failed to fetch leads:', error)
    return []
  }
}

export default async function LeadsPage() {
  const leadsData = getLeads()
  const statusesData = searchMasterData('master_lead_status', '')

  const [leads, statuses] = await Promise.all([leadsData, statusesData])

  const statusOptions = (statuses || []).map((s: any) => ({
    label: s.name,
    value: s.name,
  }))

  return <LeadsClient leads={leads} statusOptions={statusOptions} baseUrl="/leads" />
}

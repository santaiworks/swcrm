import { apiFetch } from '@/lib/api'
import { searchMasterData } from '@/app/dashboard/leads/master-actions'
import LeadDetailClient from '@/app/dashboard/leads/[id]/client'
import { notFound } from 'next/navigation'

async function getDeal(id: string) {
  const res = await apiFetch(`/leads/${id}`)
  if (!res.ok) return null
  return res.json()
}

async function getActivities(id: string) {
  const res = await apiFetch(`/activities/LEAD/${id}`)
  if (!res.ok) return []
  return res.json()
}

export default async function DealDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params

  const [deal, activities, statuses, industries, sources, salutations, employeeCounts] = await Promise.all([
    getDeal(id),
    getActivities(id),
    searchMasterData('master_lead_status', ''),
    searchMasterData('master_industries', ''),
    searchMasterData('master_sources', ''),
    searchMasterData('master_salutations', ''),
    searchMasterData('master_employee_counts', ''),
  ])

  if (!deal) {
    notFound()
  }

  const masterData = {
    statuses: statuses || [],
    industries: industries || [],
    sources: sources || [],
    salutations: salutations || [],
    employeeCounts: employeeCounts || []
  }

  return <LeadDetailClient lead={deal} activities={activities} masterData={masterData} />
}

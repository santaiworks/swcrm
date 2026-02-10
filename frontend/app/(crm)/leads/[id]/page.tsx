import { apiFetch } from '@/lib/api'
import LeadDetailClient from '@/app/dashboard/leads/[id]/client'
import { searchMasterData } from '@/app/dashboard/leads/master-actions'
import { notFound } from 'next/navigation'

async function getLead(id: string) {
  const res = await apiFetch(`/leads/${id}`)
  if (!res.ok) return null
  return res.json()
}

async function getActivities(id: string) {
  const res = await apiFetch(`/activities/LEAD/${id}`)
  if (!res.ok) return []
  return res.json()
}

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const [lead, activities, statuses, industries, sources, salutations, employeeCounts] = await Promise.all([
    getLead(id),
    getActivities(id),
    searchMasterData('master_lead_status', ''),
    searchMasterData('master_industries', ''),
    searchMasterData('master_sources', ''),
    searchMasterData('master_salutations', ''),
    searchMasterData('master_employee_counts', ''),
  ])

  if (!lead || lead.error) {
    notFound()
  }

  const masterData = {
    statuses: statuses || [],
    industries: industries || [],
    sources: sources || [],
    salutations: salutations || [],
    employeeCounts: employeeCounts || []
  }

  return <LeadDetailClient lead={lead} activities={activities} masterData={masterData} />
}

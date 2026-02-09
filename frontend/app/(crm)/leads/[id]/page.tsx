import { apiFetch } from '@/lib/api'
import LeadDetailClient from '@/app/dashboard/leads/[id]/client'
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
  const [lead, activities] = await Promise.all([
    getLead(id),
    getActivities(id)
  ])

  if (!lead || lead.error) {
    notFound()
  }

  return <LeadDetailClient lead={lead} activities={activities} />
}

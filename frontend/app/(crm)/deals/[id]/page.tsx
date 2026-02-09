import { apiFetch } from '@/lib/api'
import DealDetailClient from '../../../dashboard/deals/[id]/client'
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
  const [deal, activities] = await Promise.all([
    getDeal(id),
    getActivities(id)
  ])

  if (!deal) {
    notFound()
  }

  return <DealDetailClient deal={deal} activities={activities} />
}

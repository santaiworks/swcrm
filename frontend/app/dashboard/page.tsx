
import DashboardClient, { PieItem, FunnelItem, TrendItem } from './dashboard-client'
import { apiFetch } from '@/lib/api'

interface Lead {
  id: string
  status: string
  source?: string
  estimated_revenue?: number
  created_at?: string
  updated_at?: string
  closing_date?: string
  [key: string]: unknown
}

interface MasterStatus {
  name: string
  color?: string
}

export default async function DashboardPage() {
  // Fetch all leads (which includes deals now)
  const allLeads = await fetchJson<Lead[]>('/leads')
  const statuses = await fetchJson<MasterStatus[]>('/master-data/master_lead_status?query=')
  // const settings = await fetchJson('/settings')
  // const currency = settings?.currency || 'IDR'

  // Define logic for separating Leads vs Deals
  const dealStatuses = ['Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']
  const wonStatus = 'Closed Won'

  const leadsOnly = allLeads.filter((l) => !dealStatuses.includes(l.status))
  const dealsOnly = allLeads.filter((l) => dealStatuses.includes(l.status))
  const wonDealsList = dealsOnly.filter((l) => l.status === wonStatus)
  const ongoingDealsList = dealsOnly.filter((l) => ['Proposal', 'Negotiation'].includes(l.status))

  const totalLeads = leadsOnly.length
  const ongoingDeals = ongoingDealsList.length
  const wonDeals = wonDealsList.length

  // Calculate Avg Deal Value
  const totalWonValue = wonDealsList.reduce((sum, d) => sum + (d.estimated_revenue || 0), 0)
  const avgDealValue = wonDeals > 0 ? totalWonValue / wonDeals : 0

  // Calculate Avg Lead Close Time (Qualified/Converted)
  // Proxy: created_at to updated_at for Closed/Qualified leads
  const convertedLeads = allLeads.filter((l) => ['Qualified', ...dealStatuses].includes(l.status))
  let totalLeadTime = 0
  let countLeadTime = 0
  for (const lead of convertedLeads) {
    if (lead.created_at && lead.updated_at) {
      const start = new Date(lead.created_at).getTime()
      const end = new Date(lead.updated_at).getTime()
      if (end >= start) {
        totalLeadTime += (end - start)
        countLeadTime++
      }
    }
  }
  const avgLeadTimeMs = countLeadTime > 0 ? totalLeadTime / countLeadTime : 0
  const avgLeadCloseTime = avgLeadTimeMs > 0 ? `${Math.round(avgLeadTimeMs / (1000 * 60 * 60 * 24))} days` : 'N/A'

  // Calculate Avg Deal Close Time (won deals)
  let totalDealTime = 0
  let countDealTime = 0
  for (const deal of wonDealsList) {
    if (deal.created_at && deal.updated_at) { // Or closing_date if available and populated
      const start = new Date(deal.created_at).getTime()
      // Prefer closing_date but fallback to updated_at
      const end = deal.closing_date ? new Date(deal.closing_date).getTime() : new Date(deal.updated_at).getTime()

      if (end >= start) {
        totalDealTime += (end - start)
        countDealTime++
      }
    }
  }
  const avgDealTimeMs = countDealTime > 0 ? totalDealTime / countDealTime : 0
  const avgDealCloseTime = avgDealTimeMs > 0 ? `${Math.round(avgDealTimeMs / (1000 * 60 * 60 * 24))} days` : 'N/A'


  // Funnel: New -> Qualified -> Proposal -> Negotiation -> Won
  const statusCounts = countByStatus(allLeads)
  const funnel: FunnelItem[] = [
    { name: 'Leads', value: statusCounts['New'] || 0 },
    { name: 'Qualified', value: statusCounts['Qualified'] || 0 },
    { name: 'Proposal', value: statusCounts['Proposal'] || 0 },
    { name: 'Negotiation', value: statusCounts['Negotiation'] || 0 },
    { name: 'Won', value: statusCounts['Closed Won'] || 0 },
  ]

  const leadsByStatus: PieItem[] = Array.isArray(statuses)
    ? statuses.map((s) => ({
      name: s.name,
      value: statusCounts[s.name] || 0,
      color: s.color || colorForStatus(s.name),
    }))
    : []

  const leadsBySource: PieItem[] = pieFromField(allLeads, 'source')

  const trend: TrendItem[] = lastNDays(7).map((d) => ({
    time: d.label,
    leads: countByDate(leadsOnly, d.date),
    deals: countByDate(dealsOnly, d.date),
    won: countByDate(wonDealsList, d.date),
  }))

  return (
    <DashboardClient
      metrics={{
        totalLeads,
        ongoingDeals,
        wonDeals,
        avgDealValue,
        avgLeadCloseTime: avgLeadCloseTime !== 'N/A' ? avgLeadCloseTime : null,
        avgDealCloseTime: avgDealCloseTime !== 'N/A' ? avgDealCloseTime : null,
      }}
      trend={trend}
      funnel={funnel}
      leadsByStatus={leadsByStatus}
      leadsBySource={leadsBySource}
    />
  )
}

async function fetchJson<T = unknown>(endpoint: string): Promise<T> {
  try {
    const res = await apiFetch(endpoint, { cache: 'no-store' })
    if (!res.ok) return [] as unknown as T
    return await res.json()
  } catch {
    return [] as unknown as T
  }
}

function countByStatus(items: Lead[]): Record<string, number> {
  const map: Record<string, number> = {}
  for (const it of items || []) {
    const key = it?.status || 'Unknown'
    map[key] = (map[key] || 0) + 1
  }
  return map
}

function colorForStatus(name: string): string {
  // Fallback colors if master data doesn't provide
  switch (name) {
    case 'New': return '#3b82f6'
    case 'Qualified': return '#8b5cf6'
    case 'Proposal': return '#6366f1'
    case 'Negotiation': return '#ec4899'
    case 'Closed Won': return '#10b981'
    case 'Closed Lost': return '#ef4444'
    default: return '#94a3b8'
  }
}

function pieFromField(items: Lead[], field: string): PieItem[] {
  const map: Record<string, number> = {}
  for (const it of items || []) {
    const key = (it?.[field] as string) || 'Unknown'
    map[key] = (map[key] || 0) + 1
  }
  const palette = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
  return Object.entries(map).map(([name, value], idx) => ({
    name, value, color: palette[idx % palette.length],
  }))
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function countByDate(items: Lead[], day: Date): number {
  const target = startOfDay(day).getTime()
  let count = 0
  for (const it of items || []) {
    const t = it?.created_at ? startOfDay(new Date(it.created_at)).getTime() : NaN
    if (t === target) count++
  }
  return count
}

function lastNDays(n: number): { date: Date; label: string }[] {
  const out: { date: Date; label: string }[] = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const label = `${d.getMonth() + 1}/${d.getDate()}`
    out.push({ date: d, label })
  }
  return out
}

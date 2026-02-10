import { apiFetch } from '@/lib/api'
import LeadsClient from '../../dashboard/leads/client'
import { searchMasterData } from '../../dashboard/leads/master-actions'

async function getOpportunities() {
    try {
        const res = await apiFetch('/leads?status=Opportunity')
        if (!res.ok) return []
        return await res.json()
    } catch (error) {
        console.error('Failed to fetch opportunities:', error)
        return []
    }
}

export default async function OpportunitiesPage() {
    const leadsData = getOpportunities()
    const statusesData = searchMasterData('master_lead_status', '')

    const [leads, statuses] = await Promise.all([leadsData, statusesData])

    const statusOptions = (statuses || []).map((s: any) => ({
        label: s.name,
        value: s.name,
    }))

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">Opportunities</h1>
                <p className="text-muted-foreground">Manage and track your high-value sales opportunities.</p>
            </div>
            <LeadsClient
                leads={leads}
                statusOptions={statusOptions}
                summaryTitle="Total Opportunity"
                title="Opportunities"
                newLabel="New Opportunity"
                dialogTitle="Opportunity"
                baseUrl="/opportunities"
            />

        </div>
    )
}

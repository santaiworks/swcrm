'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateLeadDialog } from '@/components/leads/create-lead-dialog'
import { LeadSummaryCards } from '@/components/leads/lead-summary-cards'
import { DataTable } from '@/components/ui/data-table'

import { getColumns } from '@/components/leads/columns'

interface LeadsClientProps {
    leads: any[]
    baseUrl?: string
    statusOptions?: {
        label: string
        value: string
    }[]
    summaryTitle?: string
    title?: string
    newLabel?: string
    dialogTitle?: string
}

export default function LeadsClient({
    leads,
    baseUrl = "/leads",
    statusOptions = [],
    summaryTitle,
    title = "Leads",
    newLabel = "New Lead",
    dialogTitle = "Lead"
}: LeadsClientProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const columns = getColumns(baseUrl)

    const filterableColumns = [
        {
            id: "status_label",
            title: "Status",
            options: statusOptions
        }
    ]

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => setIsCreateOpen(true)} className="bg-black text-white hover:bg-gray-800">
                        <Plus className="w-4 h-4 mr-2" />
                        {newLabel}
                    </Button>
                </div>
            </div>

            <LeadSummaryCards leads={leads} title={summaryTitle} newLabel={newLabel} />

            <div className="flex-1">
                <DataTable
                    columns={columns}
                    data={leads}
                    filterableColumns={filterableColumns}
                    filterColumn="name"
                    filterPlaceholder="Filter by name..."
                />
            </div>

            <CreateLeadDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} title={dialogTitle} />
        </div>
    )
}

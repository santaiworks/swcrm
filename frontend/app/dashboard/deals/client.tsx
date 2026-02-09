'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateDealDialog } from '@/components/deals/create-deal-dialog'
import { DataTable } from '@/components/ui/data-table'
import { columns } from '@/components/deals/columns'

interface DealsClientProps {
    deals: any[]
    statusOptions?: {
        label: string
        value: string
    }[]
}

export default function DealsClient({ deals, statusOptions = [] }: DealsClientProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-gray-800">Deals</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => setIsCreateOpen(true)} className="bg-black text-white hover:bg-gray-800">
                        <Plus className="w-4 h-4 mr-2" />
                        New Deal
                    </Button>
                </div>
            </div>

            <div className="flex-1">
                <DataTable
                    columns={columns}
                    data={deals}
                    filterColumn="name"
                    filterPlaceholder="Filter by name..."
                />
            </div>

            <CreateDealDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </div>
    )
}

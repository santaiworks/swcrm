'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateNoteDialog } from '@/components/notes/create-note-dialog'
import { DataTable } from '@/components/ui/data-table'
import { columns } from '@/components/notes/columns'

interface NotesClientProps {
    notes: any[]
}

export default function NotesClient({ notes }: NotesClientProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-gray-800">Notes</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => setIsCreateOpen(true)} className="bg-black text-white hover:bg-gray-800">
                        <Plus className="w-4 h-4 mr-2" />
                        New Note
                    </Button>
                </div>
            </div>

            <div className="flex-1">
                <DataTable
                    columns={columns}
                    data={notes}
                    filterColumn="content"
                    filterPlaceholder="Filter by content..."
                />
            </div>

            <CreateNoteDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </div>
    )
}

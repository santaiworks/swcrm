'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog'
import { DataTable } from '@/components/ui/data-table'
import { columns } from '@/components/tasks/columns'

interface TasksClientProps {
    tasks: any[]
}

export default function TasksClient({ tasks }: TasksClientProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-gray-800">Tasks</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => setIsCreateOpen(true)} className="bg-black text-white hover:bg-gray-800">
                        <Plus className="w-4 h-4 mr-2" />
                        New Task
                    </Button>
                </div>
            </div>

            <div className="flex-1">
                <DataTable
                    columns={columns}
                    data={tasks}
                    filterColumn="title"
                    filterPlaceholder="Filter by title..."
                />
            </div>

            <CreateTaskDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </div>
    )
}

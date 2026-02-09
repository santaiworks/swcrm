'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteTask } from '@/app/dashboard/tasks/actions'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export type Task = {
    id: string
    title: string
    due_date?: string
    priority: string
    status: string
    entity_type?: string
    entity_id?: string
    created_at: string
}

export const columns: ColumnDef<Task>[] = [
    {
        accessorKey: 'title',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: 'due_date',
        header: 'Due Date',
        cell: ({ row }) => {
            const date = row.getValue("due_date") as string
            if (!date) return "-"
            return new Date(date).toLocaleDateString()
        }
    },
    {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => {
            const priority = row.getValue("priority") as string
            return <Badge variant={priority === "High" ? "destructive" : "secondary"}>{priority}</Badge>
        }
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return <Badge variant={status === "Completed" ? "default" : "outline"}>{status}</Badge>
        }
    },
    {
        accessorKey: 'entity_type',
        header: 'Related To',
        cell: ({ row }) => {
            const type = row.getValue("entity_type") as string
            return type || "-"
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const task = row.original

            const handleDelete = async () => {
                const result = await deleteTask(task.id)
                if (result.success) {
                    toast.success('Task deleted successfully')
                } else {
                    toast.error('Failed to delete task')
                }
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(task.id)}>
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

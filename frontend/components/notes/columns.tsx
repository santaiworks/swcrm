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
import { deleteNote } from '@/app/dashboard/notes/actions'
import { toast } from 'sonner'

export type Note = {
    id: string
    content: string
    entity_type: string
    entity_id: string
    created_at: string
}

export const columns: ColumnDef<Note>[] = [
    {
        accessorKey: 'content',
        header: 'Content',
        cell: ({ row }) => {
            const content = row.getValue("content") as string
            return <div className="max-w-[500px] truncate" title={content}>{content}</div>
        }
    },
    {
        accessorKey: 'entity_type',
        header: 'Entity Type',
    },
    {
        accessorKey: 'entity_id',
        header: 'Entity ID',
        cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("entity_id")}</div>
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleString()
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const note = row.original

            const handleDelete = async () => {
                const result = await deleteNote(note.id)
                if (result.success) {
                    toast.success('Note deleted successfully')
                } else {
                    toast.error('Failed to delete note')
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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(note.id)}>
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

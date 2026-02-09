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
import { deleteContact } from '@/app/dashboard/contacts/actions'
import { toast } from 'sonner'

export type Contact = {
    id: string
    first_name: string
    last_name?: string
    email?: string
    mobile_no?: string
    job_title?: string
    organization?: string
    created_at: string
}

export const columns: ColumnDef<Contact>[] = [
    {
        accessorKey: 'first_name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const first = row.original.first_name
            const last = row.original.last_name || ''
            return <div className="font-medium">{`${first} ${last}`.trim()}</div>
        }
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'mobile_no',
        header: 'Mobile No',
    },
    {
        accessorKey: 'job_title',
        header: 'Job Title',
    },
    {
        accessorKey: 'organization',
        header: 'Organization',
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const contact = row.original

            const handleDelete = async () => {
                const result = await deleteContact(contact.id)
                if (result.success) {
                    toast.success('Contact deleted successfully')
                } else {
                    toast.error('Failed to delete contact')
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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(contact.id)}>
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

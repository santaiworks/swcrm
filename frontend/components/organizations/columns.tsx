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
import { deleteOrganization } from '@/app/dashboard/organizations/actions'
import { toast } from 'sonner'

export type Organization = {
    id: string
    name: string
    website?: string
    industry?: string
    no_employees?: string
    city?: string
    country?: string
    created_at: string
}

export const columns: ColumnDef<Organization>[] = [
    {
        accessorKey: 'name',
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
    },
    {
        accessorKey: 'website',
        header: 'Website',
        cell: ({ row }) => {
            const website = row.getValue("website") as string
            if (!website) return "-"
            return <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{website}</a>
        }
    },
    {
        accessorKey: 'industry',
        header: 'Industry',
    },
    {
        accessorKey: 'no_employees',
        header: 'Employees',
    },
    {
        accessorKey: 'city',
        header: 'City',
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const org = row.original

            const handleDelete = async () => {
                const result = await deleteOrganization(org.id)
                if (result.success) {
                    toast.success('Organization deleted successfully')
                } else {
                    toast.error('Failed to delete organization')
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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(org.id)}>
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

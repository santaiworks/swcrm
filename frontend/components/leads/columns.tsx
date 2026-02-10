"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SortableHeader } from "@/components/ui/data-table"
import Link from "next/link"

// This type is used to define the shape of our data.
export type Lead = {
    id: string
    salutation: string
    salutation_label?: string
    first_name: string
    last_name: string
    email: string
    status: string
    status_label?: string
    organization: string
    industry_label?: string
    source_label?: string
    no_employees_label?: string
}

export const getColumns = (baseUrl: string = '/leads'): ColumnDef<Lead>[] => [
    {
        accessorKey: "name",
        header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
        cell: ({ row }) => {
            const lead = row.original
            return (
                <div className="font-medium text-blue-900 hover:underline">
                    <Link href={`${baseUrl}/${lead.id}`}>
                        {lead.salutation_label || lead.salutation} {lead.first_name} {lead.last_name}
                    </Link>
                </div>
            )
        },
    },
    {
        accessorKey: "organization",
        header: ({ column }) => <SortableHeader column={column}>Organization</SortableHeader>,
    },
    {
        accessorKey: "email",
        header: ({ column }) => <SortableHeader column={column}>Email</SortableHeader>,
    },
    {
        accessorKey: "status_label",
        header: ({ column }) => <SortableHeader column={column}>Status</SortableHeader>,
        cell: ({ row }) => {
            const status = row.getValue("status_label") as string
            const dealStatuses = ['Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']
            const isDeal = dealStatuses.includes(status)
            return (
                <Badge variant={isDeal ? 'outline' : 'secondary'} className={isDeal ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}>
                    {status || row.original.status}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const lead = row.original

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
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(lead.id)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`${baseUrl}/${lead.id}`}>View Details</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

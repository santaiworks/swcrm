"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { SortableHeader } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Contact = {
    id: string
    first_name: string
    last_name: string
    email: string | null
    mobile_no: string | null
    job_title: string | null
    organization: string | null
    created_at: string
}

export const columns: ColumnDef<Contact>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "name",
        accessorFn: row => `${row.first_name || ''} ${row.last_name || ''}`.trim(),
        header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
        cell: ({ row }) => <div className="font-medium text-blue-600">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "email",
        header: ({ column }) => <SortableHeader column={column}>Email</SortableHeader>,
        cell: ({ row }) => row.getValue("email") || <span className="text-gray-400">-</span>,
    },
    {
        accessorKey: "mobile_no",
        header: ({ column }) => <SortableHeader column={column}>Mobile</SortableHeader>,
        cell: ({ row }) => row.getValue("mobile_no") || <span className="text-gray-400">-</span>,
    },
    {
        accessorKey: "job_title",
        header: ({ column }) => <SortableHeader column={column}>Job Title</SortableHeader>,
        cell: ({ row }) => row.getValue("job_title") || <span className="text-gray-400">-</span>,
    },
    {
        accessorKey: "organization",
        header: ({ column }) => <SortableHeader column={column}>Organization</SortableHeader>,
        cell: ({ row }) => row.getValue("organization") || <span className="text-gray-400">-</span>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const contact = row.original
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
                            onClick={() => navigator.clipboard.writeText(contact.id)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

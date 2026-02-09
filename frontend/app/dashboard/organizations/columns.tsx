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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Organization = {
    id: string
    name: string
    website: string | null
    industry: string | null
    no_employees: string | null
    created_at: string
}

export const columns: ColumnDef<Organization>[] = [
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
        accessorKey: "name",
        header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
        cell: ({ row }) => <div className="font-medium text-blue-600">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "website",
        header: ({ column }) => <SortableHeader column={column}>Website</SortableHeader>,
        cell: ({ row }) => {
            const website = row.getValue("website") as string
            if (!website) return <span className="text-gray-400">-</span>
            return (
                <a
                    href={website.startsWith('http') ? website : `https://${website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate hover:underline text-blue-500"
                >
                    {website}
                </a>
            )
        },
    },
    {
        accessorKey: "industry",
        header: ({ column }) => <SortableHeader column={column}>Industry</SortableHeader>,
        cell: ({ row }) => row.getValue("industry") || <span className="text-gray-400">-</span>,
    },
    {
        accessorKey: "no_employees",
        header: ({ column }) => <SortableHeader column={column}>Employees</SortableHeader>,
        cell: ({ row }) => row.getValue("no_employees") || <span className="text-gray-400">-</span>,
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => <SortableHeader column={column}>Created At</SortableHeader>,
        cell: ({ row }) => {
            const value = row.getValue("created_at")
            if (!value) return null
            return (
                <div className="flex items-center">
                    <span className="truncate"> {new Date(value as string).toLocaleDateString()}</span>
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const org = row.original
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
                            onClick={() => navigator.clipboard.writeText(org.id)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        {/* Add Edit/View Details later */}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

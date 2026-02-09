"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { SortableHeader } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Deal = {
    id: string
    name: string
    amount: number
    stage: string
    close_date: string | null
    contact_name: string | null
    organization_name: string | null
    created_at: string
}

export const columns: ColumnDef<Deal>[] = [
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
        accessorKey: "amount",
        header: ({ column }) => <SortableHeader column={column}>Amount</SortableHeader>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(amount)
            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "stage",
        header: ({ column }) => <SortableHeader column={column}>Stage</SortableHeader>,
        cell: ({ row }) => {
            const stage = row.getValue("stage") as string
            let variant: "default" | "secondary" | "destructive" | "outline" = "outline"

            // Customize colors based on stage
            if (['Won', 'Closed Won'].includes(stage)) variant = "default"
            else if (['Lost', 'Closed Lost'].includes(stage)) variant = "destructive"
            else variant = "secondary"

            return <Badge variant={variant}>{stage}</Badge>
        },
    },
    {
        accessorKey: "contact_name",
        header: ({ column }) => <SortableHeader column={column}>Contact</SortableHeader>,
        cell: ({ row }) => row.getValue("contact_name") || <span className="text-gray-400">-</span>,
    },
    {
        accessorKey: "organization_name",
        header: ({ column }) => <SortableHeader column={column}>Organization</SortableHeader>,
        cell: ({ row }) => row.getValue("organization_name") || <span className="text-gray-400">-</span>,
    },
    {
        accessorKey: "close_date",
        header: ({ column }) => <SortableHeader column={column}>Close Date</SortableHeader>,
        cell: ({ row }) => {
            const value = row.getValue("close_date")
            if (!value) return <span className="text-gray-400">-</span>
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
            const deal = row.original
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
                            onClick={() => navigator.clipboard.writeText(deal.id)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

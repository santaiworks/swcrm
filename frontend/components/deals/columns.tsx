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
import { format } from "date-fns"
import { deleteDeal } from "@/app/dashboard/deals/actions" // Assuming deleteDeal is updated to handle leads
import { toast } from "sonner"

// Using Lead type but focusing on Deal aspects
export type Deal = {
    id: string
    first_name: string
    last_name: string | null
    salutation_label?: string
    estimated_revenue: number | null
    status: string
    status_label?: string
    closing_date: string | null
    organization: string | null
}

const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this deal?")) return
    const result = await deleteDeal(id)
    if (result.success) {
        toast.success("Deal deleted")
    } else {
        toast.error("Failed to delete deal")
    }
}

export const getColumns = (baseUrl: string = '/deals'): ColumnDef<Deal>[] => [
    {
        accessorKey: "name",
        header: ({ column }) => <SortableHeader column={column}>Deal Name</SortableHeader>,
        cell: ({ row }) => {
            const deal = row.original
            // Construct name from first_name (and last_name if present) or fallback
            const name = deal.first_name + (deal.last_name ? ` ${deal.last_name}` : '')
            return (
                <div className="font-medium text-blue-900 hover:underline">
                    <Link href={`${baseUrl}/${deal.id}`}>{name}</Link>
                </div>
            )
        },
    },
    {
        accessorKey: "estimated_revenue",
        header: ({ column }) => <SortableHeader column={column}>Amount</SortableHeader>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("estimated_revenue")) || 0
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
            }).format(amount)
            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "status_label",
        header: ({ column }) => <SortableHeader column={column}>Stage</SortableHeader>,
        cell: ({ row }) => {
            const statusLabel = row.original.status_label
            const status = row.getValue("status_label") as string
            return (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {statusLabel || status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "closing_date",
        header: ({ column }) => <SortableHeader column={column}>Closing Date</SortableHeader>,
        cell: ({ row }) => {
            const date = row.getValue("closing_date") as string
            return date ? format(new Date(date), 'MMM d, yyyy') : 'No date'
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`${baseUrl}/${deal.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(deal.id)} className="text-red-600">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

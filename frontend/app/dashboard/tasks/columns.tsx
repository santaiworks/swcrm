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

export type Task = {
    id: string
    title: string
    description: string | null
    due_date: string | null
    priority: string
    status: string
    entity_type: string | null
    entity_id: string | null
    created_at: string
}

export const columns: ColumnDef<Task>[] = [
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
        accessorKey: "title",
        header: ({ column }) => <SortableHeader column={column}>Title</SortableHeader>,
        cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "due_date",
        header: ({ column }) => <SortableHeader column={column}>Due Date</SortableHeader>,
        cell: ({ row }) => {
            const date = row.getValue("due_date")
            if (!date) return <span className="text-gray-400">-</span>
            return (
                <div className="flex items-center">
                    <span className="truncate"> {new Date(date as string).toLocaleDateString()}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "priority",
        header: ({ column }) => <SortableHeader column={column}>Priority</SortableHeader>,
        cell: ({ row }) => {
            const priority = row.getValue("priority") as string
            let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
            if (priority === 'High') variant = "destructive"
            else if (priority === 'Medium') variant = "secondary"

            return <Badge variant={variant}>{priority}</Badge>
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => <SortableHeader column={column}>Status</SortableHeader>,
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return <Badge variant="outline">{status}</Badge>
        },
    },
    {
        accessorKey: "entity_type",
        header: ({ column }) => <SortableHeader column={column}>Related To</SortableHeader>,
        cell: ({ row }) => {
            const type = row.getValue("entity_type") as string
            if (!type) return <span className="text-gray-400">-</span>
            return <Badge variant="secondary">{type}</Badge>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const task = row.original
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
                            onClick={() => navigator.clipboard.writeText(task.id)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

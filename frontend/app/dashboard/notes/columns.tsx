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

export type Note = {
    id: string
    content: string
    entity_type: string
    entity_id: string
    created_at: string
}

export const columns: ColumnDef<Note>[] = [
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
        accessorKey: "content",
        header: ({ column }) => <SortableHeader column={column}>Note</SortableHeader>,
        cell: ({ row }) => {
            const content = row.getValue("content") as string
            return <div className="max-w-[500px] truncate" title={content}>{content}</div>
        },
    },
    {
        accessorKey: "entity_type",
        header: ({ column }) => <SortableHeader column={column}>Related To</SortableHeader>,
        cell: ({ row }) => {
            const type = row.getValue("entity_type") as string
            return <Badge variant="secondary">{type}</Badge>
        }
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
            const note = row.original
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
                            onClick={() => navigator.clipboard.writeText(note.id)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

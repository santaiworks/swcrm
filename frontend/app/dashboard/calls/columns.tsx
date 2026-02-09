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
import { useState } from "react"
import { CallForm } from "./call-form"
import { deleteCall } from "./actions"
// import { apiFetch } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export type CallLog = {
    id: string
    subject: string
    notes: string | null
    duration: string | null
    status: string
    entity_type: string | null
    entity_id: string | null
    created_at: string
}

export const columns: ColumnDef<CallLog>[] = [
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
        accessorKey: "subject",
        header: ({ column }) => <SortableHeader column={column}>Subject</SortableHeader>,
        cell: ({ row }) => {
            const subject = row.getValue("subject") as string
            return <div className="font-medium">{subject}</div>
        },
    },
    {
        accessorKey: "duration",
        header: ({ column }) => <SortableHeader column={column}>Duration</SortableHeader>,
        cell: ({ row }) => {
            const duration = row.getValue("duration") as string
            if (!duration) return <span className="text-gray-400">-</span>
            return <span>{duration}</span>
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => <SortableHeader column={column}>Status</SortableHeader>,
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
            if (status === 'Missed') variant = "destructive"
            else if (status === 'Completed') variant = "default"

            return <Badge variant={variant}>{status}</Badge>
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
        accessorKey: "created_at",
        header: ({ column }) => <SortableHeader column={column}>Date</SortableHeader>,
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
        cell: ({ row }) => <span className="w-8"><ActionsCell row={row} /></span>,
    },
]

function ActionsCell({ row }: { row: any }) {
    const call = row.original
    const [showEdit, setShowEdit] = useState(false)
    const router = useRouter()

    // ... imports

    // ... inside ActionsCell
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this call?")) return
        try {
            await deleteCall(call.id)
            toast.success("Call deleted")
        } catch (error) {
            toast.error("Failed to delete call")
        }
    }

    return (
        <>
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
                        onClick={() => navigator.clipboard.writeText(call.id)}
                    >
                        Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowEdit(true)}>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {showEdit && (
                <CallForm
                    open={showEdit}
                    onOpenChange={setShowEdit}
                    initialData={call}
                />
            )}
        </>
    )
}

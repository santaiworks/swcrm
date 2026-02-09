"use client"

import { useState } from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserFormDialog } from "./user-form-dialog"
import { deleteUser } from "@/app/(crm)/settings/actions"
import { toast } from "sonner"

export type User = {
    id: number
    email: string
    full_name: string | null
    is_active: boolean
    is_superuser: boolean
}

interface UserManagementTableProps {
    users: User[]
}

export function UserManagementTable({ users }: UserManagementTableProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const handleEdit = (user: User) => {
        setSelectedUser(user)
        setIsDialogOpen(true)
    }

    const handleCreate = () => {
        setSelectedUser(null)
        setIsDialogOpen(true)
    }

    const handleDelete = async (user: User) => {
        if (!confirm(`Are you sure you want to delete user ${user.email}? This will deactivate their account and hide them from the system.`)) return

        const res = await deleteUser(user.id)
        if (res.success) {
            toast.success("User deleted successfully")
        } else {
            toast.error(res.error || "Failed to delete user")
        }
    }

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "full_name",
            header: "Full Name",
        },
        {
            accessorKey: "is_active",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.getValue("is_active") ? "default" : "secondary"}>
                    {row.getValue("is_active") ? "Active" : "Inactive"}
                </Badge>
            )
        },
        {
            accessorKey: "is_superuser",
            header: "Role",
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.getValue("is_superuser") ? "Admin" : "User"}
                </Badge>
            )
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const user = row.original

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
                                onClick={() => navigator.clipboard.writeText(user.email)}
                            >
                                Copy Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(user)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(user)} className="text-red-600 focus:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Users</h3>
                <Button onClick={handleCreate} className="bg-black text-white hover:bg-gray-800">
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <UserFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                user={selectedUser}
            />
        </div>
    )
}

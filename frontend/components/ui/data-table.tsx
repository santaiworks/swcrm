"use client"

import * as React from "react"
import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { DataTableToolbar } from "@/components/ui/data-table-toolbar"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    emptyMessage?: string
    filterColumn?: string
    filterPlaceholder?: string
    filterableColumns?: {
        id: string
        title: string
        options: {
            label: string
            value: string
            icon?: React.ComponentType<{ className?: string }>
        }[]
    }[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
    emptyMessage = "No data found.",
    filterColumn = "email",
    filterPlaceholder = "Filter...",
    filterableColumns = [],
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

    // eslint-disable-next-line
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
        initialState: {
            pagination: {
                pageSize: 20,
            },
        },
    })

    // Calculate pagination info
    const pageIndex = table.getState().pagination.pageIndex
    const pageSize = table.getState().pagination.pageSize
    const totalRows = table.getFilteredRowModel().rows.length
    const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1
    const endRow = Math.min((pageIndex + 1) * pageSize, totalRows)
    const totalPages = table.getPageCount()
    const currentPage = pageIndex + 1

    return (
        <Card className="w-full">
            <div className="p-4 border-b">
                <DataTableToolbar
                    table={table}
                    filterColumn={filterColumn}
                    filterPlaceholder={filterPlaceholder}
                    filterableColumns={filterableColumns}
                />
            </div>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50 border-b">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-slate-50">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4"
                                        >
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
                                    className="hover:bg-gray-50/50 border-b last:border-b-0"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3 px-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-slate-500">
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="py-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>{startRow}-{endRow} of {totalRows}</span>
                    <span className="text-slate-400">|</span>
                    <span className="flex items-center gap-2">
                        Show:
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(value) => table.setPageSize(Number(value))}
                        >
                            <SelectTrigger className="h-8 w-[70px] bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 20, 50, 100].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="text-slate-600 hover:text-slate-900"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </Button>
                    <span className="text-sm text-slate-600 px-2">
                        {currentPage} / {totalPages || 1}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="text-slate-600 hover:text-slate-900"
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

// Helper component for sortable column headers
export function SortableHeader<TData, TValue>({ column, children }: { column: Column<TData, TValue>; children: React.ReactNode }) {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-transparent text-xs font-semibold text-slate-500 uppercase tracking-wider"
        >
            {children}
            <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
    )
}

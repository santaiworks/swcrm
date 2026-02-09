"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns, CallLog } from "./columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { CallForm } from "./call-form"

interface CallsClientProps {
    data: CallLog[]
}

export default function CallsClient({ data }: CallsClientProps) {
    const [open, setOpen] = useState(false)

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Calls</h2>
                    <p className="text-muted-foreground">
                        Track and manage call logs.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => setOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Log Call
                    </Button>
                </div>
            </div>
            <DataTable
                data={data}
                columns={columns}
                filterColumn="subject"
                filterPlaceholder="Search logs..."
            />
            <CallForm open={open} onOpenChange={setOpen} />
        </div>
    )
}

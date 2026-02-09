'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateContactDialog } from '@/components/contacts/create-contact-dialog'
import { DataTable } from '@/components/ui/data-table'
import { columns } from '@/components/contacts/columns'

interface ContactsClientProps {
    contacts: any[]
}

export default function ContactsClient({ contacts }: ContactsClientProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-gray-800">Contacts</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => setIsCreateOpen(true)} className="bg-black text-white hover:bg-gray-800">
                        <Plus className="w-4 h-4 mr-2" />
                        New Contact
                    </Button>
                </div>
            </div>

            <div className="flex-1">
                <DataTable
                    columns={columns}
                    data={contacts}
                    filterColumn="first_name"
                    filterPlaceholder="Filter by name..."
                />
            </div>

            <CreateContactDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </div>
    )
}

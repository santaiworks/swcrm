'use client'

import { useState } from 'react'
import { MoreHorizontal, Plus, Mail, Phone, CheckSquare, FileText, Trash2, MessageSquare, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deleteDeal, updateDeal } from '../actions'
import { useRouter } from 'next/navigation'
import { DetailPageLayout } from '@/components/common/detail-page-layout'
import { DetailSidebar } from '@/components/common/detail-sidebar'
import { EditableSidebarItem } from '@/components/common/editable-sidebar-item'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { EmailsTab } from '@/components/common/emails-tab'
import { AttachmentsTab } from '@/components/common/attachments-tab'
import { NotesTab } from '@/components/common/notes-tab'
import { TasksTab } from '@/components/common/tasks-tab'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface DealDetailClientProps {
    deal: any
    activities: any[]
    masterData: {
        statuses: any[]
        industries: any[]
        sources: any[]
        salutations: any[]
        employeeCounts: any[]
    }
}

export default function DealDetailClient({ deal, activities, masterData }: DealDetailClientProps) {
    const router = useRouter()

    const dealName = deal.first_name + (deal.last_name ? ` ${deal.last_name}` : '')

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this deal? This action cannot be undone.')) return

        try {
            const result = await deleteDeal(deal.id)
            if (result.success) {
                toast.success('Deal deleted successfully')
                router.push('/deals')
            } else {
                toast.error(result.error || 'Failed to delete deal')
            }
        } catch (error) {
            console.error(error)
            toast.error('Something went wrong')
        }
    }

    const ActivityTab = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Activity</h3>
            </div>

            <div className="space-y-8 relative pl-4 after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-gray-200">
                {activities.length === 0 ? (
                    <div className="text-gray-500 text-sm py-8 pl-6">No activity history yet.</div>
                ) : (
                    activities.map((activity) => (
                        <div key={activity.id} className="relative pl-8">
                            <div className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-white border-2 border-gray-400 z-10" />
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-sm text-gray-900">
                                    <span className="font-semibold">System</span>
                                    <span className="text-gray-500 font-normal">{activity.description}</span>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {format(new Date(activity.created_at), 'MMM d, yyyy h:mm a')}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )

    const handleFieldUpdate = async (field: string, value: string) => {
        // Convert types if needed
        let finalValue: any = value
        if (field === 'estimated_revenue') finalValue = Number(value) || 0

        const res = await updateDeal(deal.id, { [field]: finalValue })
        if (res.success) {
            return { success: true }
        }
        return { success: false, error: res.error as string }
    }

    const sidebar = (
        <DetailSidebar
            title={dealName}
            subtitle={
                <Avatar className="h-12 w-12 bg-gray-100">
                    <AvatarFallback className="text-gray-500 text-lg">
                        {dealName?.[0]?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            }
            actionIcons={
                <>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900" title="Delete" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </>
            }
            sections={[
                {
                    title: 'Deal Info',
                    items: [
                        {
                            label: 'Amount',
                            value: <EditableSidebarItem
                                label="Amount"
                                value={deal.estimated_revenue}
                                onSave={(val) => handleFieldUpdate('estimated_revenue', val)}
                                type="text"
                                renderValue={(val) => val ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(val)) : 'Rp 0'}
                                placeholder="Rp 0"
                            />
                        },
                        {
                            label: 'Stage',
                            value: <EditableSidebarItem
                                label="Stage"
                                value={deal.status}
                                onSave={(val) => handleFieldUpdate('status', val)}
                                type="select"
                                options={masterData.statuses.map(s => ({ label: s.name, value: s.id }))}
                                renderValue={() => deal.status_label || deal.status}
                            />
                        },
                        {
                            label: 'Closing Date',
                            value: <EditableSidebarItem
                                label="Closing Date"
                                value={deal.closing_date ? format(new Date(deal.closing_date), 'yyyy-MM-dd') : ''}
                                onSave={(val) => handleFieldUpdate('closing_date', val)}
                                type="date"
                                renderValue={(val) => val ? format(new Date(val), 'MMM d, yyyy') : 'No date'}
                                placeholder="Pick a date"
                            />
                        },
                    ]
                },
                {
                    title: 'Relationships',
                    items: [
                        { label: 'Organization', value: deal.organization || 'None' },
                        { label: 'Contact Email', value: deal.email || 'None' },
                    ]
                }
            ]}
        />
    )

    const tabs = [
        { value: 'activity', label: 'Activity', icon: <Plus className="w-4 h-4" />, content: <ActivityTab /> },
        { value: 'emails', label: 'Emails', icon: <Mail className="w-4 h-4" />, content: <EmailsTab entityType="LEAD" entityId={deal.id} /> },
        { value: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" />, content: <TasksTab entityType="LEAD" entityId={deal.id} /> },
        { value: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" />, content: <NotesTab entityType="LEAD" entityId={deal.id} /> },
        { value: 'attachments', label: 'Attachments', icon: <Paperclip className="w-4 h-4" />, content: <AttachmentsTab entityType="LEAD" entityId={deal.id} /> },
    ]

    return (
        <DetailPageLayout
            breadcrumbs={[
                { label: 'Deals', href: '/deals' },
                { label: dealName }
            ]}
            title={dealName}
            status={
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 font-normal border-emerald-200">
                    {deal.status_label || deal.status}
                </Badge>
            }
            tabs={tabs}
            sidebar={sidebar}
        />
    )
}

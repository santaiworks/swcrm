'use client'

import { useState, useEffect } from 'react'
import { MoreHorizontal, ArrowRightLeft, Plus, Mail, Link as LinkIcon, Paperclip, Trash2, Calendar, MessageSquare, Phone, CheckSquare, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { updateLeadStatus, deleteLead, updateLead } from '../actions'
import { useRouter, usePathname } from 'next/navigation'
import { UpdateLeadDialog } from '@/components/leads/update-lead-dialog'
import { ConvertDealDialog } from '@/components/leads/convert-deal-dialog'
import { DetailPageLayout } from '@/components/common/detail-page-layout'
import { DetailSidebar } from '@/components/common/detail-sidebar'
import { EditableSidebarItem } from '@/components/common/editable-sidebar-item'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { EmailsTab } from '@/components/common/emails-tab'
import { AttachmentsTab } from '@/components/common/attachments-tab'
import { NotesTab } from '@/components/common/notes-tab'
import { TasksTab } from '@/components/common/tasks-tab'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CallsTab } from '@/components/common/calls-tab'
import { MasterDataCombobox } from '@/components/leads/master-data-combobox'
import { DataTab } from '@/components/common/data-tab'

interface LeadDetailClientProps {
    lead: any
    activities: any[]
    masterData: {
        statuses: any[]
        industries: any[]
        sources: any[]
        salutations: any[]
        employeeCounts: any[]
    }
}

export default function LeadDetailClient({ lead, activities, masterData }: LeadDetailClientProps) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isConvertOpen, setIsConvertOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this lead? This action cannot be undone.')) return

        try {
            const result = await deleteLead(lead.id)
            if (result.success) {
                toast.success('Lead deleted successfully')
                router.push('/leads')
            } else {
                toast.error(result.error || 'Failed to delete lead')
            }
        } catch (error) {
            console.error(error)
            toast.error('Something went wrong')
        }
    }

    // --- Components for Tabs ---

    const ActivityTab = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Activity</h3>
                {/* Placeholder for Add Activity Button */}
            </div>

            <div className="space-y-8 relative pl-4 after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-gray-200">
                {activities.length === 0 ? (
                    <div className="text-gray-500 text-sm py-8 pl-6">No activity history yet.</div>
                ) : (
                    activities.map((activity) => (
                        <div key={activity.id} className="relative pl-8">
                            {/* Timeline Node */}
                            <div className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-white border-2 border-gray-400 z-10" />

                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-sm text-gray-900">
                                    <span className="font-semibold">System</span> {/* Or User Name */}
                                    <span className="text-gray-500 font-normal">{activity.description}</span>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {format(new Date(activity.created_at), 'MMM d, yyyy h:mm a')}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                {/* Fake initial activity for visuals if needed, or rely on real data */}
                <div className="relative pl-8">
                    <div className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-white border-2 border-gray-400 z-10" />
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                            <span className="font-semibold">System</span>
                            <span className="text-gray-500 font-normal">created this lead</span>
                        </div>
                        <span className="text-xs text-gray-400">
                            {format(new Date(lead.created_at), 'MMM d, yyyy h:mm a')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )

    // --- Layout Props Construction ---

    const handleFieldUpdate = async (field: string, value: string) => {
        const res = await updateLead(lead.id, { [field]: value })
        if (res.success) {
            return { success: true }
        }
        return { success: false, error: res.error as string }
    }

    const sidebar = (
        <DetailSidebar
            title={`${lead.salutation_label ? lead.salutation_label + ' ' : ''}${lead.first_name} ${lead.last_name || ''}`}
            subtitle={
                <Avatar className="h-12 w-12 bg-gray-100">
                    <AvatarFallback className="text-gray-500 text-lg">
                        {lead.first_name?.[0]?.toUpperCase()}{lead.last_name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            }
            actionIcons={
                <>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900" title="Email" onClick={() => window.location.href = `mailto:${lead.email}`}>
                        <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900" title="Delete" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    {/* Edit Button hidden in icons but available globally if needed, or add here */}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900" title="Edit" onClick={() => setIsEditOpen(true)}>
                        <FileText className="h-4 w-4" />
                    </Button>
                </>
            }
            sections={[
                {
                    title: 'Details',
                    items: [
                        { label: 'Organization', value: <EditableSidebarItem label="Organization" value={lead.organization} onSave={(val) => handleFieldUpdate('organization', val)} /> },
                        {
                            label: 'Website',
                            value: <EditableSidebarItem
                                label="Website"
                                value={lead.website}
                                onSave={(val) => handleFieldUpdate('website', val)}
                                type="url"
                                renderValue={(val) => val ? <a href={val.startsWith('http') ? val : `https://${val}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{val}</a> : null}
                            />
                        },
                        {
                            label: 'Industry',
                            value: <EditableSidebarItem
                                label="Industry"
                                value={lead.industry}
                                onSave={(val) => handleFieldUpdate('industry', val)}
                                type="select"
                                options={masterData.industries.map(i => ({ label: i.name, value: i.id }))}
                                renderValue={() => lead.industry_label || lead.industry || 'None'}
                            />
                        },
                        { label: 'Job title', value: <EditableSidebarItem label="Job title" value={lead.job_title} onSave={(val) => handleFieldUpdate('job_title', val)} /> },
                        {
                            label: 'Source',
                            value: <EditableSidebarItem
                                label="Source"
                                value={lead.source}
                                onSave={(val) => handleFieldUpdate('source', val)}
                                type="select"
                                options={masterData.sources.map(s => ({ label: s.name, value: s.id }))}
                                renderValue={() => lead.source_label || lead.source || 'None'}
                            />
                        },
                        {
                            label: 'Perkiraan Omzet',
                            value: <EditableSidebarItem
                                label="Perkiraan Omzet"
                                value={lead.estimated_revenue}
                                onSave={(val) => handleFieldUpdate('estimated_revenue', val)}
                                type="text"
                                renderValue={(val) => val ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(val)) : null}
                                placeholder="Rp 0"
                            />
                        },
                        {
                            label: 'Probability',
                            value: <EditableSidebarItem
                                label="Probability"
                                value={lead.probability}
                                onSave={(val) => handleFieldUpdate('probability', val)}
                                type="text"
                                renderValue={(val) => val ? `${val}%` : null}
                                placeholder="0%"
                            />
                        },
                        {
                            label: 'Closing Date',
                            value: <EditableSidebarItem
                                label="Closing Date"
                                value={lead.closing_date ? format(new Date(lead.closing_date), 'yyyy-MM-dd') : ''}
                                onSave={(val) => handleFieldUpdate('closing_date', val)}
                                type="date"
                                renderValue={(val) => val ? format(new Date(val), 'MMM d, yyyy') : 'No date'}
                                placeholder="Pick a date"
                            />
                        },
                        { label: 'Lead owner', value: lead.lead_owner || 'Unassigned' }, // Or map generic ID to name

                    ]
                },
                {
                    title: 'Person',
                    items: [
                        {
                            label: 'Salutation',
                            value: <EditableSidebarItem
                                label="Salutation"
                                value={lead.salutation}
                                onSave={(val) => handleFieldUpdate('salutation', val)}
                                type="select"
                                options={masterData.salutations.map(s => ({ label: s.name, value: s.id }))}
                                renderValue={() => lead.salutation_label || lead.salutation || 'None'}
                            />
                        },
                        { label: 'First name', value: <EditableSidebarItem label="First name" value={lead.first_name} onSave={(val) => handleFieldUpdate('first_name', val)} /> },
                        { label: 'Last name', value: <EditableSidebarItem label="Last name" value={lead.last_name} onSave={(val) => handleFieldUpdate('last_name', val)} /> },
                        { label: 'Email', value: <EditableSidebarItem label="Email" value={lead.email} onSave={(val) => handleFieldUpdate('email', val)} type="email" /> },
                        { label: 'Mobile', value: <EditableSidebarItem label="Mobile" value={lead.mobile_no} onSave={(val) => handleFieldUpdate('mobile_no', val)} type="tel" /> },
                    ]
                }
            ]}
        />
    )

    const tabs = [
        { value: 'activity', label: 'Activity', icon: <Plus className="w-4 h-4" />, content: <ActivityTab /> },
        { value: 'emails', label: 'Emails', icon: <Mail className="w-4 h-4" />, content: <EmailsTab entityType="LEAD" entityId={lead.id} defaultTo={lead.email} /> },
        { value: 'comments', label: 'Comments', icon: <MessageSquare className="w-4 h-4" />, content: <div className="p-4 text-gray-500 text-sm">Comments coming soon...</div> },
        { value: 'data', label: 'Data', icon: <FileText className="w-4 h-4" />, content: <DataTab data={lead} /> },
        { value: 'calls', label: 'Calls', icon: <Phone className="w-4 h-4" />, content: <CallsTab entityType="LEAD" entityId={lead.id} /> },
        { value: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" />, content: <TasksTab entityType="LEAD" entityId={lead.id} entityName={`${lead.first_name} ${lead.last_name || ''}`} /> },
        { value: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" />, content: <NotesTab entityType="LEAD" entityId={lead.id} /> },
        { value: 'attachments', label: 'Attachments', icon: <Paperclip className="w-4 h-4" />, content: <AttachmentsTab entityType="LEAD" entityId={lead.id} /> },
    ]



    let entityType = 'Lead'
    let entityPrefix = 'LEAD'
    let entityHref = '/leads'

    if (pathname?.startsWith('/opportunities')) {
        entityType = 'Opportunity'
        entityPrefix = 'OPP'
        entityHref = '/opportunities'
    } else if (pathname?.startsWith('/deals')) {
        entityType = 'Deal'
        entityPrefix = 'DEAL'
        entityHref = '/deals'
    }

    return (
        <>
            <DetailPageLayout
                breadcrumbs={[
                    { label: `${entityType}s`, href: entityHref },
                    { label: `${lead.first_name} ${lead.last_name || ''}` }
                ]}
                title={lead.reference_id || `${entityPrefix}-${lead.id.substring(0, 8).toUpperCase()}`}
                status={
                    <div className="flex items-center gap-2">
                        <MasterDataCombobox
                            table="master_lead_status"
                            value={lead.status}
                            onChange={async (val) => {
                                const res = await updateLeadStatus(lead.id, val || lead.status)
                                if (res.success) {
                                    toast.success('Status updated')
                                } else {
                                    toast.error(res.error || 'Failed to update status')
                                }
                            }}
                            placeholder="Status"
                        />
                    </div>
                }
                actions={
                    <div className="flex gap-2">
                        {lead.status !== 'Deal' && (
                            <Button className="bg-black hover:bg-gray-800 text-white" onClick={() => setIsConvertOpen(true)}>
                                Convert to deal
                            </Button>
                        )}
                    </div>
                }
                tabs={tabs}
                sidebar={sidebar}
            />

            <UpdateLeadDialog lead={lead} open={isEditOpen} onOpenChange={setIsEditOpen} />
            <ConvertDealDialog lead={lead} open={isConvertOpen} onOpenChange={setIsConvertOpen} />
        </>
    )
}

'use client'

import { useState } from 'react'
import { ChevronLeft, MoreHorizontal, User, Building2, Mail, Phone, Calendar, ArrowRightLeft, FileText, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AttachmentsTab } from './attachments-tab'
import { EmailsTab } from './emails-tab'

interface EntityDetailLayoutProps {
    entityType: 'LEAD' | 'DEAL'
    data: any
    activities: any[]
    title: string
    backLink: string
    backLabel: string
    statusBadge?: React.ReactNode
    actions?: React.ReactNode
    sidebar?: React.ReactNode
    refetch?: () => void
}

export function EntityDetailLayout({
    entityType,
    data,
    activities,
    title,
    backLink,
    backLabel,
    statusBadge,
    actions,
    sidebar,
    refetch
}: EntityDetailLayoutProps) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('activity')

    return (
        <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={backLink}>
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            {backLabel}
                        </Link>
                    </Button>
                    <Separator orientation="vertical" className="h-4" />
                    <h1 className="text-xl font-semibold">
                        {title}
                    </h1>
                    {statusBadge}
                </div>
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info / Overview - Passed as children or part of data? 
                        For now, let's keep it flexible. 
                        Actually, existing Lead Page had Cards for Basic Info. 
                        We can keep that as 'Overview' tab or fixed content.
                        Let's put Tabs here.
                    */}

                    <Tabs defaultValue="activity" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                            <TabsTrigger value="emails">Emails</TabsTrigger>
                            <TabsTrigger value="attachments">Attachments</TabsTrigger>
                            <TabsTrigger value="details">Details</TabsTrigger>
                        </TabsList>

                        <div className="mt-6">
                            <TabsContent value="activity">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Activity Log
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {activities.length === 0 ? (
                                            <p className="text-xs text-center text-gray-500 py-4">No activities logged yet.</p>
                                        ) : (
                                            <div className="space-y-4">
                                                {activities.map((activity) => (
                                                    <div key={activity.id} className="relative pl-4 border-l-2 border-gray-100 last:border-0 pb-4">
                                                        <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-gray-200" />
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-bold uppercase text-gray-400">{activity.action_type}</span>
                                                                <span className="text-[10px] text-gray-500">
                                                                    {format(new Date(activity.created_at), 'MMM d, p')}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-700">{activity.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="emails">
                                <EmailsTab
                                    entityType={entityType}
                                    entityId={data.id}
                                    defaultTo={data.email}
                                />
                            </TabsContent>

                            <TabsContent value="attachments">
                                <AttachmentsTab
                                    entityType={entityType}
                                    entityId={data.id}
                                />
                            </TabsContent>

                            <TabsContent value="details">
                                {/* Only show if detail cards are moved here, or show custom content */}
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Basic Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                                            {/* We can make this dynamic or pass a render prop for details */}
                                            {/* For now, just rendering common fields if they exist */}
                                            {data.email && (
                                                <div>
                                                    <p className="text-gray-500">Email</p>
                                                    <p className="font-medium flex items-center gap-2">
                                                        <Mail className="w-3 h-3" /> {data.email}
                                                    </p>
                                                </div>
                                            )}
                                            {data.mobile_no && (
                                                <div>
                                                    <p className="text-gray-500">Mobile No</p>
                                                    <p className="font-medium flex items-center gap-2">
                                                        <Phone className="w-3 h-3" /> {data.mobile_no}
                                                    </p>
                                                </div>
                                            )}
                                            {data.amount && (
                                                <div>
                                                    <p className="text-gray-500">Amount</p>
                                                    <p className="font-medium">
                                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.amount)}
                                                    </p>
                                                </div>
                                            )}
                                            {/* Add more generic or specific fields handling */}
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Render Sidebar Props here */}
                    {sidebar}

                    {/* Default Company/Org Card if data has it */}
                    {(data.organization_id || data.organization) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    Organization
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium text-sm">{data.organization || 'Linked Organization'}</p>
                                {/* Add Link if ID exists */}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

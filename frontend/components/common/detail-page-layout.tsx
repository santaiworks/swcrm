'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DetailPageLayoutProps {
    breadcrumbs: {
        label: string
        href?: string
    }[]
    title: string // ID or Reference Number e.g. CRM-LEAD-2026-00003
    status?: React.ReactNode
    actions?: React.ReactNode
    tabs: {
        value: string
        label: React.ReactNode
        content: React.ReactNode
        icon?: React.ReactNode // Optional icon
    }[]
    sidebar: React.ReactNode
    isLoading?: boolean
}

export function DetailPageLayout({
    breadcrumbs,
    title,
    status,
    actions,
    tabs,
    sidebar,
    isLoading
}: DetailPageLayoutProps) {

    // Default to first tab
    const defaultTab = tabs.length > 0 ? tabs[0].value : undefined

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Top Header / Breadcrumbs Area */}
            <div className="border-b px-4 py-2 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    {breadcrumbs.map((crumb, idx) => (
                        <React.Fragment key={idx}>
                            {idx > 0 && <span className="text-gray-300">/</span>}
                            {crumb.href ? (
                                <Link href={crumb.href} className="hover:text-gray-900 hover:underline">
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="font-medium text-gray-900">{crumb.label}</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    {status}
                    {actions}
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                    {/* Header ID */}
                    <div className="px-6 py-4 pb-1">
                        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="px-6 mt-1">
                        <Tabs defaultValue={defaultTab} className="w-full">
                            <div className="border-b border-gray-200">
                                <TabsList className="h-9 w-full justify-start gap-4 bg-transparent p-0">
                                    {tabs.map((tab) => (
                                        <TabsTrigger
                                            key={tab.value}
                                            value={tab.value}
                                            className="relative h-9 rounded-none border-b-2 border-transparent bg-transparent px-2 pb-2 pt-1 font-medium text-gray-500 shadow-none transition-none data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:shadow-none hover:text-gray-700 text-sm"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                {tab.icon}
                                                <span>{tab.label}</span>
                                            </div>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>

                            <div className="py-4">
                                {tabs.map((tab) => (
                                    <TabsContent key={tab.value} value={tab.value} className="m-0 focus-visible:ring-0">
                                        {tab.content}
                                    </TabsContent>
                                ))}
                            </div>
                        </Tabs>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-[320px] border-l bg-white flex-shrink-0 overflow-y-auto h-[calc(100vh-50px)]">
                    <div className="p-4">
                        {sidebar}
                    </div>
                </div>
            </div>
        </div>
    )
}

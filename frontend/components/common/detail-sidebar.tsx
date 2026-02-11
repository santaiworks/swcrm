'use client'

import React from 'react'
import { ChevronDown, ChevronRight, Mail, Phone, Globe, Building2, MapPin, User, Linkedin, Twitter, Facebook } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

interface SidebarSectionProps {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
    icon?: React.ReactNode
}

function SidebarSection({ title, children, defaultOpen = true, icon }: SidebarSectionProps) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full space-y-1">
            <div className="flex items-center justify-between w-full">
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-start p-0 hover:bg-transparent font-semibold text-gray-900">
                        {isOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                        {icon && <span className="mr-2">{icon}</span>}
                        {title}
                    </Button>
                </CollapsibleTrigger>
                {/* Optional: Add edit action here if needed */}
            </div>
            <CollapsibleContent className="space-y-1.5 pt-0.5 pb-1 pl-4">
                {children}
            </CollapsibleContent>
        </Collapsible>
    )
}

interface DetailSidebarProps {
    title: string // e.g. "Mr budi santoso"
    subtitle?: React.ReactNode // e.g. Avatar
    actionIcons?: React.ReactNode // e.g. Email, Link, Attach, Delete icons row
    sections: {
        title: string
        icon?: React.ReactNode
        items: {
            label: string
            value: React.ReactNode
        }[]
    }[]
}

export function DetailSidebar({ title, subtitle, actionIcons, sections }: DetailSidebarProps) {
    return (
        <div className="w-full space-y-2.5">
            {/* Profile / Header Card */}
            <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                    {subtitle}
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-bold text-gray-900 break-words leading-tight">{title}</h2>
                        {actionIcons && (
                            <div className="flex items-center gap-1">
                                {actionIcons}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Sections */}
            <div className="space-y-2.5">
                {sections.map((section, idx) => (
                    <div key={idx}>
                        <SidebarSection title={section.title} icon={section.icon}>
                            <div className="grid grid-cols-1 gap-1.5 text-sm">
                                {section.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="grid grid-cols-[90px_1fr] gap-x-2 gap-y-0.5 items-start">
                                        <span className="text-gray-500 text-xs mt-0.5">{item.label}</span>
                                        <div className="text-gray-900 font-medium break-words text-sm">
                                            {item.value || <span className="text-gray-300 italic">Empty</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SidebarSection>
                        {idx < sections.length - 1 && <div className="h-px bg-gray-100 mt-2" />}
                    </div>
                ))}
            </div>
        </div>
    )
}

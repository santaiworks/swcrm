'use client'

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ExternalLink } from "lucide-react"

interface DataSectionProps {
    title: string
    isOpen?: boolean
    children: React.ReactNode
}

function DataSection({ title, isOpen = true, children }: DataSectionProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 cursor-pointer group">
                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
            {isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                    {children}
                </div>
            )}
        </div>
    )
}

interface DataFieldProps {
    label: string
    value: React.ReactNode
    required?: boolean
}

function DataField({ label, value, required }: DataFieldProps) {
    return (
        <div className="space-y-0.5">
            <label className="text-xs font-medium text-gray-400">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="bg-gray-50/50 border border-transparent rounded-lg px-3 py-1 text-sm text-gray-900 min-h-[34px] flex items-center">
                {value || <span className="text-gray-300 italic">None</span>}
            </div>
        </div>
    )
}

interface DataTabProps {
    data: any
}

export function DataTab({ data }: DataTabProps) {
    return (
        <div className="space-y-6 pb-6">
            <DataSection title="Details">
                <DataField
                    label="Organization"
                    value={data.organization}
                />
                <DataField
                    label="Website"
                    value={data.website ? (
                        <div className="flex items-center gap-2">
                            <a href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{data.website}</a>
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                        </div>
                    ) : null}
                />
                <DataField
                    label="Territory"
                    value={data.territory || "Territory"}
                />
                <DataField
                    label="Industry"
                    value={data.industry_label || data.industry}
                />
                <DataField
                    label="Job title"
                    value={data.job_title}
                />
                <DataField
                    label="Source"
                    value={data.source_label || data.source}
                />
                <DataField
                    label="Lead owner"
                    value={
                        <div className="flex items-center gap-2">
                            <div className="w-px h-3 bg-gray-300 mx-1" />
                            <span>IndoTrax</span>
                        </div>
                    }
                />
            </DataSection>

            <Separator className="bg-gray-100" />

            <DataSection title="Person">
                <DataField
                    label="Salutation"
                    value={data.salutation_label || data.salutation}
                />
                <DataField
                    label="First name"
                    value={data.first_name}
                    required
                />
                <DataField
                    label="Last name"
                    value={data.last_name}
                />
                <DataField
                    label="Email"
                    value={data.email}
                />
                <DataField
                    label="Mobile no"
                    value={data.mobile_no}
                />
            </DataSection>
        </div>
    )
}

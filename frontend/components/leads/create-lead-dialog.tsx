'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MasterDataCombobox } from '@/components/leads/master-data-combobox'
import { createLead } from '@/app/dashboard/leads/actions'

interface CreateLeadDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title?: string
}

export function CreateLeadDialog({ open, onOpenChange, title = "Lead" }: CreateLeadDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // State for controlled comboboxes
    const [salutation, setSalutation] = useState('')
    const [industry, setIndustry] = useState('')
    const [source, setSource] = useState('')
    const [noEmployees, setNoEmployees] = useState('')
    const [status, setStatus] = useState('New')

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await createLead(formData)

        setIsLoading(false)

        if (result?.error) {
            // Handle structured error from Zod
            if (typeof result.error === 'object') {
                const errorMessages = Object.entries(result.error)
                    .map(([key, messages]) => `${key}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                    .join('\n')
                setError(errorMessages)
            } else {
                setError(result.error)
            }
        } else {
            onOpenChange(false)
        }
    }

    // Styles for compact layout
    // Label: text-xs, space-y-1
    // Input/Select: h-8, text-sm
    // Grid: gap-3

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl w-full max-h-[95vh] overflow-y-auto sm:max-w-[1000px]">
                <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b px-1">
                    <DialogTitle className="text-lg font-bold">Create {title}</DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-3 pt-3 px-1" autoComplete="off">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative text-sm mb-4">
                            <strong className="font-bold">Error:</strong>
                            <pre className="whitespace-pre-wrap mt-1 font-sans">{error}</pre>
                        </div>
                    )}

                    {/* Section 1: Person Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="salutation" className="text-gray-500 font-normal text-xs">Salutation</Label>
                            <MasterDataCombobox
                                table="master_salutations"
                                value={salutation}
                                onChange={setSalutation}
                                name="salutation"
                                placeholder="Salutation"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="first_name" className="text-gray-500 font-normal text-xs">First name <span className="text-red-500">*</span></Label>
                            <Input id="first_name" name="first_name" placeholder="First name" required className="bg-gray-50/50 border-gray-200 h-8 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="last_name" className="text-gray-500 font-normal text-xs">Last name</Label>
                            <Input id="last_name" name="last_name" placeholder="Last name" className="bg-gray-50/50 border-gray-200 h-8 text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="job_title" className="text-gray-500 font-normal text-xs">Job title</Label>
                            <Input id="job_title" name="job_title" placeholder="Job title" className="bg-gray-50/50 border-gray-200 h-8 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="department" className="text-gray-500 font-normal text-xs">Department</Label>
                            <Input id="department" name="department" placeholder="Department" className="bg-gray-50/50 border-gray-200 h-8 text-sm" />
                        </div>
                        <div className="hidden md:block">
                            {/* Empty column for alignment */}
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 my-1" />

                    {/* Section 2: Contact Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-gray-500 font-normal text-xs">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="Email" className="bg-gray-50/50 border-gray-200 h-8 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="mobile_no" className="text-gray-500 font-normal text-xs">Mobile no</Label>
                            <Input id="mobile_no" name="mobile_no" placeholder="Mobile no" className="bg-gray-50/50 border-gray-200 h-8 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="gender" className="text-gray-500 font-normal text-xs">Gender</Label>
                            <Select name="gender">
                                <SelectTrigger className="bg-gray-50/50 border-gray-200 h-8 w-full text-sm">
                                    <SelectValue placeholder="Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 my-1" />

                    {/* Section 3: Company Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="organization" className="text-gray-500 font-normal text-xs">Organization</Label>
                            <Input id="organization" name="organization" placeholder="Organization" className="bg-gray-50/50 border-gray-200 h-8 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="website" className="text-gray-500 font-normal text-xs">Website</Label>
                            <Input id="website" name="website" placeholder="Website" className="bg-gray-50/50 border-gray-200 h-8 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="industry" className="text-gray-500 font-normal text-xs">Industry</Label>
                            <MasterDataCombobox
                                table="master_industries"
                                value={industry}
                                onChange={setIndustry}
                                name="industry"
                                placeholder="Industry"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="no_employees" className="text-gray-500 font-normal text-xs">No. of employees</Label>
                            <MasterDataCombobox
                                table="master_employee_counts"
                                value={noEmployees}
                                onChange={setNoEmployees}
                                name="no_employees"
                                placeholder="No. of employees"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="source" className="text-gray-500 font-normal text-xs">Source</Label>
                            <MasterDataCombobox
                                table="master_sources"
                                value={source}
                                onChange={setSource}
                                name="source"
                                placeholder="Source"
                            />
                        </div>
                        <div className="hidden md:block"></div>
                    </div>

                    <div className="h-px bg-gray-100 my-1" />

                    {/* Section 4: Opportunity Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="estimated_revenue" className="text-gray-500 font-normal text-xs">Perkiraan Omzet (IDR)</Label>
                            <Input id="estimated_revenue" name="estimated_revenue" type="number" step="0.01" placeholder="0.00" className="bg-gray-50/50 border-gray-200 h-8 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="probability" className="text-gray-500 font-normal text-xs">Probability (%)</Label>
                            <Input id="probability" name="probability" type="number" min="0" max="100" placeholder="0" className="bg-gray-50/50 border-gray-200 h-8 text-sm" />
                        </div>
                        <div className="hidden md:block"></div>
                    </div>

                    <div className="h-px bg-gray-100 my-1" />

                    {/* Section 5: Status & Owner */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="status" className="text-gray-500 font-normal text-xs">Status <span className="text-red-500">*</span></Label>
                            <MasterDataCombobox
                                table="master_lead_status"
                                value={status}
                                onChange={setStatus}
                                name="status"
                                placeholder="Status"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="lead_owner" className="text-gray-500 font-normal text-xs">{title} owner</Label>
                            <Select name="lead_owner" disabled defaultValue="admin">
                                <SelectTrigger className="bg-gray-50/50 border-gray-200 h-8 w-full text-sm">
                                    <SelectValue placeholder="Administrator" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-700 font-medium">A</div>
                                            Administrator
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="hidden md:block"></div>
                    </div>



                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="mr-2 h-8 text-sm">Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="bg-black text-white hover:bg-gray-800 px-6 rounded-lg shadow-sm h-8 text-sm">
                            {isLoading ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

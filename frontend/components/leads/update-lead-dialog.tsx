'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { updateLead } from '@/app/dashboard/leads/actions'
import { useRouter } from 'next/navigation'

interface UpdateLeadDialogProps {
    lead: any
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UpdateLeadDialog({ lead, open, onOpenChange }: UpdateLeadDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const [formData, setFormData] = useState<any>({})

    useEffect(() => {
        if (lead) {
            setFormData({
                salutation: lead.salutation || '',
                first_name: lead.first_name || '',
                last_name: lead.last_name || '',
                email: lead.email || '',
                mobile_no: lead.mobile_no || '',
                job_title: lead.job_title || '',
                department: lead.department || '',
                organization: lead.organization || '',
                website: lead.website || '',
                industry: lead.industry || '',
                no_employees: lead.no_employees || '',
                source: lead.source || '',
                status: lead.status || 'New',
                estimated_revenue: lead.estimated_revenue || '',
                probability: lead.probability || '',
            })
        }
    }, [lead, open])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        // Handle numeric fields
        if (id === 'estimated_revenue' || id === 'probability') {
            setFormData((prev: any) => ({ ...prev, [id]: value === '' ? null : Number(value) }))
        } else {
            setFormData((prev: any) => ({ ...prev, [id]: value }))
        }
    }

    const handleSelectChange = (id: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [id]: value }))
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await updateLead(lead.id, formData)
            if (result.success) {
                onOpenChange(false)
                router.refresh()
            } else {
                alert(result.error || 'Failed to update lead')
            }
        } catch (error) {
            console.error(error)
            alert('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Update Lead</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="salutation">Salutation</Label>
                            <Select value={formData.salutation} onValueChange={(v) => handleSelectChange('salutation', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Mr.">Mr.</SelectItem>
                                    <SelectItem value="Mrs.">Mrs.</SelectItem>
                                    <SelectItem value="Ms.">Ms.</SelectItem>
                                    <SelectItem value="Dr.">Dr.</SelectItem>
                                    <SelectItem value="Prof.">Prof.</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input id="first_name" value={formData.first_name} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input id="last_name" value={formData.last_name} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={formData.email} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mobile_no">Mobile No</Label>
                            <Input id="mobile_no" value={formData.mobile_no} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="job_title">Job Title</Label>
                            <Input id="job_title" value={formData.job_title} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="estimated_revenue">Perkiraan Omzet (IDR)</Label>
                            <Input id="estimated_revenue" type="number" step="0.01" value={formData.estimated_revenue} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="probability">Probability (%)</Label>
                            <Input id="probability" type="number" min="0" max="100" value={formData.probability} onChange={handleInputChange} />
                        </div>
                    </div>


                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>{isLoading ? 'Updating...' : 'Update Lead'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

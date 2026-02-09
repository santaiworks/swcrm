'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { getOrganizations, getContacts } from "@/components/common/actions"
import { convertLead } from "@/app/dashboard/leads/actions"

// Simple Combobox for Org/Contact selection would be better, but for MVP iteration 1:
// Use simple Select or Input with ID if we can't build full AsyncSelect quickly.
// Let's try to fetch all Orgs/Contacts and use a native Select or Radix Select for now.
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ConvertDealDialogProps {
    lead: any
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ConvertDealDialog({ lead, open, onOpenChange }: ConvertDealDialogProps) {
    const [mode, setMode] = useState<'create' | 'link'>('create')
    const [loading, setLoading] = useState(false)
    const [orgs, setOrgs] = useState<any[]>([])
    const [contacts, setContacts] = useState<any[]>([])

    // Selection state
    const [selectedOrgId, setSelectedOrgId] = useState<string>("")
    const [selectedContactId, setSelectedContactId] = useState<string>("")

    const router = useRouter()

    useEffect(() => {
        if (open && mode === 'link') {
            // Fetch potential links
            const fetchData = async () => {
                const [orgsData, contactsData] = await Promise.all([
                    getOrganizations(),
                    getContacts()
                ])
                setOrgs(orgsData)
                setContacts(contactsData)
            }
            fetchData()
        }
    }, [open, mode])

    const handleConvert = async () => {
        setLoading(true)
        try {
            // Prepare payload
            const payload: any = {
                lead_id: lead.id,
                create_new_org: mode === 'create',
                create_new_contact: mode === 'create',
            }

            if (mode === 'link') {
                if (selectedOrgId) payload.organization_id = selectedOrgId
                if (selectedContactId) payload.contact_id = selectedContactId

                // If linking active, we disable auto-creation unless logic says otherwise.
                // Backend needs to handle "If org_id provided, use it, else create new if requested".
                // My backend update (in implementation plan) said: 
                // "If organization_id provided: Use it. Else if create_new_org: Create."
            }

            // We need to implement this endpoint or update `updateLeadStatus` to handle this.
            // Currently `updateLeadStatus` just changes status.
            // I should probably create a specific action `convertLead` in `actions.ts` and backend endpoint.

            // For now, let's call a new server action `convertLead` (to be created in Lead actions).
            // Or use `apiFetch` directly to a new endpoint.

            // I'll assume endpoint `POST /leads/{id}/convert` exists or I'll create it.
            // Wait, I haven't created the backend endpoint yet!
            // I only planned it in `implementation_plan.md`: "Update PATCH /leads/{id}/convert".

            // I need to implement backend logic first.
            // Call server action
            const res = await convertLead(lead.id, payload)

            if (res.success) {
                toast.success("Converted to Deal")
                onOpenChange(false)
                router.refresh()
            } else {
                toast.error(res.error || "Conversion failed")
            }
        } catch (error) {
            toast.error("Conversion failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Convert Lead to Deal</DialogTitle>
                    <DialogDescription>
                        Create a new Deal from this Lead. You can link to existing Organization/Contact or create new ones.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <RadioGroup
                        defaultValue="create"
                        value={mode}
                        onValueChange={(v) => setMode(v as 'create' | 'link')}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div>
                            <RadioGroupItem value="create" id="create" className="peer sr-only" />
                            <Label
                                htmlFor="create"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                                <span className="text-sm font-semibold">Create New</span>
                                <span className="text-xs text-muted-foreground mt-1 text-center">
                                    Create new Organization & Contact from Lead data
                                </span>
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="link" id="link" className="peer sr-only" />
                            <Label
                                htmlFor="link"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                                <span className="text-sm font-semibold">Link Existing</span>
                                <span className="text-xs text-muted-foreground mt-1 text-center">
                                    Link to existing Organization & Contact
                                </span>
                            </Label>
                        </div>
                    </RadioGroup>

                    {mode === 'link' && (
                        <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                            <div className="space-y-2">
                                <Label>Organization</Label>
                                <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {orgs.map(org => (
                                            <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Contact</Label>
                                <Select value={selectedContactId} onValueChange={setSelectedContactId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Contact" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {contacts.map(contact => (
                                            <SelectItem key={contact.id} value={contact.id}>
                                                {contact.first_name} {contact.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleConvert} disabled={loading}>
                        {loading ? "Converting..." : "Convert"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

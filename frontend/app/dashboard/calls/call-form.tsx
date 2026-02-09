"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
 
import { toast } from "sonner"

interface CallFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: any
    onSuccess?: () => void
    entityType?: string
    entityId?: string
}

export function CallForm({ open, onOpenChange, initialData, onSuccess, entityType: propEntityType, entityId }: CallFormProps) {
    const [loading, setLoading] = useState(false)

    // Form states
    const [type, setType] = useState(initialData?.call_type || "")
    const [toContact, setToContact] = useState(initialData?.to_contact || "")
    const [fromContact, setFromContact] = useState(initialData?.from_contact || "")
    const [status, setStatus] = useState(initialData?.status || "")
    const [durationSeconds, setDurationSeconds] = useState(initialData?.duration_seconds ?? 0)
    const [receivedBy, setReceivedBy] = useState(initialData?.received_by || "")
    const [notes, setNotes] = useState(initialData?.notes || "")
    const [entityType, setEntityType] = useState(propEntityType || initialData?.entity_type || "LEAD")
    // Entity ID handling is complex without a search. For now, simple text or hidden if updated.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const payload: any = {
                call_type: type || "Incoming",
                to_contact: toContact,
                from_contact: fromContact,
                status: status || "Initiated",
                duration_seconds: Number(durationSeconds) || 0,
                received_by: receivedBy,
                notes,
                entity_type: entityType,
                entity_id: entityId
            }

            const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
            if (initialData) {
                const res = await fetch(`${base}/calls/${initialData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                if (!res.ok) throw new Error('Failed to update')
                toast.success("Call updated")
            } else {
                const res = await fetch(`${base}/calls/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                if (!res.ok) throw new Error('Failed to create')
                toast.success("Call logged")
            }

            onOpenChange(false)
            if (onSuccess) onSuccess()
            // Router refresh handled by revalidatePath in action, but client might need it too? 
            // Server actions revalidatePath refreshes the current route segment.

        } catch (error) {
            toast.error("Something went wrong")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Call" : "Log Call"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Update call details." : "Record a new call entry."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Type *</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Incoming">Incoming</SelectItem>
                                    <SelectItem value="Outgoing">Outgoing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>To *</Label>
                            <Input
                                placeholder="To"
                                value={toContact}
                                onChange={(e) => setToContact(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>From *</Label>
                            <Input
                                placeholder="From"
                                value={fromContact}
                                onChange={(e) => setFromContact(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Status *</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Initiated">Initiated</SelectItem>
                                    <SelectItem value="Ringing">Ringing</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Failed">Failed</SelectItem>
                                    <SelectItem value="Busy">Busy</SelectItem>
                                    <SelectItem value="No Answer">No Answer</SelectItem>
                                    <SelectItem value="Queued">Queued</SelectItem>
                                    <SelectItem value="Canceled">Canceled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={durationSeconds}
                                onChange={(e) => setDurationSeconds(Number(e.target.value))}
                            />
                            <p className="text-xs text-gray-500">Call duration in seconds</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Call received by</Label>
                            <Input
                                placeholder="Call received by"
                                value={receivedBy}
                                onChange={(e) => setReceivedBy(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                            Notes
                        </Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

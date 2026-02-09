'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Send, Reply } from "lucide-react"
import { toast } from "sonner"
import { sendEmail, getEmails } from "./actions"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface EmailsTabProps {
    entityType: string
    entityId: string
    defaultTo?: string
}

export function EmailsTab({ entityType, entityId, defaultTo }: EmailsTabProps) {
    const [emails, setEmails] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [sending, setSending] = useState(false)

    // Form
    const [to, setTo] = useState(defaultTo || "")
    const [subject, setSubject] = useState("")
    const [body, setBody] = useState("")

    const fetchEmails = async () => {
        setLoading(true)
        const data = await getEmails(entityType, entityId)
        setEmails(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchEmails()
    }, [entityType, entityId])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        setSending(true)

        try {
            const res = await sendEmail({
                to,
                subject,
                body,
                entity_type: entityType,
                entity_id: entityId
            })

            if (res.success) {
                toast.success("Email sent")
                setOpen(false)
                setSubject("")
                setBody("")
                fetchEmails()
            } else {
                toast.error(res.error || "Failed to send email")
            }
        } catch (error) {
            toast.error("Failed to send email")
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Mail className="w-4 h-4" />
                            Compose Email
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>New Email</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSend} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>To</Label>
                                <Input
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    placeholder="recipient@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Input
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Email subject"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Message</Label>
                                <Textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="Type your message..."
                                    className="min-h-[150px]"
                                    required
                                />
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button type="submit" disabled={sending}>
                                    {sending ? "Sending..." : "Send Email"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <p className="text-sm text-gray-500">Loading emails...</p>
                ) : emails.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                        <p>No emails logged yet</p>
                    </div>
                ) : (
                    emails.map((email) => (
                        <Card key={email.id}>
                            <CardHeader className="py-3 px-4 bg-gray-50/50 border-b">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-sm font-medium">{email.subject}</CardTitle>
                                        <p className="text-xs text-gray-500 mt-1">
                                            To: {email.to} • {new Date(email.sent_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded full">
                                        {email.status}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="py-3 px-4 text-sm whitespace-pre-wrap text-gray-700">
                                {email.body}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

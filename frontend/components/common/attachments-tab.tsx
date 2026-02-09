'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Paperclip, Trash2, FileText, Lock, Globe, Plus } from "lucide-react"
import { toast } from "sonner"
import { deleteAttachment, getAttachments } from "./actions"
import { UploadAttachmentDialog } from "./upload-attachment-dialog"

interface AttachmentsTabProps {
    entityType: string
    entityId: string
}

export function AttachmentsTab({ entityType, entityId }: AttachmentsTabProps) {
    const [attachments, setAttachments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const fetchAttachments = async () => {
        setLoading(true)
        const data = await getAttachments(entityType, entityId)
        setAttachments(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchAttachments()
    }, [entityType, entityId])

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this attachment?")) return

        try {
            const res = await deleteAttachment(id, entityId)
            if (res.success) {
                toast.success("Attachment deleted")
                fetchAttachments()
            } else {
                toast.error(res.error)
            }
        } catch (error) {
            toast.error("Delete failed")
        }
    }

    return (
        <div className="space-y-6">
            <UploadAttachmentDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                entityType={entityType}
                entityId={entityId}
                onUploadSuccess={fetchAttachments}
            />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-medium">Attachments</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="default" // Primary style
                            size="sm"
                            className="bg-black text-white hover:bg-gray-800 gap-2"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            <Plus className="w-4 h-4" />
                            Upload attachment
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>


                    {loading ? (
                        <p className="text-sm text-gray-500">Loading attachments...</p>
                    ) : attachments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                            <p>No attachments yet</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {attachments.map((file) => {
                                const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
                                const previewSrc = `${base}/${(file.file_path || '').replace(/\\\\/g, '/')}`
                                const isImage = (file.file_type || '').startsWith('image/')
                                return (
                                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                                        <a href={previewSrc} target="_blank" rel="noreferrer" className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg h-12 w-12 flex items-center justify-center overflow-hidden">
                                                {isImage ? (
                                                    <img
                                                        src={previewSrc}
                                                        alt={file.file_name}
                                                        className="object-cover h-full w-full rounded"
                                                    />
                                                ) : (
                                                    <FileText className="w-4 h-4 text-gray-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-blue-600 hover:underline">{file.file_name}</p>
                                                {file.description ? (
                                                    <p className="text-xs text-gray-600">{file.description}</p>
                                                ) : null}
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span>{new Date(file.created_at).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        {file.is_public ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                                        {file.is_public ? "Public" : "Private"}
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(file.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

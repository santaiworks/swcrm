'use client'

import { useState, useRef, useCallback } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Monitor, Link as LinkIcon, Camera, FileText, Trash2, X, UploadCloud } from 'lucide-react'
import { toast } from 'sonner'
import { uploadAttachment } from './actions'
import { cn } from '@/lib/utils'

interface UploadAttachmentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    entityType: string
    entityId: string
    onUploadSuccess: () => void
}

export function UploadAttachmentDialog({
    open,
    onOpenChange,
    entityType,
    entityId,
    onUploadSuccess
}: UploadAttachmentDialogProps) {
    const [file, setFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isPrivate, setIsPrivate] = useState(true) // Default to private as per screenshot
    const [isUploading, setIsUploading] = useState(false)
    const [description, setDescription] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            // Take the first file for now
            setFile(e.dataTransfer.files[0])
        }
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
        }
    }

    const handleRemoveFile = () => {
        setFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('entity_type', entityType)
        formData.append('entity_id', entityId)
        formData.append('is_public', String(!isPrivate)) // is_public is opposite of isPrivate
        if (description) {
            formData.append('description', description)
        }

        try {
            const res = await uploadAttachment(formData)
            if (res.success) {
                toast.success('File uploaded successfully')
                onUploadSuccess()
                onOpenChange(false)
                handleRemoveFile()
            } else {
                toast.error(res.error || 'Upload failed')
            }
        } catch (error) {
            toast.error('Something went wrong during upload')
        } finally {
            setIsUploading(false)
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden bg-white">
                <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
                    <DialogTitle>Attach</DialogTitle>
                    {/* Close button handled by Dialog primitive usually, but we can customize or let it be */}
                </DialogHeader>

                <div className="p-6">
                    {!file ? (
                        <div
                            className={cn(
                                "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer bg-gray-50/50",
                                isDragging ? "border-black bg-gray-50" : "border-gray-200 hover:bg-gray-50"
                            )}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={handleFileSelect}
                            />

                            <p className="text-gray-500 mb-6 text-sm">
                                Drag and drop files here or upload from
                            </p>

                            <div className="flex items-center gap-8">
                                <button type="button" className="flex flex-col items-center gap-2 group" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>
                                    <div className="h-10 w-10 bg-white border rounded-lg flex items-center justify-center shadow-sm group-hover:border-gray-400 transition-colors">
                                        <Monitor className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <span className="text-xs text-gray-500">Device</span>
                                </button>
                                <button type="button" className="flex flex-col items-center gap-2 group" onClick={(e) => e.stopPropagation()}>
                                    <div className="h-10 w-10 bg-white border rounded-lg flex items-center justify-center shadow-sm group-hover:border-gray-400 transition-colors">
                                        <LinkIcon className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <span className="text-xs text-gray-500">Link</span>
                                </button>
                                <button type="button" className="flex flex-col items-center gap-2 group" onClick={(e) => e.stopPropagation()}>
                                    <div className="h-10 w-10 bg-white border rounded-lg flex items-center justify-center shadow-sm group-hover:border-gray-400 transition-colors">
                                        <Camera className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <span className="text-xs text-gray-500">Camera</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 bg-blue-100 rounded flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(file.size)}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Checkbox
                                            id="is-private"
                                            checked={isPrivate}
                                            onCheckedChange={(c) => setIsPrivate(!!c)}
                                            className="h-4 w-4 data-[state=checked]:bg-black data-[state=checked]:text-white border-gray-300"
                                        />
                                        <Label htmlFor="is-private" className="text-xs text-gray-500 font-normal cursor-pointer select-none">
                                            Private
                                        </Label>
                                    </div>
                                </div>
                                <button onClick={handleRemoveFile} className="text-gray-400 hover:text-gray-600">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        <div className="space-y-2">
                            <Label htmlFor="attachment-description" className="text-xs text-gray-500 font-normal">Deskripsi</Label>
                            <input
                                id="attachment-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Tambahkan deskripsi singkat"
                                className="w-full border rounded px-3 py-2 text-sm"
                            />
                        </div>

                            <div className="flex items-center justify-between pt-2">
                                <Button
                                    variant="ghost"
                                    className="text-gray-500 hover:text-gray-900 h-auto px-0 py-1"
                                >
                                    Remove all
                                </Button>
                                <div className="flex gap-3 items-center">
                                    {/* Optional: "Set all as public" if multiple files */}

                                    <Button
                                        onClick={handleUpload}
                                        disabled={isUploading}
                                        className="bg-black text-white hover:bg-gray-800"
                                    >
                                        {isUploading ? 'Uploading...' : 'Attach'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )

}

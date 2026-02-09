'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Plus, Trash2, Edit2 } from 'lucide-react'
import { apiFetchClient } from '@/lib/api-client'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'

interface Note {
    id: string
    content: string
    created_at: string
    updated_at: string
}

interface NotesTabProps {
    entityType: 'LEAD' | 'DEAL' | 'CONTACT' | 'ORGANIZATION'
    entityId: string
}

export function NotesTab({ entityType, entityId }: NotesTabProps) {
    const [notes, setNotes] = useState<Note[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newNoteContent, setNewNoteContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchNotes = async () => {
        try {
            // Fetch notes filtered by entity
            // Using query params: /notes?entity_type=...&entity_id=...
            const res = await apiFetchClient(`/notes?entity_type=${entityType}&entity_id=${entityId}`)
            if (res.ok) {
                const data = await res.json()
                setNotes(data)
            }
        } catch (error) {
            console.error('Failed to fetch notes:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchNotes()
    }, [entityType, entityId])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newNoteContent.trim()) return

        setIsSubmitting(true)
        try {
            const res = await apiFetchClient('/notes', {
                method: 'POST',
                body: JSON.stringify({
                    content: newNoteContent,
                    entity_type: entityType,
                    entity_id: entityId
                })
            })

            if (res.ok) {
                toast.success('Note added')
                setNewNoteContent('')
                setIsCreateOpen(false)
                fetchNotes()
            } else {
                toast.error('Failed to add note')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this note?")) return

        try {
            const res = await apiFetchClient(`/notes/${id}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                toast.success('Note deleted')
                fetchNotes()
            } else {
                toast.error('Failed to delete')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error deleting note')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Notes</h3>
                <Button onClick={() => setIsCreateOpen(true)} size="sm" className="bg-black text-white hover:bg-gray-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Note
                </Button>
            </div>

            {isLoading ? (
                <div className="text-sm text-gray-500">Loading notes...</div>
            ) : notes.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-lg">
                    <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No notes yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notes.map((note) => (
                        <Card key={note.id}>
                            <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <p className="whitespace-pre-wrap text-sm text-gray-800">{note.content}</p>
                                    <div className="flex gap-1 ml-4">
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-500" onClick={() => handleDelete(note.id)}>
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">
                                    {format(new Date(note.created_at), 'MMM d, yyyy h:mm a')}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Note</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <Textarea
                            placeholder="Type your note here..."
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            minLength={1}
                            required
                            className="min-h-[100px]"
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>Save Note</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

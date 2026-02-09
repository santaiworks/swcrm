'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createNote } from '@/app/dashboard/notes/actions'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
    content: z.string().min(1, 'Content is required'),
    entity_type: z.string().min(1, 'Entity type is required'),
    entity_id: z.string().uuid('Invalid UUID'),
})

interface CreateNoteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateNoteDialog({ open, onOpenChange }: CreateNoteDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: '',
            entity_type: 'Unknown',
            entity_id: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const result = await createNote(values)
            if (result.success) {
                toast.success('Note created successfully')
                onOpenChange(false)
                form.reset()
            } else {
                toast.error('Failed to create note')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Note</DialogTitle>
                    <DialogDescription>
                        Add a new note manually.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Note content..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="entity_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Entity Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="LEAD">Lead</SelectItem>
                                                <SelectItem value="DEAL">Deal</SelectItem>
                                                <SelectItem value="CONTACT">Contact</SelectItem>
                                                <SelectItem value="ORGANIZATION">Organization</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="entity_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Entity ID (UUID)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="uuid" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Creating...' : 'Create Note'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

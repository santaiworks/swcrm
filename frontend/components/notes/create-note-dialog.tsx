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
    title: z.string().min(1, 'Title is required'),
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
            title: '',
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
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="p-6">
                    <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                        <DialogTitle className="text-2xl font-bold">Create note</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-medium text-gray-400">
                                            Title <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Call with John Doe"
                                                className="bg-gray-50/50 border-none h-12 text-base focus-visible:ring-1 focus-visible:ring-gray-200"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-medium text-gray-400">Content</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Took a call with John Doe and discussed the new project."
                                                className="bg-gray-50/50 border-none min-h-[200px] text-base resize-none focus-visible:ring-1 focus-visible:ring-gray-200 p-4"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-black text-white hover:bg-gray-800 h-10 px-6 rounded-xl font-semibold"
                                >
                                    {isLoading ? 'Creating...' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

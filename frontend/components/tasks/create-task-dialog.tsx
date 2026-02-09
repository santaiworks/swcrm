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
import { createTask } from '@/app/dashboard/tasks/actions'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    due_date: z.string().optional(),
    priority: z.string().optional(),
    status: z.string().optional(),
    entity_type: z.string().optional(),
    entity_id: z.string().optional(),
})

interface CreateTaskDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            due_date: '',
            priority: 'Medium',
            status: 'Pending',
            entity_type: '',
            entity_id: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const formattedValues = {
                ...values,
                due_date: values.due_date ? new Date(values.due_date).toISOString() : null,
                entity_id: values.entity_id ? values.entity_id : null,
                entity_type: values.entity_type ? values.entity_type : null
            }

            const result = await createTask(formattedValues)
            if (result.success) {
                toast.success('Task created successfully')
                onOpenChange(false)
                form.reset()
            } else {
                toast.error('Failed to create task')
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
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                        Add a new task. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Task Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Description..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="due_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Due Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Low">Low</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="High">High</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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
                                {isLoading ? 'Creating...' : 'Create Task'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

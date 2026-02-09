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
import { createOrganization } from '@/app/dashboard/organizations/actions'
import { toast } from 'sonner'

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    website: z.string().optional(),
    industry: z.string().optional(),
    no_employees: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
})

interface CreateOrganizationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateOrganizationDialog({ open, onOpenChange }: CreateOrganizationDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            website: '',
            industry: '',
            no_employees: '',
            city: '',
            country: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const result = await createOrganization(values)
            if (result.success) {
                toast.success('Organization created successfully')
                onOpenChange(false)
                form.reset()
            } else {
                toast.error('Failed to create organization')
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
                    <DialogTitle>Create New Organization</DialogTitle>
                    <DialogDescription>
                        Add a new organization to your records. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Organization Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website</FormLabel>
                                    <FormControl>
                                        <Input placeholder="example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="industry"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Industry</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Technology" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="no_employees"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Employees</FormLabel>
                                        <FormControl>
                                            <Input placeholder="10-50" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input placeholder="New York" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input placeholder="USA" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Creating...' : 'Create Organization'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

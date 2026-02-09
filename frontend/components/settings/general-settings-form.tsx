"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { updateSettings } from "@/app/(crm)/settings/actions"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    app_name: z.string().min(2, {
        message: "App name must be at least 2 characters.",
    }),
    company_name: z.string().min(2, {
        message: "Company name must be at least 2 characters.",
    }),
    currency: z.string({
        required_error: "Please select a currency.",
    }),
})

interface GeneralSettingsFormProps {
    initialData: any
}

export function GeneralSettingsForm({ initialData }: GeneralSettingsFormProps) {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            app_name: initialData?.app_name || "SantaiWorks CRM",
            company_name: initialData?.company_name || "SantaiWorks",
            currency: initialData?.currency || "IDR",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const res = await updateSettings(values)

            if (!res.success) {
                throw new Error(res.error || 'Failed to update settings')
            }

            toast.success("Settings updated successfully")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "Failed to update settings")
            console.error(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl bg-white p-6 rounded-lg border shadow-sm">
                <FormField
                    control={form.control}
                    name="app_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Application Name</FormLabel>
                            <FormControl>
                                <Input placeholder="SantaiWorks CRM" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the name that will be displayed on the dashboard header.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                                <Input placeholder="SantaiWorks" {...field} />
                            </FormControl>
                            <FormDescription>
                                Your company name used in reports and emails.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a currency" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="IDR">IDR (Indonesian Rupiah)</SelectItem>
                                    <SelectItem value="USD">USD (United States Dollar)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                The default currency used for deals and reports.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Save changes</Button>
            </form>
        </Form>
    )
}

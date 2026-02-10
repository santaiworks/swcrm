'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, addDays, startOfToday } from "date-fns"
import {
    Calendar as CalendarIcon,
    CircleDashed,
    Circle,
    CircleDot,
    CheckCircle2,
    XCircle,
    Search,
    X
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import { apiFetchClient } from '@/lib/api-client'

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    due_date: z.date().optional().nullable(),
    priority_id: z.string().optional().nullable(),
    status_id: z.string().optional().nullable(),
    entity_type: z.string().optional().nullable(),
    entity_id: z.string().optional().nullable(),
})

interface CreateTaskDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    defaultEntity?: { type: string, id: string, name: string }
}

const statusIcons: Record<string, any> = {
    'Backlog': CircleDashed,
    'Todo': Circle,
    'In Progress': CircleDot,
    'Done': CheckCircle2,
    'Canceled': XCircle,
}

export function CreateTaskDialog({ open, onOpenChange, defaultEntity }: CreateTaskDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [statuses, setStatuses] = useState<any[]>([])
    const [priorities, setPriorities] = useState<any[]>([])
    const [entities, setEntities] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [mounted, setMounted] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            due_date: null,
            priority_id: null,
            status_id: null,
            entity_type: defaultEntity?.type || null,
            entity_id: defaultEntity?.id || null,
        },
    })

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (open) {
            // Fetch master data only if not already loaded
            if (statuses.length === 0) {
                apiFetchClient('/master-data/master_task_status').then(r => r.json()).then(setStatuses)
            }
            if (priorities.length === 0) {
                apiFetchClient('/master-data/master_task_priority').then(r => r.json()).then(setPriorities)
            }

            // Set default status/priority if not set
            if (statuses.length > 0 && !form.getValues('status_id')) {
                const todo = statuses.find((s: any) => s.name === 'Todo')
                if (todo) form.setValue('status_id', todo.id)
            }
            if (priorities.length > 0 && !form.getValues('priority_id')) {
                const medium = priorities.find((p: any) => p.name === 'Medium')
                if (medium) form.setValue('priority_id', medium.id)
            }
        }
    }, [open, statuses.length, priorities.length])

    // Fetch entities for search
    useEffect(() => {
        if (searchQuery.length > 1) {
            apiFetchClient(`/leads?query=${searchQuery}`).then(r => r.json()).then(data => {
                setEntities(data.map((l: any) => ({
                    id: l.id,
                    name: `${l.first_name} ${l.last_name || ''}`,
                    type: 'LEAD'
                })))
            })
        }
    }, [searchQuery])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const result = await createTask({
                ...values,
                due_date: values.due_date ? values.due_date.toISOString() : null
            })
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

    const selectedStatus = statuses.find(s => s.id === form.watch('status_id'))
    const selectedPriority = priorities.find(p => p.id === form.watch('priority_id'))
    const selectedEntityName = defaultEntity?.name || entities.find(e => e.id === form.watch('entity_id'))?.name || 'Search Lead/Project'

    if (!mounted) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="p-6">
                    <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                        <DialogTitle className="text-2xl font-bold font-display">Create task</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-semibold text-gray-500">
                                            Title <span className="text-red-500 font-bold">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="What needs to be done?"
                                                className="bg-gray-50/50 border-none h-12 text-lg focus-visible:ring-2 focus-visible:ring-blue-500/20 placeholder:text-gray-300 font-medium"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-semibold text-gray-500">Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Add more details about this task..."
                                                className="bg-gray-50/50 border-none min-h-[160px] text-base resize-none focus-visible:ring-2 focus-visible:ring-blue-500/20 p-4 placeholder:text-gray-300"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex flex-wrap items-center gap-2 pt-2">
                                {/* Status Picker */}
                                <FormField
                                    control={form.control}
                                    name="status_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={(v) => field.onChange(v)} value={field.value || undefined}>
                                                <FormControl>
                                                    <SelectTrigger className="h-9 w-auto border-none bg-gray-100/50 text-gray-700 hover:bg-gray-200/50 transition-all px-3 rounded-full font-semibold flex gap-2 items-center text-xs">
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-2xl border-none shadow-2xl p-1">
                                                    {statuses.map(s => {
                                                        const Icon = statusIcons[s.name] || Circle
                                                        return (
                                                            <SelectItem key={s.id} value={s.id} className="flex gap-2 items-center rounded-xl py-2 px-3 focus:bg-gray-50 cursor-pointer">
                                                                <div className="flex items-center gap-2.5">
                                                                    <Icon className="w-4 h-4" style={{ color: s.color }} />
                                                                    <span className="font-medium text-sm">{s.name}</span>
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                {/* Entity/Project Picker */}
                                <FormField
                                    control={form.control}
                                    name="entity_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "h-9 w-auto border-none bg-gray-100/50 text-gray-700 hover:bg-gray-200/50 transition-all px-3 rounded-full font-semibold flex gap-2 items-center text-xs",
                                                                !field.value && "text-gray-400 font-medium"
                                                            )}
                                                        >
                                                            <Search className="w-3.5 h-3.5 mr-0.5" />
                                                            {selectedEntityName}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[300px] p-0 rounded-2xl border-none shadow-2xl overflow-hidden" align="start">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Type to search leads..."
                                                            onValueChange={setSearchQuery}
                                                            className="border-none focus:ring-0"
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty className="py-4 text-xs font-medium text-gray-400">No matching leads found.</CommandEmpty>
                                                            <CommandGroup className="p-1">
                                                                {entities.map((entity) => (
                                                                    <CommandItem
                                                                        key={entity.id}
                                                                        value={entity.id}
                                                                        onSelect={() => {
                                                                            form.setValue("entity_id", entity.id)
                                                                            form.setValue("entity_type", entity.type)
                                                                        }}
                                                                        className="rounded-xl flex items-center gap-3 py-2 px-3 cursor-pointer"
                                                                    >
                                                                        <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                                                            {entity.name[0]}
                                                                        </div>
                                                                        <span className="font-medium">{entity.name}</span>
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                            <CommandGroup className="border-t border-gray-50 p-1">
                                                                <CommandItem
                                                                    onSelect={() => {
                                                                        form.setValue("entity_id", null)
                                                                        form.setValue("entity_type", null)
                                                                    }}
                                                                    className="rounded-xl flex items-center gap-3 py-2 px-3 text-red-500 cursor-pointer"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                    <span className="font-medium">Clear entity</span>
                                                                </CommandItem>
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                />

                                {/* Date & Time Picker */}
                                <FormField
                                    control={form.control}
                                    name="due_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "h-9 w-auto border-none bg-gray-100/50 text-gray-600 hover:bg-gray-200/50 transition-all px-3 rounded-full font-semibold text-xs",
                                                                !field.value && "text-gray-400 font-medium"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "MMM d, h:mm a")
                                                            ) : (
                                                                "Due Date"
                                                            )}
                                                            <CalendarIcon className="ml-2 h-3.5 w-3.5 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 rounded-3xl border-none shadow-2xl overflow-hidden" align="start">
                                                    <div className="p-3 bg-gray-50/50 flex gap-2 border-b border-gray-100">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="rounded-xl bg-white hover:bg-gray-100 h-8 text-[11px] font-bold text-gray-600 border border-gray-100 shadow-sm"
                                                            onClick={() => field.onChange(new Date())}
                                                        >
                                                            Today
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="rounded-xl bg-white hover:bg-gray-100 h-8 text-[11px] font-bold text-gray-600 border border-gray-100 shadow-sm"
                                                            onClick={() => field.onChange(addDays(startOfToday(), 1))}
                                                        >
                                                            Tomorrow
                                                        </Button>
                                                    </div>
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value || undefined}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                        className="p-3"
                                                    />
                                                    <div className="p-3 border-t border-gray-100 bg-gray-50/30">
                                                        <Select onValueChange={(v) => {
                                                            const d = field.value || new Date()
                                                            const [h, m] = v.split(':').map(Number)
                                                            d.setHours(h, m)
                                                            field.onChange(new Date(d))
                                                        }}>
                                                            <SelectTrigger className="w-full h-9 bg-white border-gray-200 rounded-xl text-xs font-semibold shadow-sm">
                                                                <SelectValue placeholder="Set time" />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-none shadow-2xl max-h-[180px]">
                                                                {Array.from({ length: 48 }).map((_, i) => {
                                                                    const h = Math.floor(i / 2)
                                                                    const m = (i % 2) * 30
                                                                    const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
                                                                    return <SelectItem key={time} value={time} className="rounded-lg text-xs font-medium">{time}</SelectItem>
                                                                })}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                />

                                {/* Priority Picker */}
                                <FormField
                                    control={form.control}
                                    name="priority_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={(v) => field.onChange(v)} value={field.value || undefined}>
                                                <FormControl>
                                                    <SelectTrigger className="h-9 w-auto border-none bg-gray-100/50 text-gray-700 hover:bg-gray-200/50 transition-all px-3 rounded-full font-semibold flex gap-2 items-center text-xs">
                                                        <SelectValue placeholder="Priority" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-2xl border-none shadow-2xl p-1">
                                                    {priorities.map(p => (
                                                        <SelectItem key={p.id} value={p.id} className="rounded-xl py-2 px-3 focus:bg-gray-50 cursor-pointer">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                                                                <span className="font-medium text-sm">{p.name}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-black text-white hover:bg-gray-800 h-11 px-8 rounded-2xl font-bold text-base shadow-lg shadow-black/10 transition-transform active:scale-95"
                                >
                                    {isLoading ? 'Creating...' : 'Create Task'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { searchMasterData, createMasterData } from '@/app/dashboard/leads/master-actions'

interface MasterDataComboboxProps {
    table: 'master_industries' | 'master_sources' | 'master_salutations' | 'master_employee_counts' | 'master_lead_status'
    value?: string
    onChange: (value: string) => void
    name?: string
    placeholder?: string
    disabled?: boolean
}

export function MasterDataCombobox({
    table,
    value,
    onChange,
    name,
    placeholder = 'Select...',
    disabled = false
}: MasterDataComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState('')
    const [items, setItems] = React.useState<{ id: number, name: string }[]>([])
    const [loading, setLoading] = React.useState(false)

    // Dialog state
    const [showCreateDialog, setShowCreateDialog] = React.useState(false)
    const [createValue, setCreateValue] = React.useState('')
    const [isCreating, setIsCreating] = React.useState(false)

    // Initial fetch or fetch on open? 
    // Let's fetch on open to save resources, or fetch once mounted.
    // Ideally use SWR or React Query, but for simplicity let's use useEffect
    React.useEffect(() => {
        if (open) {
            setLoading(true)
            searchMasterData(table, '')
                .then(data => {
                    setItems(data || [])
                })
                .finally(() => setLoading(false))
        }
    }, [open, table])

    // Handle creation
    const handleCreateClick = () => {
        setCreateValue(query)
        setShowCreateDialog(true)
        setOpen(false)
    }

    const handleCreateConfirm = async () => {
        if (!createValue) return

        setIsCreating(true)
        const response = await createMasterData(table, createValue)
        setIsCreating(false)

        if (response.data) {
            const newItem = response.data
            setItems(prev => [...prev, newItem])
            onChange(newItem.name)
            setShowCreateDialog(false)
            setQuery('')
        } else {
            console.error(response.error)
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-gray-50/50 border-gray-200 h-8 text-sm font-normal text-muted-foreground hover:bg-gray-50/50"
                    disabled={disabled}
                >
                    {value ? (
                        <span className="text-foreground">{value}</span>
                    ) : (
                        placeholder
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={`Search ${placeholder.toLowerCase()}...`}
                        value={query}
                        onValueChange={(val) => {
                            setQuery(val)
                            // Debounce search ideally
                            searchMasterData(table, val).then(setItems)
                        }}
                    />
                    <CommandList>
                        <CommandEmpty className="py-2 px-2 text-sm">
                            {query ? (
                                <div className="flex flex-col gap-2">
                                    <p className="text-muted-foreground">No results found.</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start h-8"
                                        onClick={handleCreateClick}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create "{query}"
                                    </Button>
                                </div>
                            ) : (
                                "No results found."
                            )}
                        </CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={item.name}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === item.name ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <div className="p-1 border-t mt-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start h-8 text-muted-foreground font-normal"
                                onClick={() => {
                                    onChange("")
                                    setOpen(false)
                                }}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        </div>
                    </CommandList>
                </Command>
            </PopoverContent>
            {name && <input type="hidden" name={name} value={value} />}

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="flex flex-row items-center justify-between">
                        <DialogTitle>New {placeholder}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {placeholder}
                            </Label>
                            <Input
                                id="name"
                                value={createValue}
                                onChange={(e) => setCreateValue(e.target.value)}
                                className="col-span-3"
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={handleCreateConfirm}
                            disabled={isCreating}
                            className="w-full bg-black text-white hover:bg-gray-800"
                        >
                            {isCreating ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Popover>
    )
}

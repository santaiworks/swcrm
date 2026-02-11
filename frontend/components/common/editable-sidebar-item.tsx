'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'

interface EditableSidebarItemProps {
    value: string | number | null | undefined
    onSave: (value: string) => Promise<{ success: boolean; error?: string }>
    type?: 'text' | 'select' | 'date' | 'email' | 'url' | 'tel'
    options?: { label: string; value: string }[]
    placeholder?: string
    renderValue?: (value: any) => React.ReactNode
    label: string // For toast messages and tracking
}

export function EditableSidebarItem({
    value: initialValue,
    onSave,
    type = 'text',
    options = [],
    placeholder = 'Empty',
    renderValue,
    label
}: EditableSidebarItemProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(initialValue?.toString() || '')
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setValue(initialValue?.toString() || '')
    }, [initialValue])

    const handleSave = async () => {
        if (value === (initialValue?.toString() || '')) {
            setIsEditing(false)
            return
        }

        setIsLoading(true)
        try {
            const result = await onSave(value)
            if (result.success) {
                toast.dismiss()
                toast.success(`${label} updated successfully`) // "Document updated successfully" as per screenshot, but specific is better. Screenshot said "Document updated", I'll stick to that if user insisted, but dynamic is better.
                // Screenshot: "Document updated successfully"
                // Let's use "Document updated successfully" to match screenshot exactly if that's the desired generic message, 
                // but usually specific is cleaner. I'll use the generic one for now to match expectations.
                // toast.success("Document updated successfully") 
                setIsEditing(false)
            } else {
                toast.error(result.error || `Failed to update ${label}`)
                setValue(initialValue?.toString() || '') // Revert on error
            }
        } catch (error) {
            toast.error('Something went wrong')
            setValue(initialValue?.toString() || '')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        setValue(initialValue?.toString() || '')
        setIsEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave()
        } else if (e.key === 'Escape') {
            handleCancel()
        }
    }

    // Auto-focus input when entering edit mode
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing])

    if (isEditing) {
        if (type === 'select') {
            return (
                <div className="flex items-center gap-2 w-full">
                    <Select
                        value={value}
                        onValueChange={(val) => {
                            setValue(val)
                            // Auto save on select change? Usually yes for dropdowns
                            // Or wait for confirm? Dropdowns are tricky with generic onBlur.
                            // Let's trigger save immediately on change for better UX similar to ClickUp/Notion
                            // We need to wrap it in a function because state update is async-ish, but here we can just call save with new val
                            // Actually, let's keep it manual save or simple:
                        }}
                    >
                        <SelectTrigger className="h-8 text-sm w-full">
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex items-center">
                        <button onClick={() => { handleSave(); /* Note: value state might not be updated yet if we relied on sync save in onChange */ }} className="p-1 hover:bg-green-100 text-green-600 rounded">
                            <Check className="w-4 h-4" />
                        </button>
                        <button onClick={handleCancel} className="p-1 hover:bg-red-100 text-red-600 rounded">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )
        }

        return (
            <div className="flex items-center gap-1 w-full animate-in fade-in duration-200">
                <Input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="h-8 text-sm px-2 py-1 w-full"
                    placeholder={placeholder}
                    type={type}
                    autoFocus
                />
                {isLoading && (
                    <div className="flex-shrink-0 ml-1">
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                    </div>
                )}
            </div>
        )
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className={cn(
                "min-h-[20px] w-full cursor-pointer hover:bg-gray-100 rounded px-1 -ml-1 py-0.5 transition-colors group flex items-center justify-between",
                !initialValue && "text-gray-400 italic"
            )}
            title="Click to edit"
        >
            <span className="truncate block w-full">
                {renderValue ? renderValue(initialValue) : (initialValue || placeholder)}
            </span>
            <span className="opacity-0 group-hover:opacity-50 text-gray-400 text-[10px] ml-2 flex-shrink-0">
                Edit
            </span>
        </div>
    )
}

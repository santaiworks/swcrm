'use client'

import { useState, useEffect } from 'react'
import { CheckSquare, Plus, CheckCircle2, Circle, CircleDashed, CircleDot, XCircle, Calendar as CalendarIcon } from 'lucide-react'
import { apiFetchClient } from '@/lib/api-client'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { CreateTaskDialog } from '../tasks/create-task-dialog'
import { Button } from '@/components/ui/button'

const statusIcons: Record<string, any> = {
    'Backlog': CircleDashed,
    'Todo': Circle,
    'In Progress': CircleDot,
    'Done': CheckCircle2,
    'Canceled': XCircle,
}

interface Task {
    id: string
    title: string
    description?: string
    status: string
    priority?: string
    due_date?: string
    created_at: string
    status_rel?: {
        name: string
        icon: string
        color: string
    }
    priority_rel?: {
        name: string
        color: string
    }
}

interface TasksTabProps {
    entityType: 'LEAD' | 'DEAL' | 'CONTACT' | 'ORGANIZATION'
    entityId: string
    entityName?: string
}

export function TasksTab({ entityType, entityId, entityName }: TasksTabProps) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const fetchTasks = async () => {
        try {
            const res = await apiFetchClient(`/tasks?entity_type=${entityType}&entity_id=${entityId}`)
            if (res.ok) {
                const data = await res.json()
                setTasks(data)
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [entityType, entityId])

    if (!mounted) return null

    const toggleStatus = async (task: Task) => {
        const isDone = task.status === 'Done'
        // Find 'Done' or 'Todo' status ID from master data would be better, but for toggle we'll just use names if supported for quick toggle or just toast
        toast.info("Please use the edit dialog to change status")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Tasks</h3>
                <Button onClick={() => setIsCreateOpen(true)} size="sm" className="bg-black text-white hover:bg-gray-800 rounded-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                </Button>
            </div>

            {isLoading ? (
                <div className="text-sm text-gray-500">Loading tasks...</div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-lg">
                    <CheckSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No tasks yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => {
                        const StatusIcon = statusIcons[task.status] || Circle
                        return (
                            <div key={task.id} className="flex items-start gap-3 p-3 border rounded-xl hover:bg-gray-50 transition-colors group">
                                <div className="mt-1">
                                    <StatusIcon className="w-5 h-5" style={{ color: task.status_rel?.color }} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className={`text-sm font-medium ${task.status === 'Done' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                            {task.title}
                                        </p>
                                        {task.priority_rel && (
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-50 text-[10px] font-semibold text-gray-500 capitalize">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: task.priority_rel.color }} />
                                                {task.priority_rel.name}
                                            </div>
                                        )}
                                    </div>
                                    {task.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>}
                                    <div className="flex items-center gap-3 mt-2">
                                        {task.due_date && (
                                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                <CalendarIcon className="w-3 h-3" />
                                                {format(new Date(task.due_date), 'MMM d, h:mm a')}
                                            </div>
                                        )}
                                        <span className="text-[10px] text-gray-400">
                                            Added {format(new Date(task.created_at), 'MMM d')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <CreateTaskDialog
                open={isCreateOpen}
                onOpenChange={(open) => {
                    setIsCreateOpen(open)
                    if (!open) fetchTasks()
                }}
                defaultEntity={{ type: entityType, id: entityId, name: entityName || '' }}
            />
        </div>
    )
}

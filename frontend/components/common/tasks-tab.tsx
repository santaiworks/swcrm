'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckSquare, Plus, CheckCircle2, Circle } from 'lucide-react'
import { apiFetchClient } from '@/lib/api-client'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
// Assuming we can reuse CreateTaskDialog or create a simple one. 
// For now, I'll create a simple task creation inline or dialog for speed.
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Task {
    id: string
    title: string
    description?: string
    status: string
    priority?: string
    due_date?: string
    created_at: string
}

interface TasksTabProps {
    entityType: 'LEAD' | 'DEAL' | 'CONTACT' | 'ORGANIZATION'
    entityId: string
}

export function TasksTab({ entityType, entityId }: TasksTabProps) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTaskTitle.trim()) return

        setIsSubmitting(true)
        try {
            const res = await apiFetchClient('/tasks', {
                method: 'POST',
                body: JSON.stringify({
                    title: newTaskTitle,
                    status: 'Pending',
                    entity_type: entityType,
                    entity_id: entityId
                })
            })

            if (res.ok) {
                toast.success('Task added')
                setNewTaskTitle('')
                setIsCreateOpen(false)
                fetchTasks()
            } else {
                toast.error('Failed to add task')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    const toggleStatus = async (task: Task) => {
        const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed'
        try {
            const res = await apiFetchClient(`/tasks/${task.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            })
            if (res.ok) {
                setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t))
                toast.success(`Task marked as ${newStatus}`)
            }
        } catch (error) {
            toast.error('Failed to update task')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Tasks</h3>
                <Button onClick={() => setIsCreateOpen(true)} size="sm" className="bg-black text-white hover:bg-gray-800">
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
                    {tasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors group">
                            <button onClick={() => toggleStatus(task)} className="mt-0.5 text-gray-400 hover:text-green-600 transition-colors">
                                {task.status === 'Completed' ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                    <Circle className="w-5 h-5" />
                                )}
                            </button>
                            <div className="flex-1">
                                <p className={`text-sm font-medium ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                    {task.title}
                                </p>
                                {task.description && <p className="text-xs text-gray-500 mt-1">{task.description}</p>}
                                <div className="flex items-center gap-2 mt-2">
                                    {task.due_date && (
                                        <Badge variant="outline" className="text-[10px] px-1.5 h-5">
                                            Due {format(new Date(task.due_date), 'MMM d')}
                                        </Badge>
                                    )}
                                    <span className="text-[10px] text-gray-400">
                                        Added {format(new Date(task.created_at), 'MMM d')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Task</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Task Title</Label>
                            <Input
                                id="title"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                minLength={1}
                                required
                                placeholder="e.g. Follow up with client"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>Save Task</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

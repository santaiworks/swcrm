import { apiFetch } from '@/lib/api'
import TasksClient from '../../dashboard/tasks/client'

async function getTasks() {
  try {
    const res = await apiFetch('/tasks/')
    if (!res.ok) return []
    return await res.json()
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    return []
  }
}

export default async function TasksPage() {
  const tasks = await getTasks()
  return <TasksClient tasks={tasks} />
}

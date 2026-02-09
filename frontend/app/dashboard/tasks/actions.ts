'use server'

import { apiFetch } from '@/lib/api'
import { revalidatePath } from 'next/cache'

export async function createTask(data: any) {
    const res = await apiFetch('/tasks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        return { success: false, error: await res.text() }
    }

    revalidatePath('/tasks')
    return { success: true }
}

export async function deleteTask(id: string) {
    const res = await apiFetch(`/tasks/${id}`, {
        method: 'DELETE',
    })

    if (!res.ok) {
        return { success: false, error: await res.text() }
    }

    revalidatePath('/tasks')
    return { success: true }
}

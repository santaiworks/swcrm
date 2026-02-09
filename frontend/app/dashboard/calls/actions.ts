'use server'

import { apiFetch } from '@/lib/api'
import { revalidatePath } from 'next/cache'

export async function createCall(data: any) {
    const res = await apiFetch('/calls/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        throw new Error('Failed to create call')
    }

    revalidatePath('/dashboard/calls')
    return await res.json()
}

export async function updateCall(id: string, data: any) {
    const res = await apiFetch(`/calls/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        throw new Error('Failed to update call')
    }

    revalidatePath('/dashboard/calls')
    return await res.json()
}

export async function deleteCall(id: string) {
    const res = await apiFetch(`/calls/${id}`, {
        method: 'DELETE'
    })

    if (!res.ok) {
        throw new Error('Failed to delete call')
    }

    revalidatePath('/dashboard/calls')
    return true
}

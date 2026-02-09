'use server'

import { apiFetch } from '@/lib/api'
import { revalidatePath } from 'next/cache'

export async function createOrganization(data: any) {
    const res = await apiFetch('/organizations/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        return { success: false, error: await res.text() }
    }

    revalidatePath('/organizations')
    return { success: true }
}

export async function deleteOrganization(id: string) {
    const res = await apiFetch(`/organizations/${id}`, {
        method: 'DELETE',
    })

    if (!res.ok) {
        return { success: false, error: await res.text() }
    }

    revalidatePath('/organizations')
    return { success: true }
}

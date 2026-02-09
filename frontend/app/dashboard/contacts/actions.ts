'use server'

import { apiFetch } from '@/lib/api'
import { revalidatePath } from 'next/cache'

export async function createContact(data: any) {
    const res = await apiFetch('/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        return { success: false, error: await res.text() }
    }

    revalidatePath('/contacts')
    return { success: true }
}

export async function deleteContact(id: string) {
    const res = await apiFetch(`/contacts/${id}`, {
        method: 'DELETE',
    })

    if (!res.ok) {
        return { success: false, error: await res.text() }
    }

    revalidatePath('/contacts')
    return { success: true }
}

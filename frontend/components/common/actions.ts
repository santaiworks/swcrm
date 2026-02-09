'use server'

import { apiFetch } from '@/lib/api'
import { revalidatePath } from 'next/cache'

// --- Attachments ---

export async function uploadAttachment(formData: FormData) {
    const entityType = formData.get('entity_type')
    const entityId = formData.get('entity_id')

    try {
        const res = await apiFetch('/attachments/upload', {
            method: 'POST',
            body: formData, // apiFetch will detect FormData and NOT set Content-Type
        })

        if (!res.ok) {
            const text = await res.text()
            throw new Error(text || 'Failed to upload attachment')
        }

        revalidatePath(`/leads/${entityId}`) // Revalidate Lead/Deal paths
        revalidatePath(`/deals/${entityId}`)
        return { success: true, data: await res.json() }
    } catch (error) {
        console.error("Upload Error:", error)
        return { success: false, error: 'Upload failed' }
    }
}

export async function deleteAttachment(id: string, entityId: string) {
    try {
        const res = await apiFetch(`/attachments/${id}`, {
            method: 'DELETE',
        })

        if (!res.ok) {
            throw new Error('Failed to delete attachment')
        }

        revalidatePath(`/leads/${entityId}`)
        revalidatePath(`/deals/${entityId}`)
        return { success: true }
    } catch (error) {
        console.error("Delete Error:", error)
        return { success: false, error: 'Delete failed' }
    }
}

export async function getAttachments(entityType: string, entityId: string) {
    // Server action to fetch? Or use Client component fetch? 
    // Usually fetching is done via server component prop drill or client fetch.
    // Server Action can be used too.
    try {
        const res = await apiFetch(`/attachments/${entityType}/${entityId}`)
        if (!res.ok) return []
        return await res.json()
    } catch (error) {
        return []
    }
}

// --- Emails ---

export async function sendEmail(data: any) {
    try {
        const res = await apiFetch('/emails/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            throw new Error('Failed to send email')
        }

        revalidatePath(`/dashboard/leads/${data.entity_id}`)
        revalidatePath(`/dashboard/deals/${data.entity_id}`)
        return { success: true, data: await res.json() }
    } catch (error) {
        console.error("Send Email Error:", error)
        return { success: false, error: 'Failed to send email' }
    }
}

export async function getEmails(entityType: string, entityId: string) {
    const res = await apiFetch(`/emails/${entityType}/${entityId}`)
    if (res.ok) {
        return res.json()
    }
    return []
}

export async function getOrganizations() {
    const res = await apiFetch('/organizations')
    if (res.ok) {
        return res.json()
    }
    return []
}

export async function getContacts() {
    const res = await apiFetch('/contacts')
    if (res.ok) {
        return res.json()
    }
    return []
}

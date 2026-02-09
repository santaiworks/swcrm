'use server'

import { revalidatePath } from 'next/cache'
import { createLeadSchema } from '@/lib/definitions'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function createLead(formData: FormData) {
    // Note: Authentication check removed temporarily as we migrate to Python backend.
    // In a real scenario, we would pass the auth token to the backend.

    const rawData = {
        salutation: formData.get('salutation')?.toString() || undefined,
        first_name: formData.get('first_name')?.toString(),
        last_name: formData.get('last_name')?.toString() || undefined,
        email: formData.get('email')?.toString() || undefined,
        mobile_no: formData.get('mobile_no')?.toString() || undefined,
        gender: formData.get('gender')?.toString() || undefined,
        job_title: formData.get('job_title')?.toString() || undefined,
        department: formData.get('department')?.toString() || undefined,
        organization: formData.get('organization')?.toString() || undefined,
        website: formData.get('website')?.toString() || undefined,
        no_employees: formData.get('no_employees')?.toString() || undefined,
        industry: formData.get('industry')?.toString() || undefined,
        status: formData.get('status')?.toString() || 'New',
        lead_owner: formData.get('lead_owner')?.toString() || undefined,
        source: formData.get('source')?.toString() || undefined,
    }

    // Validate using Zod
    const validatedFields = createLeadSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Lead.'
        }
    }

    const {
        salutation, first_name, last_name, email, mobile_no, gender,
        job_title, department, organization, website, no_employees,
        industry, status, source
    } = validatedFields.data

    const data = {
        salutation,
        first_name,
        last_name,
        email: email || null,
        mobile_no: mobile_no || null,
        gender,
        job_title,
        department,
        organization,
        website,
        no_employees,
        industry,
        status,
        source,
    }

    try {
        const { apiFetch } = await import('@/lib/api') // Dynamic import to avoid circular dep if any, or just import at top
        const res = await apiFetch('/leads', {
            method: 'POST',
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error('Error creating lead:', errorText)
            return { error: `Failed to create lead: ${errorText}` }
        }

        revalidatePath('/leads')
        return { success: true }
    } catch (error) {
        console.error('Error creating lead:', error)
        return { error: 'Failed to create lead. Backend might be down.' }
    }
}

export async function updateLeadStatus(lead_id: string, status: string) {
    try {
        const { apiFetch } = await import('@/lib/api')
        const res = await apiFetch(`/leads/${lead_id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error('Error updating status:', errorText)
            return { error: `Failed to update status: ${errorText}` }
        }

        revalidatePath(`/leads/${lead_id}`)
        revalidatePath('/leads')
        return { success: true }
    } catch (error) {
        console.error('Error updating status:', error)
        return { error: 'Failed to update status.' }
    }
}

export async function deleteLead(lead_id: string) {
    try {
        const { apiFetch } = await import('@/lib/api')
        const res = await apiFetch(`/leads/${lead_id}`, {
            method: 'DELETE'
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error('Error deleting lead:', errorText)
            return { error: `Failed to delete lead: ${errorText}` }
        }

        revalidatePath('/leads')
        return { success: true }
    } catch (error) {
        console.error('Error deleting lead:', error)
        return { error: 'Failed to delete lead.' }
    }
}

export async function updateLead(lead_id: string, data: any) {
    try {
        const { apiFetch } = await import('@/lib/api')
        const res = await apiFetch(`/leads/${lead_id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error('Error updating lead:', errorText)
            return { error: `Failed to update lead: ${errorText}` }
        }

        revalidatePath(`/leads/${lead_id}`)
        revalidatePath('/leads')
        return { success: true }
    } catch (error) {
        console.error('Error updating lead:', error)
        return { error: 'Failed to update lead.' }
    }
}

export async function convertLead(leadId: string, payload: any) {
    try {
        const { apiFetch } = await import('@/lib/api')
        const res = await apiFetch(`/leads/${leadId}/convert`, {
            method: 'POST',
            body: JSON.stringify(payload)
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            return { error: errorData.error || errorData.detail || 'Conversion failed' }
        }

        revalidatePath('/leads')
        revalidatePath(`/leads/${leadId}`)
        return { success: true }
    } catch (error) {
        console.error('Error converting lead:', error)
        return { error: 'Failed to convert lead.' }
    }
}



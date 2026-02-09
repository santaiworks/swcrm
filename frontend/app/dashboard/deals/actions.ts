'use server'

import { apiFetch } from '@/lib/api'
import { revalidatePath } from 'next/cache'

export async function createDeal(data: any) {
    try {
        // Map Deal fields to Lead fields
        const payload: any = { ...data }

        // Map 'name' to 'first_name' if present (fallback)
        if (data.name && !data.first_name) {
            payload.first_name = data.name
        }

        // Map 'amount' to 'estimated_revenue'
        if (data.amount !== undefined) {
            payload.estimated_revenue = data.amount
            delete payload.amount
        }

        // Map 'stage' to 'status'
        if (data.stage !== undefined) {
            payload.status = data.stage
            delete payload.stage
        }

        // Ensure status is set if missing
        if (!payload.status) {
            payload.status = 'Proposal' // Default deal stage
        }

        const res = await apiFetch('/leads', {
            method: 'POST',
            body: JSON.stringify(payload)
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error('Error creating deal (as lead):', errorText)
            return { error: `Failed to create deal: ${errorText}` }
        }

        revalidatePath('/deals')
        return { success: true }
    } catch (error) {
        console.error('Error creating deal:', error)
        return { error: 'Failed to create deal. Backend might be down.' }
    }
}

export async function updateDeal(id: string, data: any) {
    try {
        // Map Deal fields to Lead fields
        const payload: any = { ...data }

        if (data.amount !== undefined) {
            payload.estimated_revenue = data.amount
            delete payload.amount
        }

        if (data.stage !== undefined) {
            payload.status = data.stage
            delete payload.stage
        }

        if (data.name !== undefined) {
            payload.first_name = data.name
            delete payload.name
        }

        const res = await apiFetch(`/leads/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error('Error updating deal:', errorText)
            return { success: false, error: errorText }
        }

        revalidatePath('/deals')
        revalidatePath(`/deals/${id}`)
        return { success: true }
    } catch (error) {
        console.error('Error updating deal:', error)
        return { success: false, error: 'Failed' }
    }
}

export async function deleteDeal(id: string) {
    try {
        const res = await apiFetch(`/leads/${id}`, {
            method: 'DELETE',
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error('Error deleting deal:', errorText)
            return { success: false, error: errorText }
        }

        revalidatePath('/deals')
        return { success: true }
    } catch (error) {
        console.error('Error deleting deal:', error)
        return { success: false, error: 'Failed' }
    }
}

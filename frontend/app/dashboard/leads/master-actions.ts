'use server'

import { revalidatePath } from 'next/cache'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function searchMasterData(
    table: 'master_industries' | 'master_sources' | 'master_salutations' | 'master_employee_counts' | 'master_lead_status',
    query: string
) {
    try {
        const { apiFetch } = await import('@/lib/api')
        const res = await apiFetch(`/master-data/${table}?query=${encodeURIComponent(query)}`, {
            cache: 'no-store'
        })

        if (!res.ok) {
            console.error('Failed to fetch master data:', await res.text())
            return []
        }

        return await res.json()
    } catch (error) {
        console.error('Error fetching master data:', error)
        return []
    }
}

export async function createMasterData(
    table: 'master_industries' | 'master_sources' | 'master_salutations' | 'master_employee_counts' | 'master_lead_status',
    name: string
) {
    try {
        const { apiFetch } = await import('@/lib/api')
        const res = await apiFetch(`/master-data/${table}`, {
            method: 'POST',
            body: JSON.stringify({ name })
        })

        if (!res.ok) {
            return { error: 'Failed to create item' }
        }

        const data = await res.json()
        revalidatePath('/leads')
        return { data }
    } catch (error) {
        console.error('Error creating master data:', error)
        return { error: 'Failed to create item' }
    }
}

'use server'

import { apiFetch } from '@/lib/api'
import { revalidatePath } from 'next/cache'

export async function updateSettings(data: any) {
    try {
        const res = await apiFetch('/settings', {
            method: 'PUT',
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            throw new Error('Failed to update settings')
        }

        revalidatePath('/settings')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Update settings failed:', error)
        return { success: false, error: 'Failed to update settings' }
    }
}

export async function createUser(data: any) {
    try {
        const res = await apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            return { success: false, error: errorData.detail || 'Failed to create user' }
        }

        const user = await res.json()

        // Create associated employee record
        if (data.employee) {
            await apiFetch('/employees/', {
                method: 'POST',
                body: JSON.stringify({ ...data.employee, user_id: user.id }),
            })
        }

        revalidatePath('/settings')
        return { success: true, user }
    } catch (error) {
        console.error('Create user failed:', error)
        return { success: false, error: 'Failed to create user' }
    }
}

export async function updateUser(userId: number, data: any) {
    try {
        const res = await apiFetch(`/auth/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            return { success: false, error: errorData.detail || 'Failed to update user' }
        }

        // Update associated employee record
        if (data.employee) {
            await apiFetch(`/employees/${userId}`, {
                method: 'PUT',
                body: JSON.stringify(data.employee),
            })
        }

        revalidatePath('/settings')
        return { success: true }
    } catch (error) {
        console.error('Update user failed:', error)
        return { success: false, error: 'Failed to update user' }
    }
}

export async function deleteUser(userId: number) {
    try {
        const res = await apiFetch(`/auth/users/${userId}`, {
            method: 'DELETE',
        })

        if (!res.ok) {
            return { success: false, error: 'Failed to delete user' }
        }

        revalidatePath('/settings')
        return { success: true }
    } catch (error) {
        console.error('Delete user failed:', error)
        return { success: false, error: 'Failed to delete user' }
    }
}

export async function getEmployeeData(userId: number) {
    try {
        const res = await apiFetch(`/employees/${userId}`)
        if (!res.ok) return null
        return await res.json()
    } catch (error) {
        console.error('Fetch employee data failed:', error)
        return null
    }
}

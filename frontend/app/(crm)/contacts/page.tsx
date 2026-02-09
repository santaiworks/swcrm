import { apiFetch } from '@/lib/api'
import ContactsClient from '../../dashboard/contacts/client'

async function getContacts() {
    try {
        const res = await apiFetch('/contacts')
        if (!res.ok) return []
        return await res.json()
    } catch (error) {
        console.error('Failed to fetch contacts:', error)
        return []
    }
}

export default async function ContactsPage() {
    const contacts = await getContacts()
    return <ContactsClient contacts={contacts} />
}

import { apiFetch } from '@/lib/api'
import NotesClient from '../../dashboard/notes/client'

async function getNotes() {
  try {
    const res = await apiFetch('/notes/')
    if (!res.ok) return []
    return await res.json()
  } catch (error) {
    console.error('Failed to fetch notes:', error)
    return []
  }
}

export default async function NotesPage() {
  const notes = await getNotes()
  return <NotesClient notes={notes} />
}

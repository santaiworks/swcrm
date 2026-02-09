import { apiFetch } from '@/lib/api'
import OrganizationsClient from '../../dashboard/organizations/client'

async function getOrganizations() {
  try {
    const res = await apiFetch('/organizations/')
    if (!res.ok) return []
    return await res.json()
  } catch (error) {
    console.error('Failed to fetch organizations:', error)
    return []
  }
}

export default async function OrganizationsPage() {
  const organizations = await getOrganizations()
  return <OrganizationsClient organizations={organizations} />
}

import { redirect } from 'next/navigation'

export default function LeadDetailPage({ params }: { params: { id: string } }) {
    const { id } = params
    redirect(`/leads/${id}`)
}

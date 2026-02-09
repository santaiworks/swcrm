import { redirect } from 'next/navigation'

export default function DealDetailPage({ params }: { params: { id: string } }) {
    const { id } = params
    redirect(`/deals/${id}`)
}

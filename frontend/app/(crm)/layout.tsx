import { SidebarNav } from '@/components/dashboard/sidebar-nav'
import { MobileNav } from '@/components/dashboard/mobile-nav'
import { getUserOrRedirect, getUserProfile } from '@/lib/data/user'
import { redirect } from 'next/navigation'

export default async function CrmLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getUserOrRedirect()
    const profile = await getUserProfile()

    if (!profile) {
        redirect('/onboarding')
    }

    return (
        <div className="flex min-h-screen">
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <MobileNav user={profile} />
                <div className="flex flex-1 overflow-hidden">
                    <aside className="hidden md:flex bg-sidebar text-sidebar-foreground border-r border-sidebar-border overflow-y-auto z-40">
                        <SidebarNav user={profile} collapsible className="min-h-full" />
                    </aside>
                    <main className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}

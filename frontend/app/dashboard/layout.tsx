
import { SidebarNav } from '@/components/dashboard/sidebar-nav'
import { MobileNav } from '@/components/dashboard/mobile-nav'
import { getUserOrRedirect, getUserProfile } from '@/lib/data/user'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
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


            {/* Main Content Area */}
            {/* Added margin-left to offset fixed sidebar default width (handled inside SidebarNav state or wrapper, but for now assuming start open) */}
            {/* We will rely on SidebarNav to handle its own width, but the main content needs margin. 
                Since SidebarNav is client component with state, we might need a context or just use a safe default margin 
                and let the user toggle. 
                
                Actually, simpler approach for "Fixed Sidebar": 
                The sidebar is fixed. The main content has margin-left. 
                If sidebar is collapsible, margin-left needs to change.
                
                To keep it simple and robust without global state context for now:
                We'll make the sidebar sticky (really existing solution was fine if h-screen was set correctly), 
                BUT user asked for "fixed, scroll right only".
                So `h-screen overflow-hidden` on container. 
                Sidebar `overflow-y-auto`. 
                Main `overflow-y-auto`.
            */}

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <MobileNav user={profile} />

                <div className="flex flex-1 overflow-hidden">
                    {/* sidebar placeholder for desktop flow if using relative, but we want Fixed logic.
                        Let's try the "Grid" or "Flex" approach where sidebar is separate scroll area.
                     */}

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

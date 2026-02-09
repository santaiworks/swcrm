'use client'

import { useState } from 'react'
import { SidebarNav } from '@/components/dashboard/sidebar-nav'
import { Menu, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface MobileNavProps {
    user: any
}

export function MobileNav({ user }: MobileNavProps) {
    const [open, setOpen] = useState(false)

    return (
        <header className="sticky top-0 z-40 bg-white border-b h-16 flex items-center justify-between px-4 md:hidden">

            {/* Left: Hamburger Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-600">
                        <Menu className="w-6 h-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[260px] bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
                    <SidebarNav user={user} className="h-full" />
                </SheetContent>
            </Sheet>

            {/* Right: Bell & Avatar */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                    <Bell className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 bg-green-500 text-white font-bold">
                        <AvatarFallback className="bg-green-500 text-white">
                            {user?.full_name?.[0] || 'U'}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    )
}

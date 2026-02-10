
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    LayoutDashboard,
    Users,
    Building2,
    Contact,
    Briefcase,
    CheckSquare,
    Settings,
    ChevronDown,
    LogOut,
    UserCircle,
    BookOpen,
    Phone,
    ShieldCheck,
    Bell,
    ChevronLeft,
    ChevronRight,
    Zap,
    Clock,
    LayoutGrid,
    ChevronsRight
} from 'lucide-react'
import { signout } from '@/app/login/actions'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    user: any
    collapsible?: boolean
}

export function SidebarNav({ className, user, collapsible = false, ...props }: SidebarNavProps) {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    // Safety check: if rendered in mobile sheet (where collapsible prop might be false/undefined implied), keep expanded.
    // However, the prop passed from layout is `collapsible` (true for desktop).

    const items = [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { title: 'Leads', href: '/leads', icon: Users },
        { title: 'Opportunities', href: '/opportunities', icon: Zap },
        { title: 'Deals', href: '/deals', icon: Briefcase },

        { title: 'Contacts', href: '/contacts', icon: Contact },
        { title: 'Organizations', href: '/organizations', icon: Building2 },
        { title: 'Notes', href: '/notes', icon: BookOpen },
        { title: 'Tasks', href: '/tasks', icon: CheckSquare },
        { title: 'Calls', href: '/calls', icon: Phone },
        { title: 'Settings', href: '/settings', icon: Settings },
    ]

    return (
        <TooltipProvider>
            <nav
                className={cn(
                    'flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 overflow-hidden',
                    isCollapsed ? 'w-[80px]' : 'w-[260px]',
                    className
                )}
                {...props}
            >
                <div className={cn("p-4 space-y-2", isCollapsed ? "px-2" : "")}>
                    {/* User Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className={cn(
                                "flex items-center gap-3 p-3 rounded-lg bg-pink-600/10 hover:bg-pink-600/20 cursor-pointer transition-colors border border-pink-600/20",
                                isCollapsed ? "justify-center p-2" : ""
                            )}>
                                <div className="w-8 h-8 rounded bg-pink-600 flex items-center justify-center text-white font-bold shrink-0">
                                    {user?.role === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <UserCircle className="w-5 h-5" />}
                                </div>
                                {!isCollapsed && (
                                    <>
                                        <div className="flex-1 overflow-hidden text-left">
                                            <p className="text-sm font-bold text-white truncate">CRM</p>
                                            <p className="text-xs text-sidebar-foreground/70 truncate capitalize">{user?.role || 'Administrator'}</p>
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-sidebar-foreground/50 shrink-0" />
                                    </>
                                )}
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start" side={isCollapsed ? "right" : "bottom"} sideOffset={12}>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/settings" className="flex items-center w-full">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <UserCircle className="mr-2 h-4 w-4" />
                                <span>Change Password</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={async () => {
                                await signout()
                            }}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Notifications Button */}
                    {!isCollapsed && (
                        <Button variant="outline" className="w-full justify-start bg-transparent border-sidebar-border/50 text-sidebar-foreground hover:bg-sidebar-primary/10 hover:text-white">
                            <Bell className="mr-3 h-4 w-4" />
                            Notifications
                        </Button>
                    )}
                    {isCollapsed && (
                        <div className="flex justify-center">
                            <Button variant="ghost" size="icon" className="text-sidebar-foreground/50 hover:text-white">
                                <Bell className="w-5 h-5" />
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar mt-2">
                    {items.map((item) => {
                        const isActive = item.href === '/dashboard'
                            ? pathname === item.href
                            : pathname?.startsWith(item.href)
                        return (
                            isCollapsed ? (
                                <Tooltip key={item.href} delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                'w-full justify-center relative overflow-hidden h-10 px-0',
                                                'text-sidebar-foreground/70 hover:text-white hover:bg-white/5',
                                                isActive && 'bg-sidebar-primary text-white hover:bg-sidebar-primary hover:text-white shadow-sm'
                                            )}
                                            asChild
                                        >
                                            <Link href={item.href}>
                                                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-sidebar-foreground/50")} />
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        {item.title}
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <Button
                                    key={item.href}
                                    variant="ghost"
                                    className={cn(
                                        'w-full justify-start relative overflow-hidden',
                                        'text-sidebar-foreground/70 hover:text-white hover:bg-white/5',
                                        isActive && 'bg-sidebar-primary text-white font-medium hover:bg-sidebar-primary hover:text-white shadow-sm'
                                    )}
                                    asChild
                                >
                                    <Link href={item.href}>
                                        <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-sidebar-foreground/50")} />
                                        {item.title}
                                    </Link>
                                </Button>
                            )
                        )
                    })}
                </div>

                {/* Cleaned Footer: No Widgets, just Collapse Toggle */}
                {collapsible && (
                    <div className="p-4 border-t border-sidebar-border/50 flex justify-end">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-sidebar-foreground/50 hover:text-white hover:bg-white/5"
                        >
                            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                        </Button>
                    </div>
                )}
            </nav>
        </TooltipProvider>
    )
}

function DatabaseIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
    )
}

function Calculator(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="16" height="20" x="4" y="2" rx="2" />
            <line x1="8" x2="16" y1="6" y2="6" />
            <line x1="16" x2="16" y1="14" y2="18" />
            <path d="M16 10h.01" />
            <path d="M12 10h.01" />
            <path d="M8 10h.01" />
            <path d="M12 14h.01" />
            <path d="M8 14h.01" />
            <path d="M12 18h.01" />
            <path d="M8 18h.01" />
        </svg>
    )
}

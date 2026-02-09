import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value
    const isAuthPage = request.nextUrl.pathname.startsWith('/login')
    const isProtectedModule =
        request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/leads') ||
        request.nextUrl.pathname.startsWith('/deals') ||
        request.nextUrl.pathname.startsWith('/contacts') ||
        request.nextUrl.pathname.startsWith('/organizations') ||
        request.nextUrl.pathname.startsWith('/notes') ||
        request.nextUrl.pathname.startsWith('/tasks') ||
        request.nextUrl.pathname.startsWith('/calls')

    if (isProtectedModule && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

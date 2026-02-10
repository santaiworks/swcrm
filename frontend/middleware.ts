import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value
    const refreshToken = request.cookies.get('refresh_token')?.value
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
        if (refreshToken) {
            // Attempt transparent refresh
            try {
                const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
                const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh_token: refreshToken })
                })

                if (refreshRes.ok) {
                    const data = await refreshRes.json()
                    const res = NextResponse.next()

                    // Helper to parse JWT
                    const parseJwt = (t: string) => {
                        try { return JSON.parse(Buffer.from(t.split('.')[1], 'base64').toString()); }
                        catch { return null; }
                    }

                    const payload = parseJwt(data.refresh_token)
                    const remember = payload?.remember_me === true

                    res.cookies.set('access_token', data.access_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 60 * 60,
                        path: '/',
                    })

                    const refreshMaxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7
                    res.cookies.set('refresh_token', data.refresh_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: refreshMaxAge,
                        path: '/',
                    })

                    return res
                }
            } catch (e) {
                console.error('Middleware refresh failed', e)
            }
        }
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isAuthPage && (token || refreshToken)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

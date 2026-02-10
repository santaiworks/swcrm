import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

function parseJwt(token: string) {
    try {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    } catch {
        return null;
    }
}

export async function POST() {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refresh_token')?.value

    if (!refreshToken) {
        return NextResponse.json({ error: 'No refresh token' }, { status: 401 })
    }

    try {
        const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken })
        })

        if (!response.ok) {
            return NextResponse.json({ error: 'Refresh failed' }, { status: 401 })
        }

        const data = await response.json()
        const newAccessToken = data.access_token
        const newRefreshToken = data.refresh_token

        const payload = parseJwt(newRefreshToken)
        const remember = payload?.remember_me === true

        const res = NextResponse.json({ success: true, access_token: newAccessToken })

        // Set cookies on the response object for client-side persistence
        res.cookies.set('access_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60,
            path: '/',
        })

        const refreshMaxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7
        res.cookies.set('refresh_token', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: refreshMaxAge,
            path: '/',
        })

        return res
    } catch (error) {
        console.error('API Refresh Route Error:', error)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}

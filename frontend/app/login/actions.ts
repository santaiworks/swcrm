'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { loginSchema, signupSchema } from '@/lib/definitions'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function login(formData: FormData) {
    // Extract data
    const rawData = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    // Validate with Zod
    const validatedFields = loginSchema.safeParse(rawData)

    if (!validatedFields.success) {
        const error = validatedFields.error.flatten().fieldErrors
        const errorMessage = Object.values(error).flat()[0] || 'Invalid input'
        redirect(`/login?message=${encodeURIComponent(errorMessage)}`)
    }

    const { email, password } = validatedFields.data
    const remember = formData.get('remember') === 'on'

    try {
        const response = await fetch(`${API_URL}/auth/login?remember_me=${remember}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'username': email,
                'password': password,
            }),
        })

        if (!response.ok) {
            const data = await response.json().catch(() => ({}))
            console.error('Login failed:', data)
            redirect('/login?message=Invalid credentials')
        }

        const data = await response.json()
        const token = data.access_token
        const refreshToken = data.refresh_token

        // Set cookie
        const cookieStore = await cookies()

        // Access Token: match backend's 60 mins
        cookieStore.set('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60,
            path: '/',
        })

        // Refresh Token: 7 days or 30 days based on remember me
        const refreshMaxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7

        cookieStore.set('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: refreshMaxAge,
            path: '/',
        })


    } catch (error) {
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            throw error
        }
        console.error('Login error:', error)
        redirect('/login?message=Something went wrong')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const rawData = {
        email: formData.get('email'),
        password: formData.get('password'),
        full_name: formData.get('full_name'),
    }

    const validatedFields = signupSchema.safeParse(rawData)

    if (!validatedFields.success) {
        const error = validatedFields.error.flatten().fieldErrors
        const errorMessage = Object.values(error).flat()[0] || 'Invalid input'
        redirect(`/login?message=${encodeURIComponent(errorMessage)}`)
    }

    const { email, password, full_name } = validatedFields.data

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                full_name,
            }),
        })

        if (!response.ok) {
            const data = await response.json()
            const msg = data.detail || 'Registration failed'
            redirect(`/login?message=${encodeURIComponent(msg)}`)
        }

        // Optional: Auto login after register
        // For now, redirect to login
        redirect('/login?message=Account created! Please log in.')

    } catch (error) {
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            throw error
        }
        console.error('Signup error:', error)
        redirect('/login?message=Something went wrong')
    }
}

export async function signout() {
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')
    redirect('/login')
}

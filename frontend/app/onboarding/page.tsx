import { getUserOrRedirect } from '@/lib/data/user'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { signout } from '@/app/login/actions'

export default async function OnboardingPage() {
    const user = await getUserOrRedirect()

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>Account Pending Setup</CardTitle>
                    <CardDescription>
                        Welcome, {user.email}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Your account has been created but not yet assigned a <strong>Role</strong> or <strong>Branch</strong>.
                    </p>
                    <div className="rounded-md bg-yellow-50 p-4 text-left text-sm text-yellow-800 border border-yellow-200">
                        <p className="font-semibold mb-1">Developer Action Required:</p>
                        <p>Go to your Database and update the `users` table.</p>
                        <p className="mt-2">Update user with ID <code>{user.id}</code>:</p>
                        <ul className="list-disc list-inside mt-1 ml-1 space-y-1">
                            <li>Set <strong>is_superuser</strong> to <code>true</code> (for Admin)</li>
                            <li>Or implement Role/Branch logic in backend.</li>
                        </ul>
                        <p className="mt-2">Then refresh this page.</p>
                    </div>
                    <form action={signout}>
                        <Button variant="outline" type="submit">Sign Out</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

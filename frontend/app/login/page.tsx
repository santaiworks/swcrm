
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LoginPage(props: {
    searchParams: Promise<{ message: string }>
}) {
    const searchParams = await props.searchParams
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">SantaiCRM Login</CardTitle>
                    <CardDescription>Enter your credentials to access the CRM.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required placeholder="m@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>

                        {/* Remember Me checkbox */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label
                                htmlFor="remember"
                                className="text-sm font-medium leading-none"
                            >
                                Remember me
                            </label>
                        </div>

                        {searchParams?.message && (
                            <p className="text-sm text-red-500 text-center bg-red-50 p-2 rounded">
                                {searchParams.message}
                            </p>
                        )}

                        <div className="flex flex-col gap-2 pt-2">
                            <Button formAction={login} className="w-full">Sign In</Button>
                            <Button formAction={signup} variant="outline" className="w-full">Sign Up (Dev Only)</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

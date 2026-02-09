import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralSettingsForm } from "@/components/settings/general-settings-form"
import { UserManagementTable } from "@/components/settings/user-management-table"
import { apiFetch } from "@/lib/api"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Settings",
    description: "Manage application settings and users.",
}

async function getSettings() {
    try {
        const res = await apiFetch("/settings")
        if (!res.ok) return null
        return await res.json()
    } catch (error) {
        console.error("Failed to fetch settings:", error)
        return null
    }
}

async function getUsers() {
    try {
        const res = await apiFetch("/auth/users")
        if (!res.ok) return []
        return await res.json()
    } catch (error) {
        console.error("Failed to fetch users:", error)
        return []
    }
}

export default async function SettingsPage() {
    const settingsData = getSettings()
    const usersData = getUsers()

    const [settings, users] = await Promise.all([settingsData, usersData])

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your application preferences and team members.</p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="users">User Management</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4">
                    <GeneralSettingsForm initialData={settings} />
                </TabsContent>
                <TabsContent value="users" className="space-y-4">
                    <UserManagementTable users={users} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

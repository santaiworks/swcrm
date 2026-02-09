'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { createUser, updateUser, getEmployeeData } from '@/app/(crm)/settings/actions'

interface UserFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user?: any // If present, it's Edit mode
}

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const isEdit = !!user

    // Form state
    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [password, setPassword] = useState('')
    const [isSuperuser, setIsSuperuser] = useState('false')

    // Employee state
    const [nik, setNik] = useState('')
    const [phone, setPhone] = useState('')
    const [department, setDepartment] = useState('')
    const [position, setPosition] = useState('')
    const [joinDate, setJoinDate] = useState('')

    useEffect(() => {
        if (open) {
            if (user) {
                setEmail(user.email || '')
                setFullName(user.full_name || '')
                setIsSuperuser(user.is_superuser ? 'true' : 'false')
                setPassword('') // Don't show password on edit

                // Fetch employee data
                getEmployeeData(user.id).then(emp => {
                    if (emp) {
                        setNik(emp.nik || '')
                        setPhone(emp.phone || '')
                        setDepartment(emp.department || '')
                        setPosition(emp.position || '')
                        setJoinDate(emp.join_date || '')
                    } else {
                        setNik('')
                        setPhone('')
                        setDepartment('')
                        setPosition('')
                        setJoinDate('')
                    }
                })
            } else {
                // Clear form for new user
                setEmail('')
                setFullName('')
                setPassword('')
                setIsSuperuser('false')
                setNik('')
                setPhone('')
                setDepartment('')
                setPosition('')
                setJoinDate('')
            }
        }
    }, [open, user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const payload = {
            email,
            full_name: fullName,
            is_superuser: isSuperuser === 'true',
            ...(password ? { password } : {}),
            employee: {
                nik,
                phone,
                department,
                position,
                join_date: joinDate || null
            }
        }

        try {
            let res
            if (isEdit) {
                res = await updateUser(user.id, payload)
            } else {
                if (!password) {
                    toast.error('Password is required for new users')
                    setIsLoading(false)
                    return
                }
                res = await createUser(payload)
            }

            if (res.success) {
                toast.success(isEdit ? 'User updated successfully' : 'User created successfully')
                onOpenChange(false)
            } else {
                toast.error(res.error || 'Failed to save user')
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isEdit}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">{isEdit ? 'New Password (optional)' : 'Password'}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required={!isEdit}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Full Name</Label>
                                <Input
                                    id="full_name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={isSuperuser} onValueChange={setIsSuperuser}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="false">User (Sales)</SelectItem>
                                        <SelectItem value="true">Administrator</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100" />
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Employee Information</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nik">NIK (Employee ID)</Label>
                                <Input
                                    id="nik"
                                    value={nik}
                                    onChange={(e) => setNik(e.target.value)}
                                    placeholder="e.g. SLW-001"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Input
                                    id="department"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position">Position</Label>
                                <Input
                                    id="position"
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="join_date">Join Date</Label>
                            <Input
                                id="join_date"
                                type="date"
                                value={joinDate}
                                onChange={(e) => setJoinDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : (isEdit ? 'Update User' : 'Create User')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

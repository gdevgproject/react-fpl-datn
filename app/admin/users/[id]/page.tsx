'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorMessage } from '@/components/ui/error-message'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import type { User } from '@/lib/mockData'
import { changeUserPassword, fetchUser, updateUser } from '@/lib/mockData'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function UserDetailsPage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedUser = await fetchUser(params.id)
      if (fetchedUser) {
        setUser(fetchedUser)
      } else {
        setError('User not found')
      }
    } catch (err) {
      setError('Failed to fetch user. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: User['status']) => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      const updatedUser = await updateUser(user.id, { status: newStatus })
      if (updatedUser) {
        setUser(updatedUser)
        toast({
          title: 'User status updated',
          description: `User status changed to ${newStatus}.`
        })
      }
    } catch (err) {
      setError('Failed to update user status. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!user || !newPassword) return
    setIsLoading(true)
    setError(null)
    try {
      await changeUserPassword(user.id, newPassword)
      toast({
        title: 'Password changed',
        description: "The user's password has been successfully changed."
      })
      setNewPassword('')
    } catch (err) {
      setError('Failed to change user password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!user) return null

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>User Details</h1>
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div>
              <strong>ID:</strong> {user.id}
            </div>
            <div>
              <strong>Name:</strong> {user.name}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Role:</strong> {user.role}
            </div>
            <div>
              <strong>Status:</strong>{' '}
              <Badge
                variant={user.status === 'active' ? 'success' : 'secondary'}
              >
                {user.status}
              </Badge>
            </div>
            <div>
              <strong>Phone:</strong> {user.phone}
            </div>
            <div>
              <strong>Registered At:</strong>{' '}
              {new Date(user.registeredAt).toLocaleString()}
            </div>
          </div>
          <div className='mt-4'>
            <Select value={user.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder='Update Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='inactive'>Inactive</SelectItem>
                <SelectItem value='blocked'>Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className='text-lg font-semibold mb-2'>Default Address</h3>
          <div>{user.defaultAddress.street}</div>
          <div>
            {user.defaultAddress.city}, {user.defaultAddress.state}{' '}
            {user.defaultAddress.zipCode}
          </div>
          <div>{user.defaultAddress.country}</div>
          {user.addresses.length > 0 && (
            <>
              <h3 className='text-lg font-semibold mt-4 mb-2'>
                Additional Addresses
              </h3>
              {user.addresses.map((address, index) => (
                <div key={address.id} className='mb-2'>
                  <div>
                    <strong>Address {index + 1}</strong>
                  </div>
                  <div>{address.street}</div>
                  <div>
                    {address.city}, {address.state} {address.zipCode}
                  </div>
                  <div>{address.country}</div>
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <strong>Total Orders:</strong> {user.totalOrders}
          </div>
          <div>
            <strong>Total Spent:</strong> ${user.totalSpent.toFixed(2)}
          </div>
        </CardContent>
      </Card>
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center space-x-2'>
            <Label htmlFor='new-password'>New Password</Label>
            <Input
              id='new-password'
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button onClick={handlePasswordChange} disabled={!newPassword}>
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
      <Button onClick={() => router.push('/admin/users')} className='mt-6'>
        Back to Users
      </Button>
    </div>
  )
}

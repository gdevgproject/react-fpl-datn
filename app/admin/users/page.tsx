'use client'

import { ActionMenu } from '@/components/ui/action-menu'
import { Badge } from '@/components/ui/badge'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { ErrorMessage } from '@/components/ui/error-message'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'
import type { User } from '@/lib/mockData'
import { deleteUser, fetchUsers, updateUser } from '@/lib/mockData'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const router = useRouter()

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    userId: string | null
  }>({
    isOpen: false,
    userId: null
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedUsers = await fetchUsers()
      setUsers(fetchedUsers)
    } catch (err) {
      setError('Failed to fetch users. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (
    userId: string,
    newStatus: User['status']
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedUser = await updateUser(userId, { status: newStatus })
      if (updatedUser) {
        setUsers(users.map((user) => (user.id === userId ? updatedUser : user)))
        toast({
          title: 'User status updated',
          description: `User ${userId} status changed to ${newStatus}.`
        })
      }
    } catch (err) {
      setError('Failed to update user status. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = (userId: string) => {
    setDeleteConfirmation({ isOpen: true, userId })
  }

  const confirmDelete = async () => {
    if (deleteConfirmation.userId) {
      setIsLoading(true)
      setError(null)
      try {
        await deleteUser(deleteConfirmation.userId)
        setUsers(users.filter((user) => user.id !== deleteConfirmation.userId))
        toast({
          title: 'User deleted',
          description: 'The user has been successfully deleted.'
        })
      } catch (err) {
        setError('Failed to delete user. Please try again.')
      } finally {
        setIsLoading(false)
        setDeleteConfirmation({ isOpen: false, userId: null })
      }
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>Users</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id.substring(0, 8)}...</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge
                  variant={user.status === 'active' ? 'success' : 'secondary'}
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                <ActionMenu
                  id={user.id}
                  onView={() => router.push(`/admin/users/${user.id}`)}
                  onDelete={() => handleDeleteUser(user.id)}
                  onBlock={() => handleStatusChange(user.id, 'blocked')}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, userId: null })}
        onConfirm={confirmDelete}
        title='Delete User'
        description='Are you sure you want to delete this user? This action cannot be undone.'
      />
    </div>
  )
}

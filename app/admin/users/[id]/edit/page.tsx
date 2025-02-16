'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useState } from 'react'

export default function EditUserPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    status: 'Active'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the user update logic (check lại)
    console.log('User updated:', user)
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mb-6'>Edit User</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor='status'>Status</Label>
          <Select
            value={user.status}
            onValueChange={(value) => setUser({ ...user, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Active'>Active</SelectItem>
              <SelectItem value='Pending'>Pending</SelectItem>
              <SelectItem value='Inactive'>Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type='submit'>Update User</Button>
      </form>
    </div>
  )
}

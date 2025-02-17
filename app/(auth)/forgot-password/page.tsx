'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { ErrorMessage } from '@/components/ui/error-message'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const supabase = createClientComponentClient() // Khởi tạo client Supabase
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Gọi Supabase API để gửi email reset mật khẩu
      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) {
        setError(error.message)
      } else {
        toast({
          title: 'Password reset email sent',
          description: 'Check your email for further instructions.'
        })
        setEmail('')
      }
    } catch (err) {
      setError('Password reset failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <ErrorMessage message={error} />}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className='text-sm text-center w-full'>
            Remember your password?{' '}
            <Link href='/login' className='text-blue-500 hover:underline'>
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

// export const metadata = {
//   title: 'Forgot Password'
// }

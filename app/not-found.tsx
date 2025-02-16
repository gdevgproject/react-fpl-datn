import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <h1 className='text-4xl font-bold mb-4'>404 - Page Not Found</h1>
      <p className='text-xl mb-8'>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link href='/'>Go Back Home</Link>
      </Button>
    </div>
  )
}

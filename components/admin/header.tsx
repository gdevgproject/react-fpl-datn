import { Button } from '@/components/ui/button'
import { Bell, LogOut } from 'lucide-react'

interface HeaderProps {
  onLogout: () => void
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <header className='flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200'>
      <h1 className='text-2xl font-semibold text-gray-800'>Dashboard</h1>
      <div className='flex items-center'>
        <Button variant='ghost' size='icon' className='mr-2'>
          <Bell className='h-5 w-5' />
        </Button>
        <Button variant='ghost' size='icon' onClick={onLogout}>
          <LogOut className='h-5 w-5' />
        </Button>
      </div>
    </header>
  )
}

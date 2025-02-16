'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ErrorMessage } from '@/components/ui/error-message'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'
import type { Order } from '@/lib/mockData'
import { fetchOrders, updateOrderStatus } from '@/lib/mockData'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>(
    'all'
  )

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter((order) => order.status === statusFilter))
    }
  }, [orders, statusFilter])

  const loadOrders = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedOrders = await fetchOrders()
      setOrders(fetchedOrders)
    } catch (err) {
      setError('Failed to fetch orders. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order['status']
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus)
      setOrders(
        orders.map((order) => (order.id === orderId ? updatedOrder : order))
      )
      toast({
        title: 'Order status updated',
        description: `Order ${orderId} status changed to ${newStatus}.`
      })
    } catch (err) {
      setError('Failed to update order status. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>Orders</h1>
      <div className='mb-4'>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as Order['status'] | 'all')
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Filter by status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            <SelectItem value='pending'>Pending</SelectItem>
            <SelectItem value='processing'>Processing</SelectItem>
            <SelectItem value='shipped'>Shipped</SelectItem>
            <SelectItem value='delivered'>Delivered</SelectItem>
            <SelectItem value='cancelled'>Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.userId}</TableCell>
              <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.status === 'delivered'
                      ? 'success'
                      : order.status === 'cancelled'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
                <Button asChild variant='outline' size='sm' className='mr-2'>
                  <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                </Button>
                <Select
                  value={order.status}
                  onValueChange={(value) =>
                    handleStatusChange(order.id, value as Order['status'])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Update Status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='pending'>Pending</SelectItem>
                    <SelectItem value='processing'>Processing</SelectItem>
                    <SelectItem value='shipped'>Shipped</SelectItem>
                    <SelectItem value='delivered'>Delivered</SelectItem>
                    <SelectItem value='cancelled'>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

'use client'

import { OrderChart } from '@/components/admin/OrderChart'
import { OrderStatistics } from '@/components/admin/OrderStatistics'
import { RecentOrders } from '@/components/admin/RecentOrders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorMessage } from '@/components/ui/error-message'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import type { Order } from '@/lib/mockData'
import { fetchOrders } from '@/lib/mockData'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const fetchedOrders = await fetchOrders()
        setOrders(fetchedOrders)
      } catch (err) {
        setError('Failed to fetch orders. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [])

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  const totalOrders = orders.length
  const newOrders = orders.filter(
    (order) =>
      new Date(order.createdAt).toDateString() === new Date().toDateString()
  ).length
  const pendingOrders = orders.filter(
    (order) => order.status === 'pending'
  ).length
  const shippingOrders = orders.filter(
    (order) => order.status === 'shipped'
  ).length
  const completedOrders = orders.filter(
    (order) => order.status === 'delivered'
  ).length
  const cancelledOrders = orders.filter(
    (order) => order.status === 'cancelled'
  ).length

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d
  }).reverse()

  const chartData = last7Days.map((date) => ({
    date: date.toLocaleDateString(),
    orders: orders.filter(
      (order) =>
        new Date(order.createdAt).toDateString() === date.toDateString()
    ).length
  }))

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)

  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold'>Dashboard</h2>

      <OrderStatistics
        totalOrders={totalOrders}
        newOrders={newOrders}
        pendingOrders={pendingOrders}
        shippingOrders={shippingOrders}
        completedOrders={completedOrders}
        cancelledOrders={cancelledOrders}
      />

      <OrderChart data={chartData} />

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOrders orders={recentOrders} />
        </CardContent>
      </Card>
    </div>
  )
}

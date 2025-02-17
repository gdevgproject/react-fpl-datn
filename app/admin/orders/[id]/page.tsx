"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ErrorMessage } from "@/components/ui/error-message"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { fetchOrder, updateOrderStatus, fetchProduct } from "@/lib/mockData"
import type { Order, Product } from "@/lib/mockData"
import { toast } from "@/components/ui/use-toast"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrder()
  }, [])

  const loadOrder = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedOrder = await fetchOrder(params.id)
      if (fetchedOrder) {
        setOrder(fetchedOrder)
        const productPromises = fetchedOrder.products.map((item) => fetchProduct(item.productId))
        const fetchedProducts = await Promise.all(productPromises)
        setProducts(fetchedProducts.filter((p): p is Product => p !== undefined))
      } else {
        setError("Order not found")
      }
    } catch (err) {
      setError("Failed to fetch order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: Order["status"]) => {
    if (!order) return
    setIsLoading(true)
    setError(null)
    try {
      const updatedOrder = await updateOrderStatus(order.id, newStatus)
      setOrder(updatedOrder)
      toast({
        title: "Order status updated",
        description: `Order status changed to ${newStatus}.`,
      })
    } catch (err) {
      setError("Failed to update order status. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!order) return null

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div><strong>Order ID:</strong> {order.id}</div>
            <div><strong>User ID:</strong> {order.userId}</div>
            <div><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</div>
            <div>
              <strong>Status:</strong>{" "}
              <Badge variant={order.status === "delivered" ? "success" : "secondary"}>{order.status}</Badge>
            </div>
            <div><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</div>
            <div><strong>Updated At:</strong> {new Date(order.updatedAt).toLocaleString()}</div>
          </div>
          <div className="mt-4">
            <Select value={order.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.products.map((item) => {
                const product = products.find((p) => p.id === item.productId)
                return (
                  <TableRow key={item.productId}>
                    <TableCell>{product ? product.name : "Unknown Product"}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${product ? product.price.toFixed(2) : "N/A"}</TableCell>
                    <TableCell>${product ? (product.price * item.quantity).toFixed(2) : "N/A"}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Button onClick={() => router.push("/admin/orders")} className="mt-6">
        Back to Orders
      </Button>
    </div>
  )
}


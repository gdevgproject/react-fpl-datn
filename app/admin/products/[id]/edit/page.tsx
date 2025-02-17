"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ErrorMessage } from "@/components/ui/error-message"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { type Product, fetchProduct, updateProduct } from "@/lib/mockData"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const fetchedProduct = await fetchProduct(params.id)
        if (fetchedProduct) {
          setProduct(fetchedProduct)
        } else {
          setError("Product not found")
        }
      } catch (err) {
        setError("Failed to fetch product. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  const handleChange = (key: keyof Product, value: string | number) => {
    if (product) {
      setProduct({ ...product, [key]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setIsSaving(true)
    setError(null)
    try {
      await updateProduct(product.id, product)
      router.push("/admin/products")
    } catch (err) {
      setError("Failed to save product. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (!product) return <ErrorMessage message="Product not found" />

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={product.name} onChange={(e) => handleChange("name", e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={product.price}
            onChange={(e) => handleChange("price", Number.parseFloat(e.target.value))}
            required
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={product.stock}
            onChange={(e) => handleChange("stock", Number.parseInt(e.target.value))}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={product.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Clothing">Clothing</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  )
}


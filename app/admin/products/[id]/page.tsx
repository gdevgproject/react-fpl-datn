'use client'

import type React from 'react'

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
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import type { Product } from '@/lib/mockData'
import { fetchProduct, updateProduct } from '@/lib/mockData'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EditProductPage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const fetchedProduct = await fetchProduct(params.id)
        if (fetchedProduct) {
          setProduct(fetchedProduct)
        } else {
          setError('Product not found')
        }
      } catch (err) {
        setError('Failed to fetch product. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  const handleChange = (
    key: keyof Product,
    value: string | number | File[]
  ) => {
    if (product) {
      setProduct({ ...product, [key]: value })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && product) {
      setProduct({
        ...product,
        images: Array.from(e.target.files).map((file) =>
          URL.createObjectURL(file)
        )
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setIsSaving(true)
    setError(null)
    try {
      await updateProduct(product.id, product)
      toast({
        title: 'Product updated',
        description: 'The product has been successfully updated.'
      })
      router.push('/admin/products')
    } catch (err) {
      setError('Failed to update product. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!product) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              value={product.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={product.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor='price'>Price</Label>
            <Input
              id='price'
              type='number'
              step='0.01'
              value={product.price}
              onChange={(e) =>
                handleChange('price', Number.parseFloat(e.target.value))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor='category'>Category</Label>
            <Select
              value={product.category}
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Perfume'>Perfume</SelectItem>
                <SelectItem value='Cologne'>Cologne</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor='gender'>Gender</Label>
            <Select
              value={product.gender}
              onValueChange={(value) => handleChange('gender', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select gender' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='male'>Male</SelectItem>
                <SelectItem value='female'>Female</SelectItem>
                <SelectItem value='unisex'>Unisex</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor='ingredients'>Ingredients</Label>
            <Textarea
              id='ingredients'
              value={product.ingredients}
              onChange={(e) => handleChange('ingredients', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor='origin'>Origin</Label>
            <Input
              id='origin'
              value={product.origin}
              onChange={(e) => handleChange('origin', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor='volume'>Volume</Label>
            <Input
              id='volume'
              value={product.volume}
              onChange={(e) => handleChange('volume', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor='stock'>Stock</Label>
            <Input
              id='stock'
              type='number'
              value={product.stock}
              onChange={(e) =>
                handleChange('stock', Number.parseInt(e.target.value))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor='images'>Images</Label>
            <Input
              id='images'
              type='file'
              multiple
              onChange={handleImageChange}
            />
          </div>
          <div>
            <Label htmlFor='status'>Status</Label>
            <Select
              value={product.status}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='hidden'>Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type='submit' disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

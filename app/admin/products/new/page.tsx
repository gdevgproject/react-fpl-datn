'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorMessage } from '@/components/ui/error-message'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { createProduct } from '@/lib/mockData'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NewProductPage() {
  const router = useRouter()
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    gender: '',
    ingredients: '',
    origin: '',
    volume: '',
    stock: '',
    images: [] as File[]
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (key: string, value: string | File[]) => {
    setProduct({ ...product, [key]: value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProduct({ ...product, images: Array.from(e.target.files) })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const newProduct = {
        ...product,
        price: Number.parseFloat(product.price),
        stock: Number.parseInt(product.stock),
        status: 'active' as const,
        images: product.images.map((file) => URL.createObjectURL(file)) // In a real app, upload these to a server!!!! =))
      }
      await createProduct(newProduct)
      toast({
        title: 'Product created',
        description: 'The product has been successfully created.'
      })
      router.push('/admin/products')
    } catch (err) {
      setError('Failed to create product. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <ErrorMessage message={error} />}
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
              onChange={(e) => handleChange('price', e.target.value)}
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
              onChange={(e) => handleChange('stock', e.target.value)}
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
              required
            />
          </div>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Product'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

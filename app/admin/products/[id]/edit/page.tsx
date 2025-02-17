'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
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
import type { Brand, Category } from '@/lib/mockData'
import {
  type Product,
  deleteProduct,
  fetchBrands,
  fetchCategories,
  fetchProduct,
  updateProduct
} from '@/lib/mockData'
import { Loader2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

// Sample data (in a real app, these would be fetched from an API)
const sampleFragranceCategories = [
  'Fresh',
  'Floral',
  'Woody',
  'Oriental',
  'Fruity',
  'Citrus',
  'Gourmand',
  'Chypre'
]

const sampleTopNotes = [
  'Bergamot',
  'Lemon',
  'Orange',
  'Grapefruit',
  'Lime',
  'Mandarin',
  'Neroli',
  'Petitgrain',
  'Pink Pepper',
  'Black Pepper'
]

const sampleMiddleNotes = [
  'Jasmine',
  'Rose',
  'Ylang-Ylang',
  'Lily of the Valley',
  'Tuberose',
  'Lavender',
  'Geranium',
  'Violet',
  'Orris Root',
  'Clary Sage'
]

const sampleBaseNotes = [
  'Sandalwood',
  'Cedarwood',
  'Patchouli',
  'Vetiver',
  'Oakmoss',
  'Vanilla',
  'Tonka Bean',
  'Musk',
  'Amber',
  'Benzoin'
]

const volumes = [30, 50, 75, 100, 125]

export default function EditProductPage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<Product>()

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [fetchedProduct, fetchedCategories, fetchedBrands] =
          await Promise.all([
            fetchProduct(params.id),
            fetchCategories(),
            fetchBrands()
          ])

        if (fetchedProduct) {
          setProduct(fetchedProduct)
          // Set default values for the form
          Object.keys(fetchedProduct).forEach((key) => {
            setValue(key as keyof Product, fetchedProduct[key as keyof Product])
          })
        } else {
          setError('Product not found')
        }
        setCategories(fetchedCategories)
        setBrands(fetchedBrands)
      } catch (err) {
        setError('Failed to fetch product. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id, setValue])

  const onSubmit = async (data: Product) => {
    if (!product) return

    setIsSaving(true)
    setError(null)
    try {
      await updateProduct(product.id, data)
      toast({
        title: 'Product updated',
        description: 'The product has been successfully updated.'
      })
      router.push(`/admin/products/${product.id}`) // Redirect to product detail page
    } catch (err) {
      setError('Failed to save product. Please try again.')
      toast({
        title: 'Error',
        description: 'Failed to update the product. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)
    try {
      await deleteProduct(params.id)
      toast({
        title: 'Product deleted',
        description: 'The product has been successfully deleted.'
      })
      router.push('/admin/products')
    } catch (err) {
      setError('Failed to delete product. Please try again.')
      toast({
        title: 'Error',
        description: 'Failed to delete the product. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (!product) return <ErrorMessage message='Product not found' />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>General Information</h3>
            <div>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && (
                <ErrorMessage message={errors.name.message || 'Error'} />
              )}
            </div>
            <div>
              <Label htmlFor='description'>Description</Label>
              <Textarea id='description' {...register('description')} />
            </div>
            <div>
              <Label htmlFor='category'>Category</Label>
              <Controller
                name='category'
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <ErrorMessage message={errors.category.message || 'Error'} />
              )}
            </div>
            <div>
              <Label htmlFor='fragrance_category_id'>Fragrance Category</Label>
              <Controller
                name='fragrance_category_id'
                control={control}
                rules={{ required: 'Fragrance category is required' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select fragrance category' />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleFragranceCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.fragrance_category_id && (
                <ErrorMessage
                  message={errors.fragrance_category_id.message || 'Error'}
                />
              )}
            </div>
            <div>
              <Label htmlFor='fragrance_brand_id'>Brand</Label>
              <Controller
                name='fragrance_brand_id'
                control={control}
                rules={{ required: 'Brand is required' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select brand' />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.fragrance_brand_id && (
                <ErrorMessage
                  message={errors.fragrance_brand_id.message || 'Error'}
                />
              )}
            </div>
            <div>
              <Label htmlFor='gender'>Gender</Label>
              <Controller
                name='gender'
                control={control}
                rules={{ required: 'Gender is required' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select gender' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='male'>Male</SelectItem>
                      <SelectItem value='female'>Female</SelectItem>
                      <SelectItem value='unisex'>Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && (
                <ErrorMessage message={errors.gender.message || 'Error'} />
              )}
            </div>
            <div>
              <Label htmlFor='origin'>Origin</Label>
              <Input id='origin' {...register('origin')} />
            </div>
            <div>
              <Label htmlFor='status'>Status</Label>
              <Controller
                name='status'
                control={control}
                defaultValue='active'
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='hidden'>Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor='is_hot'>Is Hot</Label>
              <Controller
                name='is_hot'
                control={control}
                defaultValue='no'
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select hot status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='yes'>Yes</SelectItem>
                      <SelectItem value='no'>No</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Pricing</h3>
            <div>
              <Label htmlFor='price'>Price</Label>
              <Input
                id='price'
                type='number'
                step='0.01'
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
              />
              {errors.price && (
                <ErrorMessage message={errors.price.message || 'Error'} />
              )}
            </div>
            <div>
              <Label htmlFor='listed_price'>Listed Price</Label>
              <Input
                id='listed_price'
                type='number'
                step='0.01'
                {...register('listed_price', {
                  min: { value: 0, message: 'Listed price must be positive' }
                })}
              />
              {errors.listed_price && (
                <ErrorMessage
                  message={errors.listed_price.message || 'Error'}
                />
              )}
            </div>
            <div>
              <Label htmlFor='import_price'>Import Price</Label>
              <Input
                id='import_price'
                type='number'
                step='0.01'
                {...register('import_price', {
                  required: 'Import price is required',
                  min: { value: 0, message: 'Import price must be positive' }
                })}
              />
              {errors.import_price && (
                <ErrorMessage
                  message={errors.import_price.message || 'Error'}
                />
              )}
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Inventory</h3>
            <div>
              <Label htmlFor='stock'>Stock</Label>
              <Input
                id='stock'
                type='number'
                {...register('stock', {
                  required: 'Stock is required',
                  min: { value: 0, message: 'Stock must be positive' }
                })}
              />
              {errors.stock && (
                <ErrorMessage message={errors.stock.message || 'Error'} />
              )}
            </div>
            <div>
              <Label>Volume</Label>
              <div className='flex flex-wrap gap-4'>
                {volumes.map((vol) => (
                  <div key={vol} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`volume-${vol}`}
                      {...register('volume')}
                      value={vol.toString()}
                    />
                    <Label htmlFor={`volume-${vol}`}>{vol} ml</Label>
                  </div>
                ))}
              </div>
              {errors.volume && (
                <ErrorMessage message='At least one volume must be selected' />
              )}
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Fragrance Details</h3>
            <div>
              <Label htmlFor='concentration'>Concentration</Label>
              <Controller
                name='concentration'
                control={control}
                rules={{ required: 'Concentration is required' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select concentration' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Parfum'>Parfum</SelectItem>
                      <SelectItem value='Eau de Parfum'>
                        Eau de Parfum
                      </SelectItem>
                      <SelectItem value='Eau de Toilette'>
                        Eau de Toilette
                      </SelectItem>
                      <SelectItem value='Eau de Cologne'>
                        Eau de Cologne
                      </SelectItem>
                      <SelectItem value='Eau Fraiche'>Eau Fraiche</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.concentration && (
                <ErrorMessage
                  message={errors.concentration.message || 'Error'}
                />
              )}
            </div>
            <div>
              <Label htmlFor='top_notes'>Top Notes</Label>
              <Input id='top_notes' {...register('top_notes')} />
            </div>
            <div>
              <Label htmlFor='middle_notes'>Middle Notes</Label>
              <Input id='middle_notes' {...register('middle_notes')} />
            </div>
            <div>
              <Label htmlFor='base_notes'>Base Notes</Label>
              <Input id='base_notes' {...register('base_notes')} />
            </div>
            <div>
              <Label htmlFor='ingredients'>Ingredients</Label>
              <Textarea id='ingredients' {...register('ingredients')} />
            </div>
            <div>
              <Label htmlFor='longevity'>Longevity</Label>
              <Controller
                name='longevity'
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select longevity' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Very Weak'>Very Weak</SelectItem>
                      <SelectItem value='Weak'>Weak</SelectItem>
                      <SelectItem value='Moderate'>Moderate</SelectItem>
                      <SelectItem value='Long Lasting'>Long Lasting</SelectItem>
                      <SelectItem value='Eternal'>Eternal</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor='sillage'>Sillage</Label>
              <Controller
                name='sillage'
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select sillage' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Intimate'>Intimate</SelectItem>
                      <SelectItem value='Moderate'>Moderate</SelectItem>
                      <SelectItem value='Strong'>Strong</SelectItem>
                      <SelectItem value='Enormous'>Enormous</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Images</h3>
            <div>
              <Label htmlFor='images'>Product Images</Label>
              <Input id='images' type='file' multiple {...register('images')} />
            </div>
            {product.images &&
              product.images.map((image, index) => (
                <div key={index} className='flex items-center space-x-2'>
                  <img
                    src={image}
                    alt={`Product Image ${index + 1}`}
                    className='h-20 w-20 object-cover'
                  />
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      // Implement image deletion logic here
                      const updatedImages = product.images?.filter(
                        (_, i) => i !== index
                      )
                      updateProduct(product.id, { images: updatedImages })
                        .then(() => {
                          setProduct({ ...product, images: updatedImages })
                          toast({
                            title: 'Image deleted',
                            description:
                              'The image has been successfully deleted.'
                          })
                        })
                        .catch(() => {
                          toast({
                            title: 'Error',
                            description:
                              'Failed to delete the image. Please try again.',
                            variant: 'destructive'
                          })
                        })
                    }}
                  >
                    Delete
                  </Button>
                </div>
              ))}
          </div>

          <div className='flex justify-end space-x-4'>
            <Button
              variant='outline'
              onClick={() => router.push(`/admin/products/${product.id}`)}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='destructive'>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    this product from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type='button' variant='secondary'>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type='button'
                    variant='destructive'
                    disabled={isDeleting}
                    onClick={handleDelete}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

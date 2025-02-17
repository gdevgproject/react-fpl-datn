"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ErrorMessage } from "@/components/ui/error-message"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { toast } from "@/components/ui/use-toast"
import { fetchProducts, deleteProduct, updateProduct, fetchCategories, fetchBrands } from "@/lib/mockData"
import type { Product, Category, Brand } from "@/lib/mockData"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; productId: string | null }>({
    isOpen: false,
    productId: null,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [brandFilter, setBrandFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [sortField, setSortField] = useState<keyof Product>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    loadProducts()
    loadCategories()
    loadBrands()
  }, [])

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "" || product.category === categoryFilter
      const matchesBrand = brandFilter === "" || product.brand === brandFilter
      const matchesStatus = statusFilter === "" || product.status === statusFilter
      return matchesSearch && matchesCategory && matchesBrand && matchesStatus
    })
    const sorted = filtered.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1
      if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1
      return 0
    })
    setFilteredProducts(sorted)
  }, [products, searchTerm, categoryFilter, brandFilter, statusFilter, sortField, sortDirection])

  const loadProducts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedProducts = await fetchProducts()
      setProducts(fetchedProducts)
    } catch (err) {
      setError("Failed to fetch products. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const fetchedCategories = await fetchCategories()
      setCategories(fetchedCategories)
    } catch (err) {
      console.error("Failed to fetch categories", err)
    }
  }

  const loadBrands = async () => {
    try {
      const fetchedBrands = await fetchBrands()
      setBrands(fetchedBrands)
    } catch (err) {
      console.error("Failed to fetch brands", err)
    }
  }

  const handleDeleteProduct = (productId: string) => {
    setDeleteConfirmation({ isOpen: true, productId })
  }

  const confirmDelete = async () => {
    if (deleteConfirmation.productId) {
      setIsLoading(true)
      setError(null)
      try {
        await deleteProduct(deleteConfirmation.productId)
        setProducts(products.filter((p) => p.id !== deleteConfirmation.productId))
        toast({
          title: "Product deleted",
          description: "The product has been successfully deleted.",
        })
      } catch (err) {
        setError("Failed to delete product. Please try again.")
      } finally {
        setIsLoading(false)
        setDeleteConfirmation({ isOpen: false, productId: null })
      }
    }
  }

  const handleToggleProductStatus = async (productId: string, currentStatus: "active" | "hidden") => {
    setIsLoading(true)
    setError(null)
    try {
      const newStatus = currentStatus === "active" ? "hidden" : "active"
      await updateProduct(productId, { status: newStatus })
      setProducts(products.map((p) => (p.id === productId ? { ...p, status: newStatus } : p)))
      toast({
        title: "Product status updated",
        description: `The product is now ${newStatus}.`,
      })
    } catch (err) {
      setError("Failed to update product status. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = (field: keyof Product) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Products</h2>
        <Button asChild>
          <Link href="/admin/products/new">Add New Product</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.name}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
              Name {sortField === "name" && (sortDirection === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead onClick={() => handleSort("price")} className="cursor-pointer">
              Price {sortField === "price" && (sortDirection === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead onClick={() => handleSort("category")} className="cursor-pointer">
              Category {sortField === "category" && (sortDirection === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead onClick={() => handleSort("brand")} className="cursor-pointer">
              Brand {sortField === "brand" && (sortDirection === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead onClick={() => handleSort("stock")} className="cursor-pointer">
              Stock {sortField === "stock" && (sortDirection === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.brand}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Badge variant={product.status === "active" ? "success" : "secondary"}>{product.status}</Badge>
              </TableCell>
              <TableCell>
                <Button asChild variant="outline" size="sm" className="mr-2">
                  <Link href={`/admin/products/${product.id}`}>Edit</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleProductStatus(product.id, product.status)}
                  className="mr-2"
                >
                  {product.status === "active" ? "Hide" : "Show"}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, productId: null })}
        onConfirm={confirmDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  )
}


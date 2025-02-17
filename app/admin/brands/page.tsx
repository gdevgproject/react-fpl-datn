"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorMessage } from "@/components/ui/error-message"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { fetchBrands, createBrand, updateBrand, deleteBrand } from "@/lib/mockData"
import type { Brand } from "@/lib/mockData"
import { toast } from "@/components/ui/use-toast"
import { Pencil, Trash } from "lucide-react"

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newBrand, setNewBrand] = useState({ name: "", description: "", logo: "" })
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; brandId: string | null }>({
    isOpen: false,
    brandId: null,
  })

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedBrands = await fetchBrands()
      setBrands(fetchedBrands)
    } catch (err) {
      setError("Failed to fetch brands. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBrand = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const createdBrand = await createBrand(newBrand)
      setBrands([...brands, createdBrand])
      setNewBrand({ name: "", description: "", logo: "" })
      toast({
        title: "Brand created",
        description: "The brand has been successfully created.",
      })
    } catch (err) {
      setError("Failed to create brand. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateBrand = async () => {
    if (!editingBrand) return
    setIsLoading(true)
    setError(null)
    try {
      const updatedBrand = await updateBrand(editingBrand.id, editingBrand)
      setBrands(brands.map((brand) => (brand.id === updatedBrand.id ? updatedBrand : brand)))
      setEditingBrand(null)
      toast({
        title: "Brand updated",
        description: "The brand has been successfully updated.",
      })
    } catch (err) {
      setError("Failed to update brand. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBrand = (brandId: string) => {
    setDeleteConfirmation({ isOpen: true, brandId })
  }

  const confirmDelete = async () => {
    if (deleteConfirmation.brandId) {
      setIsLoading(true)
      setError(null)
      try {
        await deleteBrand(deleteConfirmation.brandId)
        setBrands(brands.filter((brand) => brand.id !== deleteConfirmation.brandId))
        toast({
          title: "Brand deleted",
          description: "The brand has been successfully deleted.",
        })
      } catch (err) {
        setError("Failed to delete brand. Please try again.")
      } finally {
        setIsLoading(false)
        setDeleteConfirmation({ isOpen: false, brandId: null })
      }
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Brand Management</h2>

      <Card>
        <CardHeader>
          <CardTitle>Create New Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Brand Name"
              value={newBrand.name}
              onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={newBrand.description}
              onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
            />
            <Input
              placeholder="Logo URL"
              value={newBrand.logo}
              onChange={(e) => setNewBrand({ ...newBrand, logo: e.target.value })}
            />
            <Button onClick={handleCreateBrand}>Create Brand</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>{brand.name}</TableCell>
                  <TableCell>{brand.description}</TableCell>
                  <TableCell>
                    <img src={brand.logo || "/placeholder.svg"} alt={brand.name} className="w-10 h-10 object-contain" />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" onClick={() => setEditingBrand(brand)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" onClick={() => handleDeleteBrand(brand.id)}>
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingBrand && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Brand</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="Brand Name"
                value={editingBrand.name}
                onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
              />
              <Input
                placeholder="Description"
                value={editingBrand.description}
                onChange={(e) => setEditingBrand({ ...editingBrand, description: e.target.value })}
              />
              <Input
                placeholder="Logo URL"
                value={editingBrand.logo}
                onChange={(e) => setEditingBrand({ ...editingBrand, logo: e.target.value })}
              />
              <Button onClick={handleUpdateBrand}>Update Brand</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, brandId: null })}
        onConfirm={confirmDelete}
        title="Delete Brand"
        description="Are you sure you want to delete this brand? This action cannot be undone."
      />
    </div>
  )
}


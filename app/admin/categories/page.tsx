"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ErrorMessage } from "@/components/ui/error-message"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "@/lib/mockData"
import type { Category } from "@/lib/mockData"
import { toast } from "@/components/ui/use-toast"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({ name: "", parentId: "" })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; categoryId: string | null }>({
    isOpen: false,
    categoryId: null,
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedCategories = await fetchCategories()
      setCategories(fetchedCategories)
    } catch (err) {
      setError("Failed to fetch categories. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const createdCategory = await createCategory(newCategory)
      setCategories([...categories, createdCategory])
      setNewCategory({ name: "", parentId: "" })
      toast({
        title: "Category created",
        description: "The category has been successfully created.",
      })
    } catch (err) {
      setError("Failed to create category. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return
    setIsLoading(true)
    setError(null)
    try {
      const updatedCategory = await updateCategory(editingCategory.id, editingCategory)
      setCategories(categories.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat)))
      setEditingCategory(null)
      toast({
        title: "Category updated",
        description: "The category has been successfully updated.",
      })
    } catch (err) {
      setError("Failed to update category. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = (categoryId: string) => {
    setDeleteConfirmation({ isOpen: true, categoryId })
  }

  const confirmDelete = async () => {
    if (deleteConfirmation.categoryId) {
      setIsLoading(true)
      setError(null)
      try {
        await deleteCategory(deleteConfirmation.categoryId)
        setCategories(categories.filter((cat) => cat.id !== deleteConfirmation.categoryId))
        toast({
          title: "Category deleted",
          description: "The category has been successfully deleted.",
        })
      } catch (err) {
        setError("Failed to delete category. Please try again.")
      } finally {
        setIsLoading(false)
        setDeleteConfirmation({ isOpen: false, categoryId: null })
      }
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Create New Category</h2>
        <div className="flex space-x-2">
          <Input
            placeholder="Category Name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <Select
            value={newCategory.parentId}
            onValueChange={(value) => setNewCategory({ ...newCategory, parentId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Parent Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">None</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleCreateCategory}>Create Category</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Parent</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.parentId ? category.parentId : "None"}</TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => setEditingCategory(category)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteCategory(category.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingCategory && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Edit Category</h2>
          <div className="flex space-x-2">
            <Input
              placeholder="Category Name"
              value={editingCategory.name}
              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
            />
            <Select
              value={editingCategory.parentId}
              onValueChange={(value) => setEditingCategory({ ...editingCategory, parentId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Parent Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleUpdateCategory}>Update Category</Button>
          </div>
        </div>
      )}
      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onOpenChange={setDeleteConfirmation}
        onConfirm={confirmDelete}
      >
        Are you sure you want to delete this category?
      </ConfirmationDialog>
    </div>
  )
}


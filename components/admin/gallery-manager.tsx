"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Upload, Search, MoreVertical, Edit, Trash2, Eye, Download } from "lucide-react"
import { GalleryUploadForm } from "@/components/admin/gallery-upload-form"
import { GalleryEditDialog } from "@/components/admin/gallery-edit-dialog"
import { GalleryDeleteDialog } from "@/components/admin/gallery-delete-dialog"

interface GalleryItem {
  id: string
  title: string
  category: string
  image_url: string
  created_at: string
  is_featured: boolean
  description?: string
}

export function GalleryManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch gallery items from API
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/gallery")
        if (!response.ok) {
          throw new Error("Failed to fetch gallery items")
        }
        const data = await response.json()
        setGalleryItems(data.data || [])
      } catch (error) {
        console.error("Error fetching gallery items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGalleryItems()
  }, [])

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch("/api/gallery")
      if (!response.ok) {
        throw new Error("Failed to fetch gallery items")
      }
      const data = await response.json()
      setGalleryItems(data.data || [])
    } catch (error) {
      console.error("Error fetching gallery items:", error)
    }
  }

  const handleUploadComplete = () => {
    fetchGalleryItems()
    setShowUploadForm(false)
  }

  const handleDeleteItem = (item: GalleryItem) => {
    setDeletingItem(item)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingItem) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/gallery?id=${deletingItem.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete item")
      }

      setGalleryItems(prev => prev.filter(item => item.id !== deletingItem.id))
      setSelectedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(deletingItem.id)
        return newSet
      })
      setShowDeleteDialog(false)
      setDeletingItem(null)
    } catch (error) {
      console.error("Error deleting item:", error)
      alert("Failed to delete item")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) return
    setDeletingItem(null) // null indicates bulk delete
    setShowDeleteDialog(true)
  }

  const handleConfirmBulkDelete = async () => {
    setIsDeleting(true)
    try {
      const ids = Array.from(selectedItems).join(",")
      const response = await fetch(`/api/gallery?ids=${ids}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete items")
      }

      setGalleryItems(prev => prev.filter(item => !selectedItems.has(item.id)))
      setSelectedItems(new Set())
      setShowDeleteDialog(false)
    } catch (error) {
      console.error("Error deleting items:", error)
      alert("Failed to delete items")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditItem = (item: GalleryItem) => {
    setEditingItem(item)
    setShowEditDialog(true)
  }

  const handleSaveEdit = async (updatedItem: GalleryItem) => {
    try {
      const response = await fetch(`/api/gallery?id=${updatedItem.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedItem.title,
          description: updatedItem.description,
          category: updatedItem.category,
          isFeatured: updatedItem.is_featured,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update item")
      }

      setGalleryItems(prev => prev.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      ))
      setShowEditDialog(false)
      setEditingItem(null)
    } catch (error) {
      console.error("Error updating item:", error)
      alert("Failed to update item")
    }
  }

  const handleSelectItem = (id: string, selected: boolean) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allIds = new Set(galleryItems.map(item => item.id))
      setSelectedItems(allIds)
    } else {
      setSelectedItems(new Set())
    }
  }

  if (showUploadForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Upload New Gallery Item</h2>
          <Button onClick={() => setShowUploadForm(false)} variant="outline">
            Back to Gallery
          </Button>
        </div>
        <GalleryUploadForm onUploadComplete={handleUploadComplete} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            <option value="Editorial">Editorial</option>
            <option value="Fashion">Fashion</option>
            <option value="Culture">Culture</option>
            <option value="Soul Portraits">Soul Portraits</option>
          </select>
        </div>
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowUploadForm(true)}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Images
        </Button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <p>Loading gallery items...</p>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p>No gallery items found.</p>
            <Button 
              className="mt-4"
              onClick={() => setShowUploadForm(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Your First Item
            </Button>
          </div>
        ) : (
          galleryItems
            .filter(item => 
              (selectedCategory === "all" || item.category === selectedCategory) &&
              (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.category.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedItems.has(item.id)}
                    onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                    aria-label={`Select ${item.title}`}
                  />
                </div>
                <div className="aspect-square bg-muted relative group">
                  <img 
                    src={item.image_url || "/placeholder.svg"} 
                    alt={item.title} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg"
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => window.open(item.image_url, '_blank')}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleEditItem(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => window.open(item.image_url, '_blank')}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteItem(item)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{item.category}</Badge>
                    {item.is_featured && (
                      <Badge variant="default">Featured</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Uploaded: {new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </Card>
            ))
        )}
      </div>

      {/* Bulk Actions */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              className="rounded"
              checked={selectedItems.size === galleryItems.length && galleryItems.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
              aria-label="Select all items"
            />
            <span className="text-sm text-muted-foreground">
              {selectedItems.size > 0 ? `${selectedItems.size} selected` : "Select all"}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={selectedItems.size === 0}
            >
              Bulk Edit
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={selectedItems.size === 0}
              onClick={handleBulkDelete}
            >
              Delete Selected ({selectedItems.size})
            </Button>
          </div>
        </div>
      </Card>

      {/* Edit Dialog */}
      <GalleryEditDialog
        item={editingItem}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={handleSaveEdit}
      />

      {/* Delete Dialog */}
      <GalleryDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={deletingItem ? handleConfirmDelete : handleConfirmBulkDelete}
        itemTitle={deletingItem?.title}
        isBulk={!deletingItem}
        itemCount={selectedItems.size}
        isDeleting={isDeleting}
      />
    </div>
  )
}

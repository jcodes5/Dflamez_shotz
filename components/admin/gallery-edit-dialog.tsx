"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface GalleryItem {
  id: string
  title: string
  category: string
  image_url: string
  created_at: string
  is_featured: boolean
  description?: string
}

interface GalleryEditDialogProps {
  item: GalleryItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (item: GalleryItem) => void
}

export function GalleryEditDialog({ item, open, onOpenChange, onSave }: GalleryEditDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Photography",
    is_featured: false
  })

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description || "",
        category: item.category,
        is_featured: item.is_featured
      })
    }
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!item) return

    const updatedItem: GalleryItem = {
      ...item,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      is_featured: formData.is_featured
    }

    onSave(updatedItem)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Gallery Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Editorial">Editorial</SelectItem>
                <SelectItem value="Fashion">Fashion</SelectItem>
                <SelectItem value="Culture">Culture</SelectItem>
                <SelectItem value="Soul Portraits">Soul Portraits</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
            />
            <Label htmlFor="is_featured">Featured Item</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
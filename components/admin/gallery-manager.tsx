"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Upload, Search, MoreVertical, Edit, Trash2, Eye, Download } from "lucide-react"
import { GalleryUploadForm } from "@/components/admin/gallery-upload-form"

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

  const handleUploadComplete = () => {
    // Refresh the gallery items
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

    fetchGalleryItems()
    setShowUploadForm(false)
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
            <option value="Photography">Photography</option>
            <option value="Soul Portraits">Soul Portraits</option>
            <option value="Videography">Videography</option>
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
                    <Button size="sm" variant="secondary">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
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
            <input aria-label="true" type="checkbox" className="rounded" />
            <span className="text-sm text-muted-foreground">Select all</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Bulk Edit
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button variant="destructive" size="sm">
              Delete Selected
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Upload, Link, Image as ImageIcon, Video, X } from "lucide-react"

interface FormData {
  title: string
  description: string
  category: string
  file: File | null
  videoUrl: string
  featuredImageUrl: string
  isFeatured: boolean
}

export function GalleryUploadForm({ onUploadComplete }: { onUploadComplete?: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "Photography",
    file: null,
    videoUrl: "",
    featuredImageUrl: "",
    isFeatured: false
  })
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadType, setUploadType] = useState<"image" | "video">("image")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit")
        return
      }

      const supportedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!supportedImageTypes.includes(file.type)) {
        toast.error("Please select a JPG, PNG, GIF, or WebP image")
        return
      }
      
      setFormData(prev => ({ ...prev, file }))
      
      // Create preview
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, file: null }))
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const validateForm = () => {
    if (!formData.title) {
      toast.error("Title is required")
      return false
    }
    
    if (uploadType === "image" && !formData.file) {
      toast.error("Please select an image to upload")
      return false
    }
    
    if (uploadType === "video" && !formData.videoUrl) {
      toast.error("Please enter a video URL")
      return false
    }
    
    if (uploadType === "video" && formData.videoUrl) {
      const validDomains = ["tiktok.com", "instagram.com"]
      const isValid = validDomains.some(domain => formData.videoUrl.includes(domain))
      if (!isValid) {
        toast.error("Please enter a valid TikTok or Instagram video URL")
        return false
      }
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      if (uploadType === "image" && formData.file) {
        // Handle image upload
        const formDataObj = new FormData()
        formDataObj.append("file", formData.file)
        formDataObj.append("title", formData.title)
        formDataObj.append("description", formData.description)
        formDataObj.append("category", formData.category)
        
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataObj,
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to upload image")
        }
        
        const result = await response.json()
        toast.success("Image uploaded successfully!")
      } else if (uploadType === "video" && formData.videoUrl) {
        // Handle video URL submission
        const response = await fetch("/api/gallery", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            imageUrl: formData.featuredImageUrl || formData.videoUrl,
            category: formData.category,
            isFeatured: formData.isFeatured,
          }),
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to save video")
        }
        
        const result = await response.json()
        toast.success("Video link saved successfully!")
      }
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "Photography",
        file: null,
        videoUrl: "",
        featuredImageUrl: "",
        isFeatured: false
      })
      
      setPreviewUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      
      // Call completion callback
      if (onUploadComplete) {
        onUploadComplete()
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-4">
          <Button
            type="button"
            variant={uploadType === "image" ? "default" : "outline"}
            onClick={() => setUploadType("image")}
            className="flex-1"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
          <Button
            type="button"
            variant={uploadType === "video" ? "default" : "outline"}
            onClick={() => setUploadType("video")}
            className="flex-1"
          >
            <Video className="mr-2 h-4 w-4" />
            Add Video Link
          </Button>
        </div>

        {uploadType === "image" ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Image File</Label>
              <div className="mt-2">
                {previewUrl ? (
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Select a JPG, PNG, GIF, or WebP image (max 5MB)
                    </p>
                    <Input
                      ref={fileInputRef}
                      id="file"
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  placeholder="https://www.tiktok.com/... or https://www.instagram.com/..."
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Enter a TikTok or Instagram video URL
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImageUrl">Featured Image URL (Optional)</Label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="featuredImageUrl"
                  name="featuredImageUrl"
                  value={formData.featuredImageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Add a thumbnail image URL for this video
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a title for this item"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe this item..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleSelectChange("category", value)}
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
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => handleSwitchChange("isFeatured", checked)}
              />
              <Label htmlFor="isFeatured">Featured Item</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Upload to Gallery"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
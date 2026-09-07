"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Upload, X, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ImageUpload({
  value = "",
  onChange,
  label = "Featured Image",
  placeholder = "Click to upload an image",
  disabled = false,
  className = ""
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(value)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit")
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file")
      return
    }

    setIsUploading(true)

    try {
      // Create form data
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "blog")

      // Upload to Cloudinary via API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload image")
      }

      const result = await response.json()
      
      // Update the preview and parent component
      const imageUrl = result.cloudinary?.secure_url || result.data?.image_url
      if (imageUrl) {
        setPreviewUrl(imageUrl)
        onChange(imageUrl)
        toast.success("Image uploaded successfully!")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload image")
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl("")
    onChange("")
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    
    toast.success("Image removed")
  }

  const openFileDialog = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      <div className="mt-2">
        {previewUrl ? (
          <div className="relative group">
            <img 
              src={previewUrl} 
              alt="Featured image preview" 
              className="w-full h-48 object-cover rounded-lg border bg-muted"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={openFileDialog}
                  disabled={disabled || isUploading}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Change
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  disabled={disabled || isUploading}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
            
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p>Uploading...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div 
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={openFileDialog}
          >
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              {isUploading ? "Uploading..." : placeholder}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, GIF, WebP up to 5MB
            </p>
            
            <Input
              ref={fileInputRef}
              id="image-upload"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
              disabled={disabled || isUploading}
            />
          </div>
        )}
      </div>
      
      {previewUrl && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Image uploaded successfully</span>
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={openFileDialog}
            disabled={disabled || isUploading}
            className="h-auto p-0 text-xs"
          >
            Change image
          </Button>
        </div>
      )}
    </div>
  )
}

export default ImageUpload

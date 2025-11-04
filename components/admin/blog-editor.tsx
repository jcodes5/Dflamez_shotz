"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { ImageUpload } from "@/components/admin/image-upload"

interface BlogPostData {
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  tags: string
  published: boolean
}

export function BlogEditor({ 
  initialData,
  onSave
}: { 
  initialData?: Partial<BlogPostData>,
  onSave?: () => void
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [postData, setPostData] = useState<BlogPostData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    featuredImage: initialData?.featuredImage || "",
    category: initialData?.category || "Photography",
    tags: initialData?.tags || "",
    published: initialData?.published || false
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setPostData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setPostData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setPostData(prev => ({ ...prev, [name]: checked }))
  }

  const generateSlug = () => {
    const slug = postData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
    setPostData(prev => ({ ...prev, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Convert tags string to array
      const tagsArray = postData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...postData,
          tags: tagsArray
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save blog post")
      }

      const result = await response.json()
      toast.success("Blog post saved successfully!")
      
      // Reset form or redirect
      if (!initialData) {
        setPostData({
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          featuredImage: "",
          category: "Photography",
          tags: "",
          published: false
        })
      }
      
      // Call onSave callback or refresh data
      if (onSave) {
        onSave()
      }
      
      // Refresh router to update any lists
      router.refresh()
    } catch (error) {
      console.error("Error saving blog post:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save blog post")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={postData.title}
              onChange={handleInputChange}
              placeholder="Enter blog post title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                name="slug"
                value={postData.slug}
                onChange={handleInputChange}
                placeholder="enter-url-friendly-slug"
                required
              />
              <Button type="button" onClick={generateSlug} variant="outline">
                Generate
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            value={postData.excerpt}
            onChange={handleInputChange}
            placeholder="Brief summary of the blog post"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            name="content"
            value={postData.content}
            onChange={handleInputChange}
            placeholder="Write your blog post content here..."
            rows={15}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <ImageUpload
              value={postData.featuredImage}
              onChange={(value) => setPostData(prev => ({ ...prev, featuredImage: value }))}
              label="Featured Image"
              placeholder="Click to upload a featured image"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={postData.category} 
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Photography">Photography</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Technique">Technique</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            name="tags"
            value={postData.tags}
            onChange={handleInputChange}
            placeholder="tag1, tag2, tag3"
          />
          <p className="text-sm text-muted-foreground">
            Separate tags with commas
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={postData.published}
              onCheckedChange={(checked) => handleSwitchChange("published", checked)}
            />
            <Label htmlFor="published">Publish immediately</Label>
          </div>
          
          <div className="space-x-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Post"}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  )
}
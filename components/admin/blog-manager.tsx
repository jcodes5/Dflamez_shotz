"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Eye, Calendar, Clock, MoreVertical } from "lucide-react"
import { BlogEditor } from "@/components/admin/blog-editor"

interface BlogPost {
  id: string
  title: string
  category: string
  status: "published" | "draft"
  publishDate: string | null
  views: number
  readTime: string
}

export function BlogManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showEditor, setShowEditor] = useState(false)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch blog posts from API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/blog?published=false")
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts")
        }
        const data = await response.json()
        // Transform data to match our interface
        const posts = data.data.map((post: any) => ({
          id: post.id,
          title: post.title,
          category: post.category || "Uncategorized",
          status: post.published ? "published" : "draft",
          publishDate: post.published_at,
          views: 0, // We don't have view tracking yet
          readTime: "5 min read" // Placeholder
        }))
        setBlogPosts(posts)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  if (showEditor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create New Article</h2>
          <Button onClick={() => setShowEditor(false)} variant="outline">
            Back to Articles
          </Button>
        </div>
        <BlogEditor onSave={() => setShowEditor(false)} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowEditor(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </div>

      {/* Blog Posts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <p>Loading blog posts...</p>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-8">
            <p>No blog posts found.</p>
            <Button 
              className="mt-4"
              onClick={() => setShowEditor(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Article
            </Button>
          </div>
        ) : (
          blogPosts
            .filter(post => 
              post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              post.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((post) => (
              <Card key={post.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif text-lg font-bold text-foreground">{post.title}</h3>
                      <Badge variant={post.status === "published" ? "default" : "secondary"}>
                        {post.status}
                      </Badge>
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      {post.publishDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.views} views</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{blogPosts.length}</p>
          <p className="text-sm text-muted-foreground">Total Articles</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">
            {blogPosts.filter(p => p.status === "published").length}
          </p>
          <p className="text-sm text-muted-foreground">Published</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">
            {blogPosts.filter(p => p.status === "draft").length}
          </p>
          <p className="text-sm text-muted-foreground">Drafts</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">
            {blogPosts.reduce((sum, post) => sum + post.views, 0)}K
          </p>
          <p className="text-sm text-muted-foreground">Total Views</p>
        </Card>
      </div>
    </div>
  )
}
"use client"

import { Navbar } from "@/components/navbar"
import { BlogCard } from "@/components/blog-card"
import { BlogFilter } from "@/components/blog-filter"
import { Button } from "@/components/ui/button"
import { PenTool } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Breadcrumbs } from "@/components/breadcrumbs"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  publishedAt: string
  readTime: string
  image: string
}

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Fetch blog posts from API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/blog")
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts")
        }
        const data = await response.json()

        // Transform API data to match our interface
        const posts = data.data.map((post: any) => ({
          id: post.slug, // Use slug as id for routing
          title: post.title,
          excerpt: post.excerpt || post.content.substring(0, 150) + "...",
          content: post.content,
          category: post.category || "Photography",
          tags: post.tags || [],
          author: "Dflamez Shotz",
          publishedAt: post.published_at ? new Date(post.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          readTime: "5 min read", // Could be calculated based on content length
          image: post.featured_image || "/blog-featured-image-1.png"
        }))

        setBlogPosts(posts)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
        // Fallback to static data if API fails
        setBlogPosts(fallbackPosts)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  const categories = ["All", "Photography", "Personal", "Technique", "Philosophy", "Business", "Travel"]

  const filteredPosts = selectedCategory === "All"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory)

  const fallbackPosts = [
    {
      id: "the-art-of-seeing-souls",
      title: "The Art of Seeing Souls",
      excerpt: "What does it mean to truly see someone? In my years as a soul portraitor, I've learned that the most powerful images come from moments of genuine connection...",
      content: `What does it mean to truly see someone? In my years as a soul portraitor, I've learned that the most powerful images come from moments of genuine connection.`,
      category: "Photography",
      tags: ["soul portraits", "philosophy", "connection"],
      author: "Dflamez Shotz",
      publishedAt: "2024-01-15",
      readTime: "5 min read",
      image: "/blog-featured-image-1.png",
    }
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Breadcrumbs items={[{ label: "Gold's Pen" }]} />

      {/* Hero Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center transform rotate-3">
              <PenTool className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-serif text-5xl font-black tracking-tight text-foreground sm:text-7xl">
              <span className="block text-primary transform -rotate-1 inline-block">GOLD'S</span>
              <span className="block">PEN</span>
            </h1>
          </div>
          <p className="text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
            Thoughts, insights, and stories from behind the lens. Where art meets philosophy and creativity flows like
            gold.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <BlogFilter categories={categories} onCategoryChange={setSelectedCategory} />
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-black text-foreground mb-6">
            <span className="block">STAY</span>
            <span className="block text-primary transform rotate-1 inline-block">INSPIRED</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Get notified when I publish new articles and insights from my creative journey.
          </p>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 py-4 text-lg"
          >
            <Link href="/contact">SUBSCRIBE TO UPDATES</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

export default BlogPage

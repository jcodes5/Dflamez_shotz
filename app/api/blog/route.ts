import { type NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient, isAuthenticatedAdmin } from "@/lib/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const published = searchParams.get("published") !== "false"

    const client = createServiceRoleClient()
    if (!('from' in client)) {
      return NextResponse.json({ error: "Supabase client is not properly initialized" }, { status: 500 })
    }
    const supabase = client as SupabaseClient

    let query = supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

    if (published) {
      query = query.eq("published", true)
    }

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const body = await request.json()
    const { title, slug, excerpt, content, featuredImage, category, tags, published = false } = body

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 })
    }

    const client = createServiceRoleClient()
    if (!('from' in client)) {
      return NextResponse.json({ error: "Supabase client is not properly initialized" }, { status: 500 })
    }
    const supabase = client as SupabaseClient

    // Insert the blog post into the database
    const { data, error } = await supabase
      .from("blog_posts")
      .insert([
        {
          title,
          slug,
          excerpt,
          content,
          featured_image: featuredImage,
          category,
          tags,
          published,
          published_at: published ? new Date().toISOString() : null,
        },
      ])
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
    }

    return NextResponse.json({ message: "Blog post created successfully", data }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
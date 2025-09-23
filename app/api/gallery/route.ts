import { type NextRequest, NextResponse } from "next/server"
import { createApiRouteClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    const supabase = createApiRouteClient()

    let query = supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, imageUrl, category, isFeatured = false } = body

    // Validate required fields
    if (!title || !imageUrl || !category) {
      return NextResponse.json({ error: "Title, image URL, and category are required" }, { status: 400 })
    }

    const supabase = createApiRouteClient()

    // Insert the gallery item into the database
    const { data, error } = await supabase
      .from("gallery_items")
      .insert([
        {
          title,
          description,
          image_url: imageUrl,
          category,
          is_featured: isFeatured,
        },
      ])
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 })
    }

    return NextResponse.json({ message: "Gallery item created successfully", data }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
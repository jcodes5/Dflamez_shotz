import { type NextRequest, NextResponse } from "next/server"
import { type SupabaseClient } from "@supabase/supabase-js"
import { createApiRouteClient, createServiceRoleClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/gallery: Starting request")
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    console.log("GET /api/gallery: Category filter:", category)

    const supabase = createServiceRoleClient() as SupabaseClient
    console.log("GET /api/gallery: Service role Supabase client created")

    let query = supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    console.log("GET /api/gallery: Executing query")
    const { data, error } = await query
    console.log("GET /api/gallery: Query result - data length:", data?.length, "error:", error)

    if (error) {
      console.error("GET /api/gallery: Database error:", error)
      return NextResponse.json({ error: "Failed to fetch gallery items", details: error.message }, { status: 500 })
    }

    console.log("GET /api/gallery: Success, returning data")
    return NextResponse.json({ data })
  } catch (error) {
    console.error("GET /api/gallery: API error:", error)
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/gallery: Starting request")
    const body = await request.json()
    const { title, description, imageUrl, category, isFeatured = false } = body
    console.log("POST /api/gallery: Request body:", { title, description, imageUrl: imageUrl?.substring(0, 50), category, isFeatured })

    // Validate required fields
    if (!title || !imageUrl || !category) {
      console.log("POST /api/gallery: Validation failed - missing required fields")
      return NextResponse.json({ error: "Title, image URL, and category are required" }, { status: 400 })
    }

    console.log("POST /api/gallery: Creating service role client")
    const supabase = createServiceRoleClient() as SupabaseClient

    // Insert the gallery item into the database
    console.log("POST /api/gallery: Inserting into database")
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

    console.log("POST /api/gallery: Insert result - data:", data, "error:", error)

    if (error) {
      console.error("POST /api/gallery: Database error:", error)
      return NextResponse.json({ error: "Failed to create gallery item", details: error.message, code: error.code }, { status: 500 })
    }

    console.log("POST /api/gallery: Success, returning data")
    return NextResponse.json({ message: "Gallery item created successfully", data }, { status: 201 })
  } catch (error) {
    console.error("POST /api/gallery: API error:", error)
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("DELETE /api/gallery: Starting request")
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const ids = searchParams.get("ids") // For bulk delete

    if (!id && !ids) {
      return NextResponse.json({ error: "ID or IDs parameter is required" }, { status: 400 })
    }

    console.log("DELETE /api/gallery: Creating service role client")
    const supabase = createServiceRoleClient() as SupabaseClient

    let result
    if (id) {
      // Single delete
      console.log("DELETE /api/gallery: Deleting single item with ID:", id)
      result = await supabase
        .from("gallery_items")
        .delete()
        .eq("id", id)
        .select()
    } else {
      // Bulk delete
      const idsArray = ids!.split(",")
      console.log("DELETE /api/gallery: Deleting multiple items with IDs:", idsArray)
      result = await supabase
        .from("gallery_items")
        .delete()
        .in("id", idsArray)
        .select()
    }

    const { data, error } = result
    console.log("DELETE /api/gallery: Delete result - data:", data, "error:", error)

    if (error) {
      console.error("DELETE /api/gallery: Database error:", error)
      return NextResponse.json({ error: "Failed to delete gallery item(s)", details: error.message, code: error.code }, { status: 500 })
    }

    console.log("DELETE /api/gallery: Success")
    return NextResponse.json({ message: "Gallery item(s) deleted successfully", data })
  } catch (error) {
    console.error("DELETE /api/gallery: API error:", error)
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    console.log("PATCH /api/gallery: Starting request")
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID parameter is required" }, { status: 400 })
    }

    const body = await request.json()
    const { title, description, imageUrl, category, isFeatured, sortOrder } = body
    console.log("PATCH /api/gallery: Request body:", { id, title, description, imageUrl: imageUrl?.substring(0, 50), category, isFeatured, sortOrder })

    console.log("PATCH /api/gallery: Creating service role client")
    const supabase = createServiceRoleClient() as SupabaseClient

    // Prepare update object
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (imageUrl !== undefined) updateData.image_url = imageUrl
    if (category !== undefined) updateData.category = category
    if (isFeatured !== undefined) updateData.is_featured = isFeatured
    if (sortOrder !== undefined) updateData.sort_order = sortOrder
    updateData.updated_at = new Date().toISOString()

    console.log("PATCH /api/gallery: Updating item with data:", updateData)
    const { data, error } = await supabase
      .from("gallery_items")
      .update(updateData)
      .eq("id", id)
      .select()

    console.log("PATCH /api/gallery: Update result - data:", data, "error:", error)

    if (error) {
      console.error("PATCH /api/gallery: Database error:", error)
      return NextResponse.json({ error: "Failed to update gallery item", details: error.message, code: error.code }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
    }

    console.log("PATCH /api/gallery: Success")
    return NextResponse.json({ message: "Gallery item updated successfully", data: data[0] })
  } catch (error) {
    console.error("PATCH /api/gallery: API error:", error)
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
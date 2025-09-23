import { type NextRequest, NextResponse } from "next/server"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { createApiRouteClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(file, "dflamez-gallery")

    // Save to database
    const supabase = createApiRouteClient()
    const { data, error } = await supabase
      .from("gallery_items")
      .insert({
        title,
        description,
        category,
        cloudinary_public_id: uploadResult.public_id,
        image_url: uploadResult.secure_url,
        type: uploadResult.resource_type,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        duration: uploadResult.duration,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save to database" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data,
      cloudinary: uploadResult,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
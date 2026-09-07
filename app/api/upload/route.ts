import { type NextRequest, NextResponse } from "next/server"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { createApiRouteClient, createServiceRoleClient, isAuthenticatedAdmin } from "@/lib/supabase/server"
import { type SupabaseClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    console.log("POST /api/upload: Starting request")
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string
    const category = formData.get("category") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    console.log("POST /api/upload: Form data - file:", !!file, "type:", type, "category:", category, "title:", title)

    if (!file) {
      console.log("POST /api/upload: No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const supportedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!supportedImageTypes.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported image format. Use JPG, PNG, GIF, or WebP." }, { status: 415 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 413 })
    }

    // Upload to Cloudinary
    console.log("POST /api/upload: Uploading to Cloudinary")
    let uploadResult
    try {
      uploadResult = await uploadToCloudinary(file, "dflamez-gallery")
      console.log("POST /api/upload: Cloudinary upload successful")
    } catch (cloudinaryError: any) {
      console.error("POST /api/upload: Cloudinary upload error:", cloudinaryError)
      return NextResponse.json({
        error: "Failed to upload to Cloudinary",
        details: cloudinaryError.message,
        code: cloudinaryError.code || 'CLOUDINARY_UPLOAD_ERROR'
      }, { status: 500 })
    }

    // Handle different upload types
    if (type === "blog") {
      // For blog featured images, just return the upload result
      console.log("POST /api/upload: Blog featured image upload - returning URL only")
      return NextResponse.json({
        success: true,
        cloudinary: uploadResult,
        imageUrl: uploadResult.secure_url
      })
    } else {
      // For gallery uploads, save to database
      console.log("POST /api/upload: Creating Supabase service role client")
      const supabase = createServiceRoleClient()

      // Type check to ensure we have a proper Supabase client
      if (!('from' in supabase)) {
        console.log("POST /api/upload: Supabase client not properly configured")
        return NextResponse.json({ error: "Supabase client not properly configured" }, { status: 500 })
      }

      const typedSupabase = supabase as SupabaseClient;

      console.log("POST /api/upload: Inserting into database")
      const { data, error } = await typedSupabase
        .from("gallery_items")
        .insert({
          title,
          description,
          category,
          image_url: uploadResult.secure_url,
          is_featured: false, // Default to false since not provided in form
        })
        .select()
        .single()

      console.log("POST /api/upload: Insert result - data:", data, "error:", error)

      if (error) {
        console.error("POST /api/upload: Database error:", error)
        return NextResponse.json({ error: "Failed to save to database", details: error.message, code: error.code }, { status: 500 })
      }

      console.log("POST /api/upload: Success")
      return NextResponse.json({
        success: true,
        data: data,
        cloudinary: uploadResult,
      })
    }
  } catch (error: any) {
    console.error("POST /api/upload: Upload error:", error)
    return NextResponse.json({
      error: "Upload failed",
      details: error.message || "An unexpected error occurred during upload"
    }, { status: 500 })
  }
}
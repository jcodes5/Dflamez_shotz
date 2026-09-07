import { type NextRequest, NextResponse } from "next/server"
import { createClient, isAuthenticatedAdmin } from "@/lib/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      clientName,
      clientEmail,
      clientPhone,
      serviceType,
      packageName,
      packagePrice,
      eventDate,
      eventLocation,
      specialRequests,
    } = body

    // Validate required fields
    if (!clientName || !clientEmail || !serviceType || !packageName || !packagePrice) {
      return NextResponse.json(
        { success: false, message: "Missing required booking information" },
        { status: 400 }
      )
    }

    const client = await createClient()
    if (!('from' in client)) {
      return NextResponse.json(
        { success: false, message: "Supabase client is not properly initialized" },
        { status: 500 }
      )
    }
    const supabase = client as SupabaseClient

    // Calculate 30% deposit
    const depositAmount = (Number.parseFloat(packagePrice) * 0.3).toFixed(2)

    // Insert the booking into the database
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
          service_type: serviceType,
          package_name: packageName,
          package_price: Number.parseFloat(packagePrice),
          event_date: eventDate,
          event_location: eventLocation,
          special_requests: specialRequests,
          deposit_amount: Number.parseFloat(depositAmount),
          status: "pending",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { success: false, message: "Failed to create booking" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        data: data,
        depositAmount: Number.parseFloat(depositAmount),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    if (!(await isAuthenticatedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const client = await createClient()
    if (!('from' in client)) {
      return NextResponse.json({ success: false, message: "Supabase client is not properly initialized" }, { status: 500 })
    }
    const supabase = client as SupabaseClient

    // Get all bookings (admin only)
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        payments (*)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

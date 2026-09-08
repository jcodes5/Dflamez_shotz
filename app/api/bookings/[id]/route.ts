import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = await createClient()
    if (!('from' in client)) {
      return NextResponse.json({ error: "Supabase client is not properly initialized" }, { status: 500 })
    }
    const supabase = client as SupabaseClient

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        payments (*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

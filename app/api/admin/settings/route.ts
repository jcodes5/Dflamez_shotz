import { type NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient, isAuthenticatedAdmin } from "@/lib/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    if (!(await isAuthenticatedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const client = createServiceRoleClient() as ReturnType<typeof createServiceRoleClient> & { from: (table: string) => any }
    const supabase = client as SupabaseClient

    const { data, error } = await supabase
      .from("site_settings")
      .select("setting_key, setting_value")

    if (error) {
      console.error("Settings fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
    }

    const settings: Record<string, string> = {}
    for (const row of data ?? []) {
      settings[row.setting_key] = row.setting_value ?? ""
    }

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error("Settings API error:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAuthenticatedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const client = createServiceRoleClient() as ReturnType<typeof createServiceRoleClient> & { from: (table: string) => any }
    const supabase = client as SupabaseClient

    const updates = Object.entries(body).map(([key, value]) => ({
      setting_key: key,
      setting_value: String(value ?? ""),
      updated_at: new Date().toISOString(),
    }))

    const { error } = await supabase
      .from("site_settings")
      .upsert(updates, { onConflict: "setting_key" })

    if (error) {
      console.error("Settings update error:", error)
      return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Settings updated successfully" })
  } catch (error) {
    console.error("Settings API error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient, isAuthenticatedAdmin } from "@/lib/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAuthenticatedAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { newPassword, newEmail } = body

    if (!newPassword && !newEmail) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
    }

    const supabase = createServiceRoleClient() as ReturnType<typeof createServiceRoleClient> & {
      from: (table: string) => any
    } as SupabaseClient

    const updates: Record<string, string> = {}
    if (newEmail && typeof newEmail === "string") {
      const { error } = await supabase.auth.admin.updateUserById(
        (await supabase.auth.getUser()).data.user!.id,
        { email: newEmail.trim() }
      )
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      updates.email = newEmail.trim()
    }

    if (newPassword && typeof newPassword === "string") {
      if (newPassword.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
      }
      const { error } = await supabase.auth.admin.updateUserById(
        (await supabase.auth.getUser()).data.user!.id,
        { password: newPassword }
      )
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully", updated: updates })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

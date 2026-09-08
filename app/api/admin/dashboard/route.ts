import { NextResponse } from "next/server"
import { createServiceRoleClient, isAuthenticatedAdmin, isSupabaseConfigured } from "@/lib/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"

type Activity = {
  type: "hire" | "contact" | "gallery" | "blog"
  message: string
  created_at: string
}

export async function GET() {
  try {
    if (!(await isAuthenticatedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!isSupabaseConfigured) return NextResponse.json({ error: "Database not configured" }, { status: 503 })

    const client = createServiceRoleClient()
    if (!('from' in client)) {
      return NextResponse.json({ error: "Supabase client is not properly initialized" }, { status: 500 })
    }
    const supabase = client as SupabaseClient

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const countRows = async (table: string, since?: string) => {
      let query = supabase.from(table).select("id", { count: "exact", head: true })
      if (since) query = query.gte("created_at", since)
      const { count, error } = await query
      if (error) throw error
      return count ?? 0
    }

    const [galleryTotal, galleryThisMonth, blogTotal, blogThisMonth, contactsTotal, contactsThisWeek, hiresTotal, hiresThisWeek, bookingsTotal, bookingsThisMonth, recentHires, recentContacts, recentGallery, recentBlog] = await Promise.all([
      countRows("gallery_items"), countRows("gallery_items", startOfMonth.toISOString()),
      countRows("blog_posts"), countRows("blog_posts", startOfMonth.toISOString()),
      countRows("client_inquiries"), countRows("client_inquiries", startOfWeek.toISOString()),
      countRows("hire_requests"), countRows("hire_requests", startOfWeek.toISOString()),
      countRows("bookings"), countRows("bookings", startOfMonth.toISOString()),
      supabase.from("hire_requests").select("client_name, created_at").order("created_at", { ascending: false }).limit(2),
      supabase.from("client_inquiries").select("name, created_at").order("created_at", { ascending: false }).limit(2),
      supabase.from("gallery_items").select("title, created_at").order("created_at", { ascending: false }).limit(2),
      supabase.from("blog_posts").select("title, created_at").order("created_at", { ascending: false }).limit(2),
    ])

    const queryResults = [recentHires, recentContacts, recentGallery, recentBlog]
    const queryError = queryResults.find((result) => result.error)?.error
    if (queryError) throw queryError

    const activity: Activity[] = [
      ...(recentHires.data ?? []).map((item: { client_name: string; created_at: string }) => ({ type: "hire" as const, message: `New hire request from ${item.client_name}`, created_at: item.created_at })),
      ...(recentContacts.data ?? []).map((item: { name: string; created_at: string }) => ({ type: "contact" as const, message: `Contact form submission from ${item.name}`, created_at: item.created_at })),
      ...(recentGallery.data ?? []).map((item: { title: string; created_at: string }) => ({ type: "gallery" as const, message: `Uploaded \u201c${item.title}\u201d to the gallery`, created_at: item.created_at })),
      ...(recentBlog.data ?? []).map((item: { title: string; created_at: string }) => ({ type: "blog" as const, message: `Created \u201c${item.title}\u201d`, created_at: item.created_at })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6)

    const totalInteractions = galleryTotal + blogTotal + contactsTotal + hiresTotal + bookingsTotal
    const thisMonthInteractions = galleryThisMonth + blogThisMonth + contactsThisWeek + hiresThisWeek + bookingsThisMonth

    return NextResponse.json({
      stats: {
        gallery: { total: galleryTotal, period: galleryThisMonth, periodLabel: "this month" },
        blog: { total: blogTotal, period: blogThisMonth, periodLabel: "this month" },
        contacts: { total: contactsTotal, period: contactsThisWeek, periodLabel: "this week" },
        hires: { total: hiresTotal, period: hiresThisWeek, periodLabel: "this week" },
      },
      performance: {
        totalViews: totalInteractions,
        viewsGrowth: thisMonthInteractions,
        engagement: contactsTotal + hiresTotal,
        engagementGrowth: contactsThisWeek + hiresThisWeek,
        sessions: bookingsTotal,
        sessionsGrowth: bookingsThisMonth,
      },
      recentActivity: activity,
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 })
  }
}

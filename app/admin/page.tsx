import { redirect } from "next/navigation"
import AdminDashboard from "@/components/admin/admin-dashboard"
import { getAuthenticatedAdmin } from "@/lib/supabase/server"

export default async function AdminPage() {
  const admin = await getAuthenticatedAdmin()

  if (!admin) {
    redirect("/login")
  }

  return <AdminDashboard />
}

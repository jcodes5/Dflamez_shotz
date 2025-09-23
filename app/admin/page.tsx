"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { DashboardOverview } from "@/components/admin/dashboard-overview"
import { GalleryManager } from "@/components/admin/gallery-manager"
import { BlogManager } from "@/components/admin/blog-manager"
import { ContactManager } from "@/components/admin/contact-manager"
import { HireManager } from "@/components/admin/hire-manager"
import { ProfileSettings } from "@/components/admin/profile-settings"

type AdminSection = "overview" | "gallery" | "blog" | "contacts" | "hires" | "profile"

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview")

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview />
      case "gallery":
        return <GalleryManager />
      case "blog":
        return <BlogManager />
      case "contacts":
        return <ContactManager />
      case "hires":
        return <HireManager />
      case "profile":
        return <ProfileSettings />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="lg:pl-64">
          <AdminHeader activeSection={activeSection} />
          <main className="p-6">{renderContent()}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

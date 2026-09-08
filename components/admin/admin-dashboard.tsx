"use client"

import { useState, useEffect } from "react"
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  useEffect(() => {
    const checkScreen = () => setIsLargeScreen(window.innerWidth >= 1024)
    checkScreen()
    window.addEventListener("resize", checkScreen)
    return () => window.removeEventListener("resize", checkScreen)
  }, [])

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview onNavigate={setActiveSection} />
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
    <div className="min-h-screen bg-background">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section)
          setMobileOpen(false)
        }}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
      />
      <div className={`transition-all duration-300 ${isLargeScreen ? (sidebarCollapsed ? "lg:pl-16" : "lg:pl-64") : "pl-0"}`}>
        <AdminHeader activeSection={activeSection} onMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  )
}

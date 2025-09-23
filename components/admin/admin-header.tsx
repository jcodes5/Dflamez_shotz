"use client"

import { Button } from "@/components/ui/button"
import { Bell, Menu } from "lucide-react"

type AdminSection = "overview" | "gallery" | "blog" | "contacts" | "hires" | "profile"

interface AdminHeaderProps {
  activeSection: AdminSection
}

const sectionTitles = {
  overview: "Dashboard Overview",
  gallery: "Gallery Management",
  blog: "Gold's Pen Management",
  contacts: "Contact Form Submissions",
  hires: "Hire Requests",
  profile: "Profile Settings",
}

export function AdminHeader({ activeSection }: AdminHeaderProps) {
  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-serif text-2xl font-black text-foreground">{sectionTitles[activeSection]}</h1>
            <p className="text-sm text-muted-foreground">Welcome back, Wura</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full text-xs"></span>
          </Button>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">W</span>
          </div>
        </div>
      </div>
    </header>
  )
}

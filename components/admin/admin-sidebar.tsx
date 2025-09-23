"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Images, PenTool, MessageSquare, Briefcase, User, LogOut, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/auth-provider"

type AdminSection = "overview" | "gallery" | "blog" | "contacts" | "hires" | "profile"

interface AdminSidebarProps {
  activeSection: AdminSection
  onSectionChange: (section: AdminSection) => void
}

const navigation = [
  { name: "Overview", icon: LayoutDashboard, section: "overview" as AdminSection },
  { name: "Gallery", icon: Images, section: "gallery" as AdminSection },
  { name: "Gold's Pen", icon: PenTool, section: "blog" as AdminSection },
  { name: "Contact Forms", icon: MessageSquare, section: "contacts" as AdminSection },
  { name: "Hire Requests", icon: Briefcase, section: "hires" as AdminSection },
  { name: "Profile", icon: User, section: "profile" as AdminSection },
]

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const { logout } = useAuth()

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border lg:block hidden">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Crown className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-black text-primary">GOLD'S</h1>
            <p className="text-sm text-muted-foreground">Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <Button
              key={item.section}
              variant={activeSection === item.section ? "default" : "ghost"}
              className={cn(
                "w-full justify-start font-semibold",
                activeSection === item.section
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
              onClick={() => onSectionChange(item.section)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <Button asChild variant="ghost" className="w-full justify-start text-muted-foreground">
            <Link href="/">
              <LogOut className="mr-3 h-5 w-5" />
              Back to Site
            </Link>
          </Button>
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}

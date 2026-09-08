"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Images, PenTool, MessageSquare, Briefcase, User, LogOut, Crown, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/auth-provider"
import { useState } from "react"

type AdminSection = "overview" | "gallery" | "blog" | "contacts" | "hires" | "profile"

interface AdminSidebarProps {
  activeSection: AdminSection
  onSectionChange: (section: AdminSection) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  mobileOpen?: boolean
}

const navigation = [
  { name: "Overview", icon: LayoutDashboard, section: "overview" as AdminSection },
  { name: "Gallery", icon: Images, section: "gallery" as AdminSection },
  { name: "Gold's Pen", icon: PenTool, section: "blog" as AdminSection },
  { name: "Contact Forms", icon: MessageSquare, section: "contacts" as AdminSection },
  { name: "Hire Requests", icon: Briefcase, section: "hires" as AdminSection },
  { name: "Profile", icon: User, section: "profile" as AdminSection },
]

export function AdminSidebar({ activeSection, onSectionChange, isCollapsed = false, onToggleCollapse, mobileOpen = false }: AdminSidebarProps) {
  const { logout } = useAuth()

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      mobileOpen ? "block" : "hidden lg:block"
    )}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Crown className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-black text-primary">GOLD'S</h1>
                <p className="text-sm text-muted-foreground">Dashboard</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mx-auto">
              <Crown className="h-6 w-6 text-primary-foreground" />
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <Button
              key={item.section}
              variant={activeSection === item.section ? "default" : "ghost"}
              className={cn(
                "w-full font-semibold transition-all duration-200",
                isCollapsed ? "justify-center px-2" : "justify-start",
                activeSection === item.section
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
              onClick={() => onSectionChange(item.section)}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <Button asChild variant="ghost" className={cn(
            "w-full text-muted-foreground transition-all duration-200",
            isCollapsed ? "justify-center px-2" : "justify-start"
          )}>
            <Link href="/" title={isCollapsed ? "Back to Site" : undefined}>
              <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && "Back to Site"}
            </Link>
          </Button>
          <Button
            onClick={logout}
            variant="ghost"
            className={cn(
              "w-full text-muted-foreground hover:text-destructive transition-all duration-200",
              isCollapsed ? "justify-center px-2" : "justify-start"
            )}
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && "Sign Out"}
          </Button>
        </div>
      </div>
    </div>
  )
}

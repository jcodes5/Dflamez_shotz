"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Images, PenTool, MessageSquare, Briefcase, Eye, Heart, Calendar, RefreshCw } from "lucide-react"

type AdminSection = "overview" | "gallery" | "blog" | "contacts" | "hires" | "profile"
type ActivityType = "hire" | "contact" | "gallery" | "blog"
type DashboardData = {
  stats: Record<string, { total: number; period: number; periodLabel: string }>
  performance: { totalViews: number; viewsGrowth: number; engagement: number; engagementGrowth: number; sessions: number; sessionsGrowth: number }
  recentActivity: { type: ActivityType; message: string; created_at: string }[]
}

const statConfig = [
  { key: "gallery", name: "Gallery Images", icon: Images, color: "text-blue-600" },
  { key: "blog", name: "Blog Posts", icon: PenTool, color: "text-green-600" },
  { key: "contacts", name: "Contact Forms", icon: MessageSquare, color: "text-purple-600" },
  { key: "hires", name: "Hire Requests", icon: Briefcase, color: "text-primary" },
] as const

const activityIcons = { hire: Briefcase, contact: MessageSquare, gallery: Images, blog: PenTool }
const quickActions = [
  { name: "Upload Images", description: "Add new photos to your gallery", icon: Images, section: "gallery" as AdminSection },
  { name: "Write Article", description: "Create a new blog post", icon: PenTool, section: "blog" as AdminSection },
  { name: "View Messages", description: "Check contact form submissions", icon: MessageSquare, section: "contacts" as AdminSection },
  { name: "Hire Requests", description: "Review pending hire requests", icon: Briefcase, section: "hires" as AdminSection },
]

function formatActivityTime(date: string) {
  const elapsed = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(elapsed / 60000)
  if (minutes < 60) return `${Math.max(minutes, 1)} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? "" : "s"} ago`
}

export function DashboardOverview({ onNavigate }: { onNavigate?: (section: AdminSection) => void }) {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/admin/dashboard", { cache: "no-store" })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to load dashboard")
      setDashboard(result)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  if (loading) return <div className="flex min-h-64 items-center justify-center text-muted-foreground">Loading dashboard data...</div>

  if (error || !dashboard) {
    return (
      <Card className="p-8 text-center">
        <p className="mb-4 text-destructive">{error || "Dashboard data is unavailable."}</p>
        <Button variant="outline" onClick={loadDashboard}><RefreshCw className="mr-2 h-4 w-4" />Retry</Button>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statConfig.map((stat) => {
          const value = dashboard.stats[stat.key]
          return (
            <Card key={stat.key} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-bold text-foreground">{value.total}</p>
                  <p className="text-sm text-green-600">+{value.period} {value.periodLabel}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${stat.color}`}><stat.icon className="h-6 w-6" /></div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between"><h3 className="font-serif text-xl font-bold text-foreground">Recent Activity</h3><Button variant="ghost" size="sm" onClick={loadDashboard}>Refresh</Button></div>
          <div className="space-y-4">
            {dashboard.recentActivity.length === 0 ? <p className="text-sm text-muted-foreground">No activity yet.</p> : dashboard.recentActivity.map((activity, index) => {
              const Icon = activityIcons[activity.type]
              return <div key={`${activity.created_at}-${index}`} className="flex items-center gap-4"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted"><Icon className="h-5 w-5 text-muted-foreground" /></div><div className="flex-1"><p className="text-sm text-foreground">{activity.message}</p><p className="text-xs text-muted-foreground">{formatActivityTime(activity.created_at)}</p></div></div>
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-6 font-serif text-xl font-bold text-foreground">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Button key={action.section} variant="outline" className="h-auto flex-col gap-2 p-4 hover:bg-muted" onClick={() => onNavigate?.(action.section)}>
                <action.icon className="h-6 w-6 text-primary" />
                <div className="text-center"><p className="text-sm font-semibold">{action.name}</p><p className="text-xs text-muted-foreground">{action.description}</p></div>
              </Button>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-6 font-serif text-xl font-bold text-foreground">Website Performance</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Eye className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">{dashboard.performance.totalViews.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total interactions</p>
            <p className="text-xs text-green-600">+{dashboard.performance.viewsGrowth} this month</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Heart className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">{dashboard.performance.engagement.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Client inquiries</p>
            <p className="text-xs text-green-600">+{dashboard.performance.engagementGrowth} this week</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">{dashboard.performance.sessions.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Bookings</p>
            <p className="text-xs text-green-600">+{dashboard.performance.sessionsGrowth} this month</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

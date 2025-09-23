"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Images, PenTool, MessageSquare, Briefcase, TrendingUp, Eye, Heart, Calendar } from "lucide-react"

const stats = [
  {
    name: "Gallery Images",
    value: "127",
    change: "+12 this month",
    icon: Images,
    color: "text-blue-600",
  },
  {
    name: "Blog Posts",
    value: "24",
    change: "+3 this month",
    icon: PenTool,
    color: "text-green-600",
  },
  {
    name: "Contact Forms",
    value: "18",
    change: "+5 this week",
    icon: MessageSquare,
    color: "text-purple-600",
  },
  {
    name: "Hire Requests",
    value: "8",
    change: "+2 this week",
    icon: Briefcase,
    color: "text-primary",
  },
]

const recentActivity = [
  {
    type: "hire",
    message: "New hire request from Sarah Johnson",
    time: "2 hours ago",
    icon: Briefcase,
  },
  {
    type: "contact",
    message: "Contact form submission from Marcus Williams",
    time: "4 hours ago",
    icon: MessageSquare,
  },
  {
    type: "gallery",
    message: "Uploaded 5 new images to Soul Portraits",
    time: "1 day ago",
    icon: Images,
  },
  {
    type: "blog",
    message: "Published 'The Art of Seeing Souls'",
    time: "3 days ago",
    icon: PenTool,
  },
]

const quickActions = [
  {
    name: "Upload Images",
    description: "Add new photos to your gallery",
    icon: Images,
    action: "gallery",
  },
  {
    name: "Write Article",
    description: "Create a new blog post",
    icon: PenTool,
    action: "blog",
  },
  {
    name: "View Messages",
    description: "Check contact form submissions",
    icon: MessageSquare,
    action: "contacts",
  },
  {
    name: "Hire Requests",
    description: "Review pending hire requests",
    icon: Briefcase,
    action: "hires",
  },
]

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl font-bold text-foreground">Recent Activity</h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <activity.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="font-serif text-xl font-bold text-foreground mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-muted bg-transparent"
              >
                <action.icon className="h-6 w-6 text-primary" />
                <div className="text-center">
                  <p className="font-semibold text-sm">{action.name}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Website Analytics */}
      <Card className="p-6">
        <h3 className="font-serif text-xl font-bold text-foreground mb-6">Website Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">2,847</p>
            <p className="text-sm text-muted-foreground">Page Views</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">1,234</p>
            <p className="text-sm text-muted-foreground">Unique Visitors</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Heart className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">89%</p>
            <p className="text-sm text-muted-foreground">Engagement Rate</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">3:24</p>
            <p className="text-sm text-muted-foreground">Avg. Session</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

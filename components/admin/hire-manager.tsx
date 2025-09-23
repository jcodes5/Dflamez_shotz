"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Calendar, DollarSign, User, Phone, Mail, MessageSquare, Check, X, Clock } from "lucide-react"

const mockHireRequests = [
  {
    id: "1",
    clientName: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    service: "Soul Portraits",
    budget: "$500-750",
    preferredDate: "2024-02-15",
    message:
      "I'd love to book a soul portrait session for my 30th birthday. I'm looking for something intimate and meaningful.",
    status: "pending",
    priority: "high",
    submittedDate: "2024-01-15",
  },
  {
    id: "2",
    clientName: "Marcus & Lisa Williams",
    email: "marcus@example.com",
    phone: "+1 (555) 987-6543",
    service: "Videography",
    budget: "$1500-2000",
    preferredDate: "2024-03-20",
    message:
      "We're getting married and would love to have you capture our special day. We've seen your work and it's exactly what we're looking for.",
    status: "approved",
    priority: "high",
    submittedDate: "2024-01-12",
  },
  {
    id: "3",
    clientName: "Elena Rodriguez",
    email: "elena@example.com",
    phone: "",
    service: "Photography",
    budget: "$300-500",
    preferredDate: "2024-02-01",
    message: "I need professional headshots for my business. Looking for something clean and professional.",
    status: "declined",
    priority: "medium",
    submittedDate: "2024-01-10",
  },
]

export function HireManager() {
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">8</p>
          <p className="text-sm text-muted-foreground">Total Requests</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">3</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">4</p>
          <p className="text-sm text-muted-foreground">Approved</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">$8,500</p>
          <p className="text-sm text-muted-foreground">Potential Revenue</p>
        </Card>
      </div>

      {/* Hire Requests */}
      <div className="space-y-4">
        {mockHireRequests.map((request) => (
          <Card key={request.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-lg font-bold text-foreground">{request.clientName}</h3>
                    <Badge
                      variant={
                        request.status === "pending"
                          ? "secondary"
                          : request.status === "approved"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {request.status}
                    </Badge>
                    <Badge variant="outline">{request.service}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Submitted: {new Date(request.submittedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{request.budget}</span>
                    </div>
                  </div>
                </div>
              </div>
              {request.status === "pending" && (
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive">
                    <X className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{request.clientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{request.email}</span>
                </div>
                {request.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{request.phone}</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    Preferred: {new Date(request.preferredDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Budget: {request.budget}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Service: {request.service}</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Client Message:</span>
              </div>
              <p className="text-foreground">{request.message}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                Reply via WhatsApp
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-1" />
                Send Email
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-1" />
                Schedule Meeting
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

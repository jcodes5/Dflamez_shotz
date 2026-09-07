"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Calendar, DollarSign, User, Phone, Mail, MessageSquare, Check, X, Clock, RefreshCw, MapPin } from "lucide-react"
import { toast } from "sonner"

interface HireRequest {
  id: string
  client_name: string
  email: string
  phone: string | null
  service_type: string
  budget: string | null
  preferred_date: string | null
  message: string
  status: "pending" | "approved" | "declined" | "completed"
  priority: "low" | "medium" | "high"
  created_at: string
  updated_at: string
  location: string | null
  style: string[]
  add_ons: string[]
  contact_preference: "email" | "phone" | "whatsapp"
  reference_images: string[]
  estimated_cost: number | null
}

export function HireManager() {
  const [hireRequests, setHireRequests] = useState<HireRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  // Fetch hire requests
  const fetchHireRequests = async () => {
    try {
      const response = await fetch('/api/hire')
      const result = await response.json()

      if (result.success) {
        setHireRequests(result.data)
      } else {
        toast.error('Failed to fetch hire requests')
      }
    } catch (error) {
      console.error('Error fetching hire requests:', error)
      toast.error('Failed to fetch hire requests')
    } finally {
      setLoading(false)
    }
  }

  // Update hire request status
  const updateHireRequestStatus = async (id: string, status: 'approved' | 'declined') => {
    setUpdating(id)
    try {
      const response = await fetch(`/api/hire/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Hire request ${status} successfully`)
        fetchHireRequests() // Refresh the list
      } else {
        toast.error(result.message || 'Failed to update hire request')
      }
    } catch (error) {
      console.error('Error updating hire request:', error)
      toast.error('Failed to update hire request')
    } finally {
      setUpdating(null)
    }
  }

  useEffect(() => {
    fetchHireRequests()
  }, [])

  // Calculate stats
  const stats = {
    total: hireRequests.length,
    pending: hireRequests.filter(r => r.status === 'pending').length,
    approved: hireRequests.filter(r => r.status === 'approved').length,
    potentialRevenue: hireRequests
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => {
        // Use estimated cost if available, otherwise parse budget
        if (r.estimated_cost) {
          return sum + r.estimated_cost
        }
        const budget = r.budget || '₦0'
        const amount = parseInt(budget.replace(/[^0-9]/g, '')) || 0
        return sum + amount
      }, 0)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 text-center">
              <div className="h-8 bg-muted rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-muted rounded animate-pulse"></div>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="h-32 bg-muted rounded animate-pulse"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total Requests</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
          <p className="text-sm text-muted-foreground">Approved</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">${stats.potentialRevenue.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Potential Revenue</p>
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button onClick={fetchHireRequests} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Hire Requests */}
      <div className="space-y-4">
        {hireRequests.length === 0 ? (
          <Card className="p-8 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hire requests found</p>
          </Card>
        ) : (
          hireRequests.map((request) => (
            <Card key={request.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif text-lg font-bold text-foreground">{request.client_name}</h3>
                      <Badge
                        variant={
                          request.status === "pending"
                            ? "secondary"
                            : request.status === "approved"
                              ? "default"
                              : request.status === "declined"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {request.status}
                      </Badge>
                      <Badge variant="outline">{request.service_type}</Badge>
                      <Badge variant={
                        request.priority === "high" ? "destructive" :
                        request.priority === "medium" ? "secondary" : "outline"
                      }>
                        {request.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Submitted: {new Date(request.created_at).toLocaleDateString()}</span>
                      </div>
                      {request.budget && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{request.budget}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => updateHireRequestStatus(request.id, 'approved')}
                      disabled={updating === request.id}
                    >
                      {updating === request.id ? (
                        <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-1" />
                      )}
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateHireRequestStatus(request.id, 'declined')}
                      disabled={updating === request.id}
                    >
                      {updating === request.id ? (
                        <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <X className="h-4 w-4 mr-1" />
                      )}
                      Decline
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{request.client_name}</span>
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
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Prefers: {request.contact_preference}</span>
                  </div>
                  {request.estimated_cost && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground font-semibold">Est. Cost: ₦{request.estimated_cost}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {request.preferred_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        Preferred: {new Date(request.preferred_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {request.budget && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Budget: {request.budget}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Service: {request.service_type}</span>
                  </div>
                  {request.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Location: {request.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Style Preferences */}
              {request.style && request.style.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Style Preferences:</h4>
                  <div className="flex flex-wrap gap-2">
                    {request.style.map((style, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {request.add_ons && request.add_ons.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Selected Add-ons:</h4>
                  <div className="flex flex-wrap gap-2">
                    {request.add_ons.map((addOn, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {addOn}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Reference Images */}
              {request.reference_images && request.reference_images.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Reference Images:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {request.reference_images.slice(0, 3).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Reference ${index + 1}`}
                        className="w-full h-16 object-cover rounded cursor-pointer hover:opacity-80"
                        onClick={() => window.open(image, "_blank")}
                      />
                    ))}
                    {request.reference_images.length > 3 && (
                      <div className="w-full h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                        +{request.reference_images.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">Project Description:</span>
                </div>
                <p className="text-foreground">{request.message}</p>
              </div>

              <div className="flex gap-2">
                {request.phone && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`https://wa.me/${request.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      WhatsApp
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${request.email}`}>
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </a>
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule Meeting
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

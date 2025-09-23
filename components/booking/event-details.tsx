"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface EventDetailsProps {
  bookingData: any
  updateBookingData: (data: any) => void
  onNext: () => void
}

export default function EventDetails({ bookingData, updateBookingData, onNext }: EventDetailsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Event Details</h2>
        <p className="text-muted-foreground">Tell us about your session preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="eventDate">Preferred Date</Label>
            <Input
              id="eventDate"
              type="date"
              value={bookingData.eventDate}
              onChange={(e) => updateBookingData({ eventDate: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventLocation">Location</Label>
            <Input
              id="eventLocation"
              placeholder="Studio, outdoor location, or your preference"
              value={bookingData.eventLocation}
              onChange={(e) => updateBookingData({ eventLocation: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialRequests">Special Requests or Notes</Label>
          <Textarea
            id="specialRequests"
            placeholder="Any specific ideas, themes, or requirements for your session..."
            value={bookingData.specialRequests}
            onChange={(e) => updateBookingData({ specialRequests: e.target.value })}
            rows={4}
          />
        </div>

        <Button type="submit" className="w-full">
          Continue to Contact Information
        </Button>
      </form>
    </div>
  )
}

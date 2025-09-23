"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface ContactInfoProps {
  bookingData: any
  updateBookingData: (data: any) => void
  onNext: () => void
}

export default function ContactInfo({ bookingData, updateBookingData, onNext }: ContactInfoProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
        <p className="text-muted-foreground">How can we reach you to confirm your booking?</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="clientName">Full Name</Label>
          <Input
            id="clientName"
            placeholder="Your full name"
            value={bookingData.clientName}
            onChange={(e) => updateBookingData({ clientName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientEmail">Email Address</Label>
          <Input
            id="clientEmail"
            type="email"
            placeholder="your.email@example.com"
            value={bookingData.clientEmail}
            onChange={(e) => updateBookingData({ clientEmail: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientPhone">Phone Number</Label>
          <Input
            id="clientPhone"
            type="tel"
            placeholder="(555) 123-4567"
            value={bookingData.clientPhone}
            onChange={(e) => updateBookingData({ clientPhone: e.target.value })}
          />
        </div>

        <Button type="submit" className="w-full">
          Review Booking
        </Button>
      </form>
    </div>
  )
}

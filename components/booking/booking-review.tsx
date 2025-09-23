"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, User, Mail, Phone, Package } from "lucide-react"
import { useRouter } from "next/navigation"

interface BookingReviewProps {
  bookingData: any
}

export default function BookingReview({ bookingData }: BookingReviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const depositAmount = (bookingData.packagePrice * 0.3).toFixed(2)
  const remainingAmount = (bookingData.packagePrice * 0.7).toFixed(2)

  const handleConfirmBooking = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        const result = await response.json()
        // Redirect to payment page with booking ID
        router.push(`/payment?bookingId=${result.data.id}&amount=${depositAmount}`)
      } else {
        throw new Error("Failed to create booking")
      }
    } catch (error) {
      console.error("Booking error:", error)
      alert("There was an error creating your booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Review Your Booking</h2>
        <p className="text-muted-foreground">Please review all details before confirming</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Service & Package Details */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Service Details
          </h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Service Type</p>
              <p className="font-medium capitalize">{bookingData.serviceType?.replace("-", " ")}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Package</p>
              <p className="font-medium">{bookingData.packageName}</p>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="font-medium">Total Price:</span>
              <span className="text-xl font-bold text-primary">${bookingData.packagePrice}</span>
            </div>
          </div>
        </Card>

        {/* Event Details */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Event Details
          </h3>

          <div className="space-y-3">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{new Date(bookingData.eventDate).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{bookingData.eventLocation}</span>
            </div>

            {bookingData.specialRequests && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Special Requests</p>
                <p className="text-sm">{bookingData.specialRequests}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Contact Information
          </h3>

          <div className="space-y-3">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{bookingData.clientName}</span>
            </div>

            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{bookingData.clientEmail}</span>
            </div>

            {bookingData.clientPhone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>{bookingData.clientPhone}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Breakdown</h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Deposit (30%)</span>
              <span className="font-medium">${depositAmount}</span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>Remaining Balance</span>
              <span>${remainingAmount}</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="font-medium">Due Today:</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                ${depositAmount}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground">
              The remaining balance will be due on the day of your session.
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="text-center">
          <h4 className="font-semibold mb-2">Ready to Confirm?</h4>
          <p className="text-sm text-muted-foreground mb-4">
            By confirming, you agree to pay the deposit and our terms of service.
          </p>

          <Button onClick={handleConfirmBooking} disabled={isSubmitting} size="lg" className="w-full md:w-auto px-8">
            {isSubmitting ? "Creating Booking..." : `Confirm & Pay $${depositAmount}`}
          </Button>
        </div>
      </Card>
    </div>
  )
}

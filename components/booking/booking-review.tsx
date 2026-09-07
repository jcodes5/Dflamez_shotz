"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, User, Mail, Phone, Package, MessageCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface BookingData {
  serviceType: string
  packageName: string
  packagePrice: number
  eventDate: string
  eventLocation: string
  specialRequests: string
  clientName: string
  clientEmail: string
  clientPhone: string
}

interface BookingReviewProps {
  bookingData: BookingData
  onNext?: () => void
  onPrev?: () => void
  isFirstStep?: boolean
  isLastStep?: boolean
  updateBookingData?: (data: Partial<BookingData>) => void
}

export default function BookingReview({ bookingData }: BookingReviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

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

      const result = await response.json()

      if (response.ok && result.success && result.data) {
        const booking = result.data
        const message = encodeURIComponent(
          [
            "Hi Dflamez! I would like to confirm this booking:",
            `Booking ID: ${booking.id}`,
            `Name: ${bookingData.clientName}`,
            `Email: ${bookingData.clientEmail}`,
            bookingData.clientPhone ? `Phone: ${bookingData.clientPhone}` : null,
            `Service: ${bookingData.serviceType?.replace("-", " ")}`,
            `Package: ${bookingData.packageName}`,
            `Event date: ${new Date(bookingData.eventDate).toLocaleDateString()}`,
            `Location: ${bookingData.eventLocation}`,
            `Total price: $${bookingData.packagePrice}`,
            `Deposit (30%): $${depositAmount}`,
            `Remaining balance: $${remainingAmount}`,
            bookingData.specialRequests ? `Special requests: ${bookingData.specialRequests}` : null,
            "",
            "I understand that payment and final confirmation will be handled directly with you on WhatsApp."
          ]
            .filter(Boolean)
            .join("\n"),
        )

        window.open(`https://wa.me/2348106643611?text=${message}`, "_blank")
        toast.success("Booking submitted! Opening WhatsApp...")
      } else {
        throw new Error(result.message || result.error || "Failed to create booking")
      }
    } catch (error) {
      console.error("Booking error:", error)
      toast.error(error instanceof Error ? error.message : "There was an error creating your booking. Please try again.")
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
            Your booking will be saved and sent to Dflamez on WhatsApp for confirmation. Payment arrangements will be
            handled directly with the admin.
          </p>

          <Button onClick={handleConfirmBooking} disabled={isSubmitting} size="lg" className="w-full md:w-auto px-8">
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Submitting...
              </>
            ) : (
              <>
                Send Booking via WhatsApp
                <MessageCircle className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}

"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, Mail, Phone } from "lucide-react"
import Link from "next/link"

function SuccessContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (bookingId) {
      // Fetch booking details
      fetch(`/api/bookings/${bookingId}`)
        .then((res) => res.json())
        .then((data) => {
          setBooking(data.data)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }, [bookingId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading booking details...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground">Your booking has been confirmed</p>
        </div>

        {booking && (
          <Card className="p-8 text-left mb-8">
            <h2 className="text-xl font-semibold mb-4">Booking Confirmation</h2>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-medium capitalize">{booking.service_type?.replace("-", " ")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Package</p>
                  <p className="font-medium">{booking.package_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(booking.event_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{booking.event_location}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span>Deposit Paid:</span>
                  <span className="font-bold text-green-600">${booking.deposit_amount}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Remaining Balance:</span>
                  <span>${(booking.package_price - booking.deposit_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-3">What's Next?</h3>
            <div className="space-y-3 text-sm text-left">
              <div className="flex items-start">
                <Mail className="w-4 h-4 mr-2 mt-0.5 text-primary" />
                <p>You'll receive a confirmation email with all booking details</p>
              </div>
              <div className="flex items-start">
                <Phone className="w-4 h-4 mr-2 mt-0.5 text-primary" />
                <p>Dflamez will contact you within 24 hours to discuss session details</p>
              </div>
              <div className="flex items-start">
                <Calendar className="w-4 h-4 mr-2 mt-0.5 text-primary" />
                <p>The remaining balance is due on the day of your session</p>
              </div>
            </div>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/gallery">View Gallery</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}

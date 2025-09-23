"use client"

import type React from "react"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"

interface PaymentFormProps {
  bookingId: string
  amount: number
}

export default function PaymentForm({ bookingId, amount }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setMessage("")

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?bookingId=${bookingId}`,
      },
    })

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An error occurred")
      } else {
        setMessage("An unexpected error occurred.")
      }
    }

    setIsLoading(false)
  }

  return (
    <Card className="p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Payment Details</h2>
          <div className="flex items-center text-sm text-muted-foreground">
            <Shield className="w-4 h-4 mr-1" />
            Secured by Stripe
          </div>
        </div>

        <div className="bg-primary/5 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <span className="font-medium">Deposit Amount:</span>
            <span className="text-2xl font-bold text-primary">${amount.toFixed(2)}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">30% deposit to secure your booking</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <PaymentElement />
        </div>

        {message && (
          <Alert variant="destructive">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Button type="submit" disabled={isLoading || !stripe || !elements} className="w-full h-12 text-lg">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Pay ${amount.toFixed(2)}
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Your payment information is secure and encrypted.</p>
            <p>You will receive a confirmation email after successful payment.</p>
          </div>
        </div>
      </form>
    </Card>
  )
}

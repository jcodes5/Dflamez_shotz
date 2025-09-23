"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CreditCard } from "lucide-react"
import { motion } from "framer-motion"

interface PaystackPaymentFormProps {
  bookingId: string
  amount: number
  customerEmail: string
  onSuccess: () => void
}

export function PaystackPaymentForm({ bookingId, amount, customerEmail, onSuccess }: PaystackPaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          email: customerEmail,
          amount,
        }),
      })

      const data = await response.json()

      if (data.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = data.authorization_url
      } else {
        throw new Error("Failed to initialize payment")
      }
    } catch (error) {
      console.error("Payment initialization error:", error)
      alert("Failed to initialize payment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Secure Payment
          </CardTitle>
          <CardDescription>Complete your booking with a secure payment via Paystack</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Deposit Amount:</span>
              <span className="font-semibold">₦{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Email:</span>
              <span className="text-sm">{customerEmail}</span>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay ₦{amount.toLocaleString()}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Your payment is secured by Paystack. You will be redirected to complete the payment.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

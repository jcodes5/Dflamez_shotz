import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const client = await createClient()
  if (!('from' in client)) {
    return NextResponse.json({ error: "Supabase client is not properly initialized" }, { status: 500 })
  }
  const supabase = client as SupabaseClient

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const { bookingId, paymentType } = paymentIntent.metadata

        // Update payment record
        await supabase
          .from("payments")
          .update({
            status: "completed",
            paid_at: new Date().toISOString(),
          })
          .eq("stripe_payment_intent_id", paymentIntent.id)

        // Update booking status if this is a deposit payment
        if (paymentType === "deposit") {
          await supabase
            .from("bookings")
            .update({
              deposit_paid: true,
              status: "confirmed",
            })
            .eq("id", bookingId)
        }

        console.log(`Payment succeeded for booking ${bookingId}`)
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Update payment record
        await supabase
          .from("payments")
          .update({
            status: "failed",
          })
          .eq("stripe_payment_intent_id", paymentIntent.id)

        console.log(`Payment failed for payment intent ${paymentIntent.id}`)
        break
      }

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

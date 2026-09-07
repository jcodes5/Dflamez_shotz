import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, amount, paymentType = "deposit" } = body

    // Validate required fields
    if (!bookingId || !amount) {
      return NextResponse.json({ error: "Missing booking ID or amount" }, { status: 400 })
    }

    const client = await createClient()
    if (!('from' in client)) {
      return NextResponse.json({ error: "Supabase client is not properly initialized" }, { status: 500 })
    }
    const supabase = client as SupabaseClient

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        bookingId,
        paymentType,
        clientEmail: booking.client_email,
        clientName: booking.client_name,
      },
      description: `${paymentType === "deposit" ? "Deposit" : "Payment"} for ${booking.service_type} - ${booking.package_name}`,
    })

    // Create payment record
    const { error: paymentError } = await supabase.from("payments").insert([
      {
        booking_id: bookingId,
        stripe_payment_intent_id: paymentIntent.id,
        amount,
        payment_type: paymentType,
        status: "pending",
      },
    ])

    if (paymentError) {
      console.error("Failed to create payment record:", paymentError)
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Payment intent creation error:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}

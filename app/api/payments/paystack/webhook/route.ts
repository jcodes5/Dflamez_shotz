import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-paystack-signature")

    // Verify webhook signature
    const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!).update(body).digest("hex")

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)

    if (event.event === "charge.success") {
      const { reference, amount, customer, metadata } = event.data
      const bookingId = metadata.booking_id

      const client = await createClient()
      if (!('from' in client)) {
        return NextResponse.json({ error: "Supabase client is not properly initialized" }, { status: 500 })
      }
      const supabase = client as SupabaseClient

      // Update payment status
      await supabase
        .from("payments")
        .update({
          status: "completed",
          payment_date: new Date().toISOString(),
          customer_email: customer.email,
        })
        .eq("payment_reference", reference)

      // Update booking status
      await supabase
        .from("bookings")
        .update({
          status: "confirmed",
          payment_status: "deposit_paid",
        })
        .eq("id", bookingId)

      console.log(`Payment completed for booking ${bookingId}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Paystack webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

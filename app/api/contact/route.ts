import { type NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient, isSupabaseConfigured, isAuthenticatedAdmin } from "@/lib/supabase/server"

// Simple in-memory rate limiting (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_MAX = 5 // Max requests
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes in milliseconds

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone format (basic)
function isValidPhone(phone: string): boolean {
  if (!phone) return true // Phone is optional
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

// Rate limiting function
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(ip)
  
  if (!record || record.resetTime < now) {
    // Create new record
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return false
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    // Rate limited
    return true
  }
  
  // Increment count
  record.count++
  return false
}

// Clean up old rate limit records
function cleanupRateLimitStore() {
  const now = Date.now()
  for (const [ip, record] of rateLimitStore.entries()) {
    if (record.resetTime < now) {
      rateLimitStore.delete(ip)
    }
  }
}

// Send email notification (placeholder - implement with your email service)
async function sendEmailNotification(contactData: any) {
  try {
    // In a real implementation, you would integrate with an email service like:
    // - SendGrid
    // - Nodemailer with SMTP
    // - Resend
    // - AWS SES
    
    // Example with a generic email service:
    /*
    await fetch('https://api.emailservice.com/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`
      },
      body: JSON.stringify({
        to: process.env.ADMIN_EMAIL,
        from: process.env.FROM_EMAIL,
        subject: `New Contact Form Submission from ${contactData.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          ${contactData.phone ? `<p><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
          <p><strong>Inquiry Type:</strong> ${contactData.inquiry_type}</p>
          <p><strong>Message:</strong></p>
          <p>${contactData.message}</p>
        `
      })
    });
    */
    
    // Custom response message instead of console.log
    return true;
  } catch (error) {
    console.error("Failed to send email notification:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    
    // Check rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." }, 
        { status: 429 }
      )
    }
    
    let body;
    try {
      body = await request.json()
    } catch (jsonError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" }, 
        { status: 400 }
      )
    }
    
    const { name, email, phone, message, inquiryType = "general" } = body

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required and must be a valid string" }, 
        { status: 400 }
      )
    }

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid email is required" }, 
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required and must be a valid string" }, 
        { status: 400 }
      )
    }

    // Validate optional fields
    if (phone && (typeof phone !== 'string' || !isValidPhone(phone))) {
      return NextResponse.json(
        { error: "Phone number format is invalid" }, 
        { status: 400 }
      )
    }

    // Validate inquiry type
    const validInquiryTypes = ["general", "booking", "portfolio", "services", "other"]
    if (inquiryType && !validInquiryTypes.includes(inquiryType)) {
      return NextResponse.json(
        { error: "Invalid inquiry type" }, 
        { status: 400 }
      )
    }

    // Limit message length
    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message is too long. Maximum 5000 characters allowed." }, 
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      console.warn("Supabase is not configured. Skipping database insertion.")
      return NextResponse.json(
        { 
          success: true, 
          message: "Thank you for your message! I'll get back to you within 24 hours." 
        },
        { status: 201 }
      )
    }

    // Use service role client to bypass RLS for public form submissions
    const supabase = createServiceRoleClient()

    // Type guard to ensure supabase client has the 'from' method
    if (typeof supabase !== 'object' || !('from' in supabase) || typeof supabase.from !== 'function') {
      console.error("Supabase client is not properly configured")
      return NextResponse.json({ error: "Database not available" }, { status: 500 })
    }

    // Insert the contact inquiry into the database
    // Using service role key or bypassing RLS by directly inserting
    const { data, error } = await supabase
      .from("client_inquiries")
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone ? phone.trim() : null,
          message: message.trim(),
          inquiry_type: inquiryType,
          status: "new",
        },
      ])
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
    }

    // Send email notification
    await sendEmailNotification(data[0]);

    // Clean up old rate limit records periodically
    if (Math.random() < 0.1) { // 10% chance to cleanup
      cleanupRateLimitStore()
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message! I'll get back to you within 24 hours.",
        data: data[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticatedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      return NextResponse.json({ 
        contacts: [], 
        count: 0,
        message: "Database not configured"
      })
    }

    // Use service role client to bypass RLS for admin access
    const supabase = createServiceRoleClient()
    
    // Type guard to ensure supabase client has the 'from' method
    if (typeof supabase !== 'object' || !('from' in supabase) || typeof supabase.from !== 'function') {
      console.error("Supabase client is not properly configured")
      return NextResponse.json({ error: "Database not available" }, { status: 500 })
    }
    
    // Get authorization header for admin access
    const authHeader = request.headers.get('authorization')
    const isAdmin = authHeader === `Bearer ${process.env.ADMIN_API_KEY}`
    
    let query = supabase
      .from("client_inquiries")
      .select("*")
      .order("created_at", { ascending: false })
    
    // If not admin, limit results
    if (!isAdmin) {
      query = query.limit(10)
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch contact inquiries" }, { status: 500 })
    }

    // Return different responses based on user type
    const response = {
      contacts: data,
      count: data.length
    };

    return NextResponse.json(response)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Add PUT method to update contact inquiry status
export async function PUT(request: NextRequest) {
  try {
    if (!(await isAuthenticatedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    // Use service role client to bypass RLS for admin operations
    const supabase = createServiceRoleClient()
    
    // Type guard to ensure supabase client has the 'from' method
    if (typeof supabase !== 'object' || !('from' in supabase) || typeof supabase.from !== 'function') {
      console.error("Supabase client is not properly configured")
      return NextResponse.json({ error: "Database not available" }, { status: 500 })
    }
    
    // In a real implementation, you would check for admin authentication here
    // For now, we'll just demonstrate the structure
    
    let body;
    try {
      body = await request.json()
    } catch (jsonError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" }, 
        { status: 400 }
      )
    }
    
    const { id, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Contact inquiry ID is required" }, 
        { status: 400 }
      )
    }

    const validStatuses = ["new", "in-progress", "resolved", "archived"]
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" }, 
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("client_inquiries")
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update contact inquiry" }, { status: 500 })
    }

    if (data.length === 0) {
      return NextResponse.json({ error: "Contact inquiry not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Contact inquiry updated successfully",
      data: data[0]
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Add DELETE method to remove contact inquiries (admin only)
export async function DELETE(request: NextRequest) {
  try {
    if (!(await isAuthenticatedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    // Use service role client to bypass RLS for admin operations
    const supabase = createServiceRoleClient()
    
    // Type guard to ensure supabase client has the 'from' method
    if (typeof supabase !== 'object' || !('from' in supabase) || typeof supabase.from !== 'function') {
      console.error("Supabase client is not properly configured")
      return NextResponse.json({ error: "Database not available" }, { status: 500 })
    }
    
    // In a real implementation, you would check for admin authentication here
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Contact inquiry ID is required" }, 
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("client_inquiries")
      .delete()
      .eq('id', id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to delete contact inquiry" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Contact inquiry deleted successfully"
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
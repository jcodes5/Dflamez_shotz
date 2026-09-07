import { type NextRequest, NextResponse } from "next/server"
import { createApiRouteClient, isAuthenticatedAdmin } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"


// Validation function for hire request data
function validateHireRequest(data: any) {
  const errors: string[] = []

  if (!data.clientName || typeof data.clientName !== 'string' || data.clientName.trim().length < 2) {
    errors.push("Client name is required and must be at least 2 characters")
  }

  if (!data.email || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Valid email address is required")
  }

  if (!data.serviceType || typeof data.serviceType !== 'string' || data.serviceType.trim().length === 0) {
    errors.push("Service type is required")
  }

  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10) {
    errors.push("Message is required and must be at least 10 characters")
  }

  if (!data.style || !Array.isArray(data.style) || data.style.length === 0) {
    errors.push("At least one photography style must be selected")
  }

  if (data.phone && (typeof data.phone !== 'string' || data.phone.length > 50)) {
    errors.push("Phone number must be less than 50 characters")
  }

  if (data.budget && (typeof data.budget !== 'string' || data.budget.length > 50)) {
    errors.push("Budget must be less than 50 characters")
  }

  if (data.location && (typeof data.location !== 'string' || data.location.length > 200)) {
    errors.push("Location must be less than 200 characters")
  }

  if (data.preferredDate && isNaN(Date.parse(data.preferredDate))) {
    errors.push("Preferred date must be a valid date")
  }

  if (data.contactPreference && !['email', 'phone', 'whatsapp'].includes(data.contactPreference)) {
    errors.push("Contact preference must be one of: email, phone, whatsapp")
  }

  return errors
}

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json({
        success: false,
        message: "Supabase is not configured"
      }, { status: 500 })
    }
    
    const client = createApiRouteClient()
    // Type guard to ensure we have a proper Supabase client
    if (!('from' in client)) {
      return NextResponse.json({
        success: false,
        message: "Supabase client is not properly initialized"
      }, { status: 500 })
    }
    
    const supabase = client as SupabaseClient
    const body = await request.json()

    // Validate input data
    const validationErrors = validateHireRequest(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      }, { status: 400 })
    }

    // Insert hire request into database
  const { data, error } = await supabase
    .from('hire_requests')
    .insert({
      client_name: body.clientName.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || null,
      service_type: body.serviceType.trim(),
      budget: body.budget?.trim() || null,
      preferred_date: body.preferredDate ? new Date(body.preferredDate).toISOString().split('T')[0] : null,
      message: body.message.trim(),
      status: 'pending',
      priority: body.priority || 'medium',
      location: body.location?.trim() || null,
      style: body.style || [],
      add_ons: body.addOns || [],
      contact_preference: body.contactPreference || 'email',
      reference_images: body.referenceImages || [],
      estimated_cost: body.estimatedCost || null
    })
    .select()
    .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        message: "Failed to create hire request"
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Hire request submitted successfully",
      data: data
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticatedAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!isSupabaseConfigured) {
      return NextResponse.json({
        success: false,
        message: "Supabase is not configured"
      }, { status: 500 })
    }
    
    const client = createApiRouteClient()
    // Type guard to ensure we have a proper Supabase client
    if (!('from' in client)) {
      return NextResponse.json({
        success: false,
        message: "Supabase client is not properly initialized"
      }, { status: 500 })
    }
    
    const supabase = client as SupabaseClient
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('hire_requests')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        message: "Failed to fetch hire requests"
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data,
      total: count,
      limit,
      offset
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 })
  }
}
import { type NextRequest, NextResponse } from "next/server"
import { createApiRouteClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"

// Validation function for hire request updates
function validateHireRequestUpdate(data: any) {
  const errors: string[] = []

  if (data.clientName && (typeof data.clientName !== 'string' || data.clientName.trim().length < 2)) {
    errors.push("Client name must be at least 2 characters")
  }

  if (data.email && (typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))) {
    errors.push("Valid email address is required")
  }

  if (data.serviceType && (typeof data.serviceType !== 'string' || data.serviceType.trim().length === 0)) {
    errors.push("Service type is required")
  }

  if (data.message && (typeof data.message !== 'string' || data.message.trim().length < 10)) {
    errors.push("Message must be at least 10 characters")
  }

  if (data.phone && (typeof data.phone !== 'string' || data.phone.length > 50)) {
    errors.push("Phone number must be less than 50 characters")
  }

  if (data.budget && (typeof data.budget !== 'string' || data.budget.length > 50)) {
    errors.push("Budget must be less than 50 characters")
  }

  if (data.preferredDate && isNaN(Date.parse(data.preferredDate))) {
    errors.push("Preferred date must be a valid date")
  }

  if (data.status && !['pending', 'approved', 'declined', 'completed'].includes(data.status)) {
    errors.push("Status must be one of: pending, approved, declined, completed")
  }

  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.push("Priority must be one of: low, medium, high")
  }

  return errors
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      return NextResponse.json({
        success: false,
        message: "Supabase is not configured"
      }, { status: 500 })
    }
    
    const supabase = createApiRouteClient()
    
    // Type guard to ensure supabase client has the required methods
    if (!('from' in supabase)) {
      return NextResponse.json({
        success: false,
        message: "Supabase client is not properly configured"
      }, { status: 500 })
    }

    const typedSupabase = supabase as SupabaseClient

    const { data, error } = await typedSupabase
      .from('hire_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        message: "Hire request not found"
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      return NextResponse.json({
        success: false,
        message: "Supabase is not configured"
      }, { status: 500 })
    }
    
    const supabase = createApiRouteClient()
    
    // Type guard to ensure supabase client has the required methods
    if (!('from' in supabase)) {
      return NextResponse.json({
        success: false,
        message: "Supabase client is not properly configured"
      }, { status: 500 })
    }

    const typedSupabase = supabase as SupabaseClient

    // Validate input data
    const validationErrors = validateHireRequestUpdate(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      }, { status: 400 })
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (body.clientName !== undefined) updateData.client_name = body.clientName.trim()
    if (body.email !== undefined) updateData.email = body.email.trim().toLowerCase()
    if (body.phone !== undefined) updateData.phone = body.phone?.trim() || null
    if (body.serviceType !== undefined) updateData.service_type = body.serviceType.trim()
    if (body.budget !== undefined) updateData.budget = body.budget?.trim() || null
    if (body.preferredDate !== undefined) updateData.preferred_date = body.preferredDate ? new Date(body.preferredDate).toISOString().split('T')[0] : null
    if (body.message !== undefined) updateData.message = body.message.trim()
    if (body.status !== undefined) updateData.status = body.status
    if (body.priority !== undefined) updateData.priority = body.priority

    // Update hire request
    const { data, error } = await typedSupabase
      .from('hire_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        message: "Failed to update hire request"
      }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({
        success: false,
        message: "Hire request not found"
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Hire request updated successfully",
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      return NextResponse.json({
        success: false,
        message: "Supabase is not configured"
      }, { status: 500 })
    }
    
    const supabase = createApiRouteClient()
    
    // Type guard to ensure supabase client has the required methods
    if (!('from' in supabase)) {
      return NextResponse.json({
        success: false,
        message: "Supabase client is not properly configured"
      }, { status: 500 })
    }

    const typedSupabase = supabase as SupabaseClient

    const { error } = await typedSupabase
      .from('hire_requests')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        message: "Failed to delete hire request"
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Hire request deleted successfully"
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 })
  }
}
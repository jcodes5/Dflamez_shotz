"use server"

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import bcrypt from "bcryptjs"

export async function initAdminUser() {
  // Debug: Log environment variable availability
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'FOUND' : 'MISSING')
  console.log('Supabase Service Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

  // Check if required environment variables are set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: Missing required Supabase environment variables')
    return { success: false, error: 'Missing Supabase environment variables' }
  }

  // Create a proper Supabase client for server-side scripts using service role key
  const supabase: SupabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  
  // Check if admin user already exists
  const { data: existingAdmins, error: fetchError } = await supabase
    .from('admins')
    .select('id')
    .limit(1)
  
  if (fetchError) {
    console.error('Error checking for existing admin:', fetchError)
    return { success: false, error: 'Failed to check existing admins' }
  }
  
  // If admin already exists, don't create a new one
  if (existingAdmins && existingAdmins.length > 0) {
    console.log('Admin user already exists')
    return { success: true, message: 'Admin user already exists' }
  }
  
  // Hash the password
  const saltRounds = 10
  const plainPassword = "goldsdashboard2025"
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)
  
  // Create the admin user
  const { data, error } = await supabase
    .from('admins')
    .insert([
      {
        email: "dflamez@example.com",
        password_hash: hashedPassword,
        full_name: "Dflamez Admin"
      }
    ])
    .select()
  
  if (error) {
    console.error('Error creating admin user:', error)
    return { success: false, error: 'Failed to create admin user' }
  }
  
  console.log('Admin user created successfully')
  return { success: true, data }
}
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

  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase()
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD

  if (!adminEmail || !adminPassword || adminPassword.length < 12) {
    return {
      success: false,
      error: 'Set AUTH_ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD (at least 12 characters)',
    }
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
  
  const { data: authUsers, error: authUsersError } = await supabase.auth.admin.listUsers()

  if (authUsersError) {
    console.error('Error checking Supabase Auth users:', authUsersError)
    return { success: false, error: 'Failed to check Supabase Auth users' }
  }

  const authUser = authUsers.users.find((user) => user.email?.toLowerCase() === adminEmail)

  if (!authUser) {
    const { error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      app_metadata: { role: 'admin' },
    })

    if (authError) {
      console.error('Error creating Supabase Auth user:', authError)
      return { success: false, error: 'Failed to create Supabase Auth user' }
    }
  } else {
    const { error: authError } = await supabase.auth.admin.updateUserById(authUser.id, {
      password: adminPassword,
      app_metadata: { ...authUser.app_metadata, role: 'admin' },
      email_confirm: true,
    })

    if (authError) {
      console.error('Error updating Supabase Auth user:', authError)
      return { success: false, error: 'Failed to update Supabase Auth user' }
    }
  }

  if (existingAdmins && existingAdmins.length > 0) {
    console.log('Admin user already exists')
    return { success: true, message: 'Admin user already exists' }
  }
  
  // Hash the password
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(adminPassword, saltRounds)
  
  // Create the admin user
  const { data, error } = await supabase
    .from('admins')
    .insert([
      {
        email: adminEmail,
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
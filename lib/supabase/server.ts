import { createServerComponentClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { cache } from "react"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

// Create a cached version of the Supabase client for Server Components
export const createClient = cache(() => {
  // Check if we're in a request context before accessing cookies
  let cookieStore;
  try {
    cookieStore = cookies()
  } catch (error) {
    // If we're outside a request context (e.g., in a script), return a dummy client
    if (!isSupabaseConfigured) {
      console.warn("Supabase environment variables are not set. Using dummy client.")
      return {
        auth: {
          getUser: () => Promise.resolve({ data: { user: null }, error: null }),
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        },
      }
    }
    
    // For server-side scripts, we create a client without cookies
    // This is needed for setup scripts that run outside request context
    return createServerComponentClient({ 
      cookies: () => Promise.resolve({
        getAll: () => [],
        get: () => undefined,
        set: () => undefined,
        delete: () => undefined,
        has: () => false,
        [Symbol.iterator]: function* () {
          // Empty iterator
        },
        size: 0,
      } as unknown as ReturnType<typeof cookies>)
    })
  }

  if (!isSupabaseConfigured) {
    console.warn("Supabase environment variables are not set. Using dummy client.")
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
    }
  }

  return createServerComponentClient({ cookies: () => cookieStore })
})

// Create a client specifically for API routes that properly handles cookies
export const createApiRouteClient = () => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase environment variables are not set. Using dummy client.")
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
    }
  }

  // For API routes, we need to properly await cookies
  return createRouteHandlerClient({ cookies })
}

// Create a service role client that can bypass RLS - for server-side operations only
export const createServiceRoleClient = () => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase environment variables are not set. Using dummy client.")
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
    }
  }

  // Use the service role key to bypass RLS
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!serviceRoleKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY not set. Falling back to anon key.")
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  // Create a client with the service role key that can bypass RLS
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  )
}
import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const response = NextResponse.json({ success: true })
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.headers.get("cookie")?.split("; ").map((cookie) => {
              const [name, ...value] = cookie.split("=")
              return { name, value: value.join("=") }
            }) ?? []
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, {
                ...options,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
              })
            })
          },
        },
      },
    )

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (error || !data.user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const serviceRoleClient = createServiceRoleClient() as ReturnType<typeof createServiceRoleClient> & {
      from: (table: string) => any
    }
    const { data: admin, error: adminError } = await serviceRoleClient
      .from("admins")
      .select("id")
      .eq("email", data.user.email)
      .maybeSingle()

    const isAdmin = data.user.app_metadata?.role === "admin" || Boolean(admin && !adminError)

    if (!isAdmin) {
      await supabase.auth.signOut()
      return NextResponse.json({ error: "You are not authorized to access the admin dashboard" }, { status: 403 })
    }

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Unable to sign in" }, { status: 500 })
  }
}
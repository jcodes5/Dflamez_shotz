import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
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

  await supabase.auth.signOut()
  return response
}
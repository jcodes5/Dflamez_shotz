"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated on mount
    const authToken = localStorage.getItem("adminAuth")
    setIsAuthenticated(authToken === "authenticated")
    setIsLoading(false)

    // Redirect to login if trying to access admin without auth
    if (pathname?.startsWith("/admin") && authToken !== "authenticated") {
      router.push("/login")
    }
  }, [pathname, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple authentication check (in a real app, this would be server-side)
    if (email === "dfalmez@example.com" && password === "goldsdashboard2024") {
      localStorage.setItem("adminAuth", "authenticated")
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem("adminAuth")
    setIsAuthenticated(false)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

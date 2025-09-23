"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface MobileOptimizedCardProps {
  children: ReactNode
  className?: string
  padding?: "sm" | "md" | "lg"
}

export function MobileOptimizedCard({ children, className = "", padding = "md" }: MobileOptimizedCardProps) {
  const paddingClasses = {
    sm: "p-3 sm:p-4 lg:p-6",
    md: "p-4 sm:p-6 lg:p-8",
    lg: "p-6 sm:p-8 lg:p-12",
  }

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className={`${paddingClasses[padding]} ${className}`}>{children}</Card>
    </motion.div>
  )
}

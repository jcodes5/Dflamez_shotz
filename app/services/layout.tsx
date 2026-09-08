import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Photography & Videography Services",
  description: "Explore Dflamez Photography Afrocentric editorial, fashion, and cultural storytelling services.",
  alternates: { canonical: "/services" },
}

export default function ServicesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Photography & Videography Services",
  description: "Explore Dflamez Shotz photography, soul portrait, and cinematic videography services.",
  alternates: { canonical: "/services" },
}

export default function ServicesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
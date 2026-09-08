import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book a Photography Session",
  description: "Book an editorial or fashion session with Dflamez Photography and plan your next story.",
  alternates: { canonical: "/book" },
}

export default function BookLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
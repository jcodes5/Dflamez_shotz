import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book a Photography Session",
  description: "Book a photography session with Dflamez Shotz and plan your next visual story.",
  alternates: { canonical: "/book" },
}

export default function BookLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
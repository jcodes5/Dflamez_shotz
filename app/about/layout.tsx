import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About the Artist",
  description: "Meet Dflamez Shotz, a soul portraitor and visual storyteller based in Akure, Nigeria.",
  alternates: { canonical: "/about" },
}

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gold's Pen | Photography & Creativity Journal",
  description: "Thoughts, insights, and stories about photography, creativity, and visual storytelling from Dflamez Shotz.",
  alternates: { canonical: "/blog" },
}

export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
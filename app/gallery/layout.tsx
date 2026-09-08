import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Photography Gallery",
  description: "View selected Afrocentric editorials, fashion stories, and cultural work by Dflamez Photography.",
  alternates: { canonical: "/gallery" },
}

export default function GalleryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
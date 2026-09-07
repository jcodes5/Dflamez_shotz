import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Photography Gallery",
  description: "View selected soul portraits, artistic photography, and cinematic work by Dflamez Shotz.",
  alternates: { canonical: "/gallery" },
}

export default function GalleryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
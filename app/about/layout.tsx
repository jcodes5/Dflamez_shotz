import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About the Artist",
  description: "Meet Dflamez Photography, an Afrocentric editorial & fashion photographer based in Lagos + Akure, Nigeria.",
  alternates: { canonical: "/about" },
}

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Dflamez Photography",
  description: "Get in touch with Dflamez Photography in Lagos + Akure, Nigeria, about editorial, fashion, and collabs.",
  alternates: { canonical: "/contact" },
}

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
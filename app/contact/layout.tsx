import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Dflamez Shotz",
  description: "Get in touch with Dflamez Shotz in Akure, Nigeria, about portraits, photography, and visual projects.",
  alternates: { canonical: "/contact" },
}

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hire Dflamez Shotz",
  description: "Tell Dflamez Shotz about your photography or visual storytelling project and request a quote.",
  alternates: { canonical: "/hire" },
}

export default function HireLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
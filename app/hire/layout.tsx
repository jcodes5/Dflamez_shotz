import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hire Dflamez Photography",
  description: "Tell Dflamez Photography about your editorial or fashion project and request a quote.",
  alternates: { canonical: "/hire" },
}

export default function HireLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
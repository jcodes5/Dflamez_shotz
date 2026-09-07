import type React from "react"
import type { Metadata } from "next"
import { Allura, Bodoni_Moda, Cormorant_Garamond, Manrope, Sora } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { SiteFooter } from "@/components/site-footer"

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant-garamond",
  weight: ["400", "500", "600", "700"],
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
})

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bodoni-moda",
  weight: ["400", "500", "600", "700"],
})

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
  weight: ["400", "500", "600", "700"],
})

const allura = Allura({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-allura",
  weight: "400",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://dflamezshotz.com"),
  title: {
    default: "Dflamez Shotz | Soul Portraits & Visual Stories",
    template: "%s | Dflamez Shotz",
  },
  description:
    "Dflamez Shotz creates soulful portraits, photography, and cinematic visual stories in Akure, Nigeria.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Dflamez Shotz",
    title: "Dflamez Shotz | Soul Portraits & Visual Stories",
    description:
      "Soulful portraits, photography, and cinematic visual stories by Dflamez Shotz.",
    images: [{ url: "/dflamez.png", width: 1200, height: 1200, alt: "Dflamez Shotz portrait" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dflamez Shotz | Soul Portraits & Visual Stories",
    description: "Soulful portraits and cinematic visual stories by Dflamez Shotz.",
    images: ["/dflamez.png"],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${manrope.variable} ${bodoniModa.variable} ${sora.variable} ${allura.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="dflamez-theme"
        >
          <AuthProvider>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "ProfessionalService",
                  name: "Dflamez Shotz",
                  description: "Soul portraits, photography, and cinematic visual storytelling.",
                  url: process.env.NEXT_PUBLIC_SITE_URL || "https://dflamezshotz.com",
                  image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://dflamezshotz.com"}/dflamez.png`,
                  email: "hello@dflamezshotz.com",
                  telephone: "+2348106643611",
                  address: { "@type": "PostalAddress", addressLocality: "Akure", addressCountry: "NG" },
                  sameAs: [
                    "https://instagram.com/dflamez.shotz",
                    "https://facebook.com/dflamez.shotz",
                    "https://twitter.com/dflamez_shotz",
                  ],
                }),
              }}
            />
            {children}
            <SiteFooter />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

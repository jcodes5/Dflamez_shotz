import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"

export default function HomePage() {
  return (
    <main className="home-page min-h-screen bg-background">
      <Navbar />
      <HeroSection />
    </main>
  )
}

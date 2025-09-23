import { Navbar } from "@/components/navbar"
import { GalleryGrid } from "@/components/gallery-grid"

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h1 className="font-serif text-5xl font-black tracking-tight text-foreground sm:text-7xl mb-6">
            <span className="block">MY</span>
            <span className="block text-primary transform -rotate-1 inline-block">GALLERY</span>
          </h1>
          <p className="text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
            Explore my collection of soul portraits, cinematic videography, and artistic photography. Each piece tells a
            unique story and captures the essence of the human experience.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16">
        <GalleryGrid />
      </section>
    </main>
  )
}

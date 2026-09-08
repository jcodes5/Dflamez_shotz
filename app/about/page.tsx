import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Quote, Star, Heart, Camera } from "lucide-react"
import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"

const testimonials = [
  {
    name: "Olasupo Kayode",
    role: "Student",
    content:
      "Dflamez captured my soul in a way I never thought possible. The portrait session was transformative and the final result exceeded all my expectations.",
    rating: 5,
  },
  {
    name: "Oluwatimilehin",
    role: "Artist",
    content:
      "Working with Dflamez was an incredible experience. She has this unique ability to see beyond the surface and capture the true essence of who you are.",
    rating: 5,
  },
  {
    name: "Akingbade Gold",
    role: "Model",
    content:
      "The videography work for my brand was absolutely stunning. Dflamez brought my vision to life with such creativity and professionalism.",
    rating: 5,
  },
]

export default function AboutPage() {
  return (
    <main className="about-page min-h-screen bg-background">
      <Navbar />
      <Breadcrumbs items={[{ label: "About" }]} />

      {/* Hero Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-serif text-5xl font-black tracking-tight text-foreground sm:text-7xl mb-6">
                <span className="block">ABOUT</span>
                <span className="text-primary transform -rotate-1 inline-block">DFLAMEZ</span>
              </h1>
              <p className="editorial-kicker mb-4">Dflamez Photography · Lagos + Akure, NG</p>
              <p className="text-xl leading-8 text-muted-foreground mb-8">
                Afrocentric Editorial &amp; Fashion Photographer — available for collabs &amp; travel
              </p>
              <div className="flex gap-4">
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                  <Link href="/contact">GET IN TOUCH</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold bg-transparent"
                >
                  <Link href="/gallery">VIEW MY WORK</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden transform rotate-2">
                <img
                  src="/dflamez.png"
                  alt="Dflamez Photography portrait"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary rounded-lg flex items-center justify-center transform -rotate-12">
                <Camera className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-black text-foreground mb-6">MY STORY</h2>
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-8 text-foreground mb-6">
              I&apos;m Dflamez Shotz of Dflamez Photography, and I believe every person carries a universe of heritage
              within them. My journey as an Afrocentric editorial &amp; fashion photographer began when I realized
              traditional photography wasn&apos;t celebrating what I truly saw in people — their roots, their skin,
              their style, their inner light.
            </p>
            <p className="text-lg leading-8 text-foreground mb-6">
              What started as a passion for authentic moments evolved into bold editorials and fashion stories. I
              don&apos;t just take pictures; I create visual narratives that celebrate African identity. Each session
              is a collaboration — from moodboard to styling to the final frame — revealing not just how you look, but
              who you truly are.
            </p>
            <p className="text-lg leading-8 text-foreground mb-6">
              My work majors in Afrocentric editorials, fashion &amp; beauty, and cultural storytelling — rooted
              in soul portraiture, which I still offer. Based between Lagos and Akure and available for collabs
              &amp; travel, my approach remains the same: authentic, intentional, and deeply rooted.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl font-black text-foreground mb-6">
                <span className="block">MY</span>
                <span className="text-primary transform rotate-1 inline-block">PHILOSOPHY</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 transform rotate-3">
                    <Heart className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">Authentic Connection</h3>
                    <p className="text-muted-foreground">
                      Every great portrait begins with genuine connection. I take time to understand your story, your
                      dreams, and what makes you uniquely you.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-card border-2 border-primary rounded-lg flex items-center justify-center flex-shrink-0 transform -rotate-2">
                    <Quote className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">Visual Storytelling</h3>
                    <p className="text-muted-foreground">
                      Each image should tell a story. Through composition, lighting, and moment, I craft visual
                      narratives that speak to the soul.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 transform rotate-1">
                    <Star className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">Timeless Artistry</h3>
                    <p className="text-muted-foreground">
                      Trends fade, but authentic artistry endures. I create images that will be treasured for
                      generations to come.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden transform -rotate-1">
                <img
                  src="/bw-emotional-portrait.png"
                  alt="Artistic Portrait Example"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-black text-foreground mb-6">CLIENT LOVE</h2>
            <p className="text-xl text-muted-foreground">What people say about working with me</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`p-6 transform transition-all duration-300 hover:scale-105 ${
                  index % 3 === 0 ? "rotate-1" : index % 3 === 1 ? "-rotate-1" : "rotate-2"
                }`}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-foreground mb-4 italic">"{testimonial.content}"</blockquote>
                <div>
                  <div className="font-bold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

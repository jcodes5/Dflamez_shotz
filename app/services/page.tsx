"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, Video, Camera, Clock, Zap, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Palette,
    title: "Soul Portraits",
    description: "Deep, meaningful portraits that capture the essence of who you are beyond the surface.",
    features: [
      "Pre-session consultation",
      "2-3 hour intimate session",
      "Professional lighting setup",
      "20+ edited high-resolution images",
      "Personal styling guidance",
      "Print release included",
    ],
    pricing: "Starting at $450",
    duration: "2-3 hours",
    deliverables: "20+ images",
    popular: true,
  },
  {
    icon: Video,
    title: "Cinematic Videography",
    description: "Storytelling through motion - capturing life's most important moments with cinematic quality.",
    features: [
      "Pre-production planning",
      "Professional cinema cameras",
      "Drone footage (when applicable)",
      "Color grading & post-production",
      "Multiple format delivery",
      "Music licensing included",
    ],
    pricing: "Starting at $850",
    duration: "Full day",
    deliverables: "Edited video + raw footage",
    popular: false,
  },
  {
    icon: Camera,
    title: "Artistic Photography",
    description: "Creative photography sessions for personal branding, events, or artistic expression.",
    features: [
      "Creative concept development",
      "Location scouting",
      "Professional equipment",
      "Advanced editing & retouching",
      "Multiple style options",
      "Commercial usage rights",
    ],
    pricing: "Starting at $350",
    duration: "1-2 hours",
    deliverables: "15+ images",
    popular: false,
  },
]

const addOns = [
  { name: "Additional edited images", price: "$25 each" },
  { name: "Rush delivery (48 hours)", price: "$150" },
  { name: "Professional hair & makeup", price: "$200" },
  { name: "Second location", price: "$100" },
  { name: "Extended session (+1 hour)", price: "$150" },
  { name: "Print package", price: "$200-500" },
]

const handleHireClick = () => {
  window.open("https://wa.me/business/dflamez-shotz", "_blank")
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h1 className="font-serif text-5xl font-black tracking-tight text-foreground sm:text-7xl mb-6">
            <span className="block">MY</span>
            <span className="block text-primary transform -rotate-1 inline-block">SERVICES</span>
          </h1>
          <p className="text-xl leading-8 text-muted-foreground max-w-2xl mx-auto mb-8">
            Professional photography and videography services designed to capture your authentic self and tell your
            unique story.
          </p>
          <Button
            onClick={handleHireClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 py-4 text-lg transform hover:scale-105 transition-transform"
          >
            START YOUR PROJECT
            <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className={`relative p-8 transform transition-all duration-300 hover:scale-105 ${
                  index % 3 === 0 ? "rotate-1" : index % 3 === 1 ? "-rotate-1" : "rotate-2"
                }`}
              >
                {service.popular && (
                  <Badge className="absolute -top-3 left-6 bg-primary text-primary-foreground font-bold">
                    MOST POPULAR
                  </Badge>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center transform rotate-3">
                    <service.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-foreground">{service.title}</h3>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">{service.description}</p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">{service.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">{service.deliverables}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <h4 className="font-bold text-foreground">What's Included:</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-2xl font-bold text-primary">{service.pricing}</span>
                  </div>
                  <Button
                    onClick={handleHireClick}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                  >
                    BOOK NOW
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-black text-foreground mb-6">
              <span className="block">ENHANCE YOUR</span>
              <span className="block text-primary transform rotate-1 inline-block">EXPERIENCE</span>
            </h2>
            <p className="text-xl text-muted-foreground">Optional add-ons to make your session even more special</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addOns.map((addon, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
              >
                <span className="font-medium text-foreground">{addon.name}</span>
                <span className="font-bold text-primary">{addon.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-black text-foreground mb-6">HOW IT WORKS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Initial Consultation",
                description: "We discuss your vision, goals, and preferences via WhatsApp or video call.",
              },
              {
                step: "02",
                title: "Planning & Prep",
                description: "I handle location scouting, styling guidance, and all technical preparations.",
              },
              {
                step: "03",
                title: "The Session",
                description: "Relaxed, collaborative shoot where we capture your authentic essence.",
              },
              {
                step: "04",
                title: "Delivery",
                description: "Professionally edited images delivered within 2-3 weeks via secure gallery.",
              },
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 transform rotate-3">
                  <span className="font-serif text-2xl font-black text-primary-foreground">{process.step}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">{process.title}</h3>
                <p className="text-muted-foreground">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-black text-foreground mb-6">READY TO CREATE SOMETHING AMAZING?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Let's discuss your vision and bring your story to life through powerful imagery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleHireClick}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 py-4 text-lg transform hover:scale-105 transition-transform"
            >
              HIRE ME NOW
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold px-8 py-4 text-lg transform hover:scale-105 transition-transform bg-transparent"
            >
              <Link href="/gallery">VIEW MY WORK</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

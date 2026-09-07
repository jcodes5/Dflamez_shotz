"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Zap, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { HireForm } from "@/components/hire/hire-form"
import { HireButton, HireModal } from "@/components/hire/hire-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { services as hireServices } from "@/lib/services"
import { Breadcrumbs } from "@/components/breadcrumbs"

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Breadcrumbs items={[{ label: "Services" }]} />

      {/* Hero Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h1 className="font-serif text-5xl font-black tracking-tight text-foreground sm:text-7xl mb-6">
            <span className="block">MY</span>
            <span className=" text-primary transform -rotate-1 inline-block">SERVICES</span>
          </h1>
          <p className="text-xl leading-8 text-muted-foreground max-w-2xl mx-auto mb-8">
            Professional photography and videography services designed to capture your authentic self and tell your
            unique story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <HireButton
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 py-4 text-lg transform hover:scale-105 transition-transform"
            >
              START YOUR PROJECT
            </HireButton>
            <Button
              onClick={() => setShowModal(true)}
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold px-8 py-4 text-lg transform hover:scale-105 transition-transform bg-transparent"
            >
              HIRE ME NOW
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {hireServices.map((service, index) => (
              <Card
                key={service.id}
                className={`relative p-8 transform transition-all duration-300 hover:scale-105 cursor-pointer ${
                  index % 3 === 0 ? "rotate-1" : index % 3 === 1 ? "-rotate-1" : "rotate-2"
                } ${selectedService === service.id ? "ring-2 ring-primary" : ""}`}
                onClick={() => handleServiceSelect(service.id)}
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
                    <h3 className="font-serif text-2xl font-bold text-foreground">{service.name}</h3>
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

                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-2xl font-bold text-primary">Starting at ${service.basePrice}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        window.location.href = "/hire"
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Learn More
                    </Button>
                    <HireButton
                      selectedService={service.id}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      HIRE
                    </HireButton>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Hire Form Section - Embedded */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-black text-foreground mb-6">
              <span className="block">READY TO GET</span>
              <span className=" text-primary transform rotate-1 inline-block">STARTED?</span>
            </h2>
            <p className="text-xl text-muted-foreground">Fill out the form below and I'll get back to you within 24 hours</p>
          </div>

          <Tabs defaultValue="form" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="form">Quick Form</TabsTrigger>
              <TabsTrigger value="modal">Modal Form</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form" className="mt-8">
              <HireForm
                variant="embedded"
                selectedService={selectedService}
                onServiceSelect={handleServiceSelect}
              />
            </TabsContent>
            
            <TabsContent value="modal" className="mt-8">
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Prefer a Modal Experience?</h3>
                <p className="text-muted-foreground mb-6">Click the button below to open the form in a modal window</p>
                <HireButton
                  selectedService={selectedService}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 py-4 text-lg"
                >
                  OPEN HIRE FORM
                </HireButton>
              </div>
            </TabsContent>
          </Tabs>
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
                title: "Submit Request",
                description: "Fill out the form with your vision and project details.",
              },
              {
                step: "02",
                title: "Consultation",
                description: "We'll discuss your vision, timeline, and preferences via call or WhatsApp.",
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
            <HireButton
              selectedService={selectedService}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 py-4 text-lg transform hover:scale-105 transition-transform"
            >
              HIRE ME NOW
            </HireButton>
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

      {/* Global Modal */}
      <HireModal
        open={showModal}
        onOpenChange={setShowModal}
        selectedService={selectedService}
      />
    </main>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  ExternalLink,
  Send,
  Clock,
} from "lucide-react"

const socialLinks = [
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://instagram.com/dflamez.shotz",
    handle: "@dflamez.shotz",
  },
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://facebook.com/dflamez.shotz",
    handle: "Dflamez Shotz Photography",
  },
  {
    name: "Twitter",
    icon: Twitter,
    url: "https://twitter.com/dflamez_shotz",
    handle: "@dflamez_shotz",
  },
]

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+2348106643611",
    action: "tel:+2348106643611",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@dflamezshotz.com",
    action: "mailto:hello@dflamezshotz.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Akure, Nigeria",
    action: null,
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 24 hours",
    action: null,
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{type: string, text: string} | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          inquiryType: formData.inquiryType || "general",
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitMessage({ type: "success", text: result.message })
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          inquiryType: "",
          message: "",
        })
      } else {
        setSubmitMessage({ type: "error", text: result.error || "Failed to send message" })
      }
    } catch (error) {
      setSubmitMessage({ type: "error", text: "Network error. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Hi Dflamez! I'm interested in your photography services. I'd love to discuss a potential project with you.`,
    )
    window.open(`http://wa.me/2348106643611?text=${message}`, "_blank")
  }

  const handleHireClick = () => {
    window.location.href = "/hire"
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h1 className="font-serif text-5xl font-black tracking-tight text-foreground sm:text-7xl mb-6">
            <span className="block">LET'S</span>
            <span className="block text-primary transform -rotate-1 inline-block">CONNECT</span>
          </h1>
          <p className="text-xl leading-8 text-muted-foreground max-w-2xl mx-auto mb-8">
            Ready to capture your story? I'd love to hear about your vision and bring it to life through powerful
            imagery.
          </p>
          <Button
            onClick={handleHireClick}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 py-4 text-lg transform hover:scale-105 transition-transform"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            HIRE ME ON WHATSAPP
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="p-8 transform rotate-1">
              <div className="mb-8">
                <h2 className="font-serif text-3xl font-black text-foreground mb-4">SEND A MESSAGE</h2>
                <p className="text-muted-foreground">
                  Fill out the form below and I'll get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {submitMessage && (
                  <div className={`p-4 rounded-md ${submitMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {submitMessage.text}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-foreground font-semibold">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-foreground font-semibold">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-foreground font-semibold">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="+123 ***** *****"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inquiryType" className="text-foreground font-semibold">
                      Inquiry Type
                    </Label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      aria-label="Inquiry Type"
                      className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select inquiry type</option>
                      <option value="general">General Inquiry</option>
                      <option value="booking">Booking</option>
                      <option value="portfolio">Portfolio</option>
                      <option value="services">Services</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-foreground font-semibold">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="mt-1"
                    placeholder="Tell me about your vision, timeline, and any specific requirements..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3"
                >
                  {isSubmitting ? (
                    "SENDING..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      SEND MESSAGE
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* Contact Info & WhatsApp */}
            <div className="space-y-8">
              {/* WhatsApp CTA */}
              <Card className="p-8 bg-primary text-primary-foreground transform -rotate-1">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="font-serif text-2xl font-black mb-4">PREFER TO CHAT?</h3>
                  <p className="mb-6 opacity-90">
                    Get instant responses and discuss your project directly on WhatsApp.
                  </p>
                  <Button
                    onClick={handleWhatsAppClick}
                    variant="secondary"
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 font-bold"
                  >
                    CHAT ON WHATSAPP
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>

              {/* Contact Information */}
              <Card className="p-8 transform rotate-2">
                <h3 className="font-serif text-2xl font-black text-foreground mb-6">CONTACT INFO</h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{info.label}</div>
                        {info.action ? (
                          <a href={info.action} className="text-muted-foreground hover:text-primary transition-colors">
                            {info.value}
                          </a>
                        ) : (
                          <div className="text-muted-foreground">{info.value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-black text-foreground mb-6">
            <span className="block">FOLLOW MY</span>
            <span className="block text-primary transform rotate-1 inline-block">JOURNEY</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Stay connected and see behind-the-scenes content from my latest sessions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {socialLinks.map((social, index) => (
              <Card
                key={index}
                className={`p-6 transform transition-all duration-300 hover:scale-105 cursor-pointer ${
                  index % 3 === 0 ? "rotate-1" : index % 3 === 1 ? "-rotate-1" : "rotate-2"
                }`}
                onClick={() => window.open(social.url, "_blank")}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <social.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2">{social.name}</h3>
                  <p className="text-muted-foreground">{social.handle}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-black text-foreground mb-6">FREQUENTLY ASKED</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How far in advance should I book?",
                answer:
                  "I recommend booking 2-4 weeks in advance, especially for weekend sessions. However, I sometimes have last-minute availability, so don't hesitate to reach out!",
              },
              {
                question: "Do you travel for sessions?",
                answer:
                  "Yes! I love traveling for sessions. Travel fees apply for locations outside of Los Angeles, but I'm always excited to explore new places with my clients.",
              },
              {
                question: "What should I wear for my session?",
                answer:
                  "I provide styling guidance during our consultation. Generally, I recommend wearing something that makes you feel confident and authentic to who you are.",
              },
              {
                question: "How long until I receive my images?",
                answer:
                  "You'll receive your edited images within 2-3 weeks of your session. Rush delivery is available for an additional fee if needed sooner.",
              },
            ].map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-serif text-lg font-bold text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
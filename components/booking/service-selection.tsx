"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Video, Heart } from "lucide-react"

interface ServiceSelectionProps {
  bookingData: any
  updateBookingData: (data: any) => void
  onNext: () => void
}

const services = [
  {
    id: "soul-portraits",
    name: "Soul Portraits",
    description: "Capture the essence of your inner self with deeply personal portrait sessions",
    icon: Heart,
    features: ["1-2 hour session", "Professional editing", "High-resolution images", "Personal consultation"],
  },
  {
    id: "videography",
    name: "Videography",
    description: "Professional video production for events, documentaries, and creative projects",
    icon: Video,
    features: ["Full-day coverage", "Professional equipment", "Post-production editing", "Multiple formats"],
  },
  {
    id: "photography",
    name: "Photography",
    description: "Comprehensive photography services for all occasions and creative visions",
    icon: Camera,
    features: ["Flexible timing", "Multiple locations", "Professional editing", "Print-ready files"],
  },
]

export default function ServiceSelection({ bookingData, updateBookingData, onNext }: ServiceSelectionProps) {
  const handleServiceSelect = (serviceId: string) => {
    updateBookingData({ serviceType: serviceId })
    setTimeout(onNext, 300) // Small delay for better UX
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Choose Your Service</h2>
        <p className="text-muted-foreground">Select the type of session you'd like to book</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = service.icon
          const isSelected = bookingData.serviceType === service.id

          return (
            <Card
              key={service.id}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                isSelected ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => handleServiceSelect(service.id)}
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>

              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button className="w-full mt-4" variant={isSelected ? "default" : "outline"}>
                {isSelected ? "Selected" : "Select Service"}
              </Button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

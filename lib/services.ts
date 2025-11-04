import { Palette, Video, Camera } from "lucide-react"

export interface Service {
  id: string
  name: string
  description: string
  basePrice: number
  duration: string
  deliverables: string
  icon: any
  popular: boolean
}

export interface AddOn {
  id: string
  name: string
  price: number
}

export const services: Service[] = [
  {
    id: "soul-portraits",
    name: "Soul Portraits",
    description: "Deep, meaningful portraits that capture your essence",
    basePrice: 450,
    duration: "2-3 hours",
    deliverables: "20+ edited high-resolution images",
    icon: Palette,
    popular: true
  },
  {
    id: "cinematic-videography",
    name: "Cinematic Videography",
    description: "Storytelling through motion with cinematic quality",
    basePrice: 850,
    duration: "Full day",
    deliverables: "Edited video + raw footage",
    icon: Video,
    popular: false
  },
  {
    id: "artistic-photography",
    name: "Artistic Photography",
    description: "Creative photography for personal branding or expression",
    basePrice: 350,
    duration: "1-2 hours",
    deliverables: "15+ edited images",
    icon: Camera,
    popular: false
  }
]

export const addOns: AddOn[] = [
  { id: "additional-images", name: "Additional edited images", price: 25 },
  { id: "rush-delivery", name: "Rush delivery (48 hours)", price: 150 },
  { id: "hair-makeup", name: "Professional hair & makeup", price: 200 },
  { id: "second-location", name: "Second location", price: 100 },
  { id: "extended-session", name: "Extended session (+1 hour)", price: 150 },
  { id: "print-package", name: "Print package", price: 300 }
]
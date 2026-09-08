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
    id: "afrocentric-editorial",
    name: "Afrocentric Editorial",
    description: "Bold, heritage-rich editorials celebrating African identity, skin, and style",
    basePrice: 450,
    duration: "2-3 hours",
    deliverables: "20+ edited high-resolution images",
    icon: Palette,
    popular: true
  },
  {
    id: "fashion-beauty",
    name: "Fashion & Beauty",
    description: "High-fashion looks, beauty close-ups, and campaign-ready model portfolios",
    basePrice: 850,
    duration: "Full day",
    deliverables: "Edited gallery + raw selects",
    icon: Video,
    popular: false
  },
  {
    id: "culture-events",
    name: "Culture & Events",
    description: "Documentary-style coverage of cultural moments, shows, and creative collabs",
    basePrice: 350,
    duration: "1-2 hours",
    deliverables: "15+ edited images",
    icon: Camera,
    popular: false
  },
  {
    id: "soul-portraiture",
    name: "Soul Portraiture",
    description: "Intimate, essence-driven portraits — a signature root of the studio, also available",
    basePrice: 300,
    duration: "1-2 hours",
    deliverables: "15+ edited high-resolution images",
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
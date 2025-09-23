"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"

interface PackageSelectionProps {
  bookingData: any
  updateBookingData: (data: any) => void
  onNext: () => void
}

const packages = {
  "soul-portraits": [
    {
      name: "Essential Soul",
      price: 299,
      duration: "1 hour",
      features: ["15 edited photos", "Online gallery", "Personal consultation", "Basic retouching"],
      popular: false,
    },
    {
      name: "Deep Connection",
      price: 499,
      duration: "2 hours",
      features: ["30 edited photos", "Online gallery", "Extended consultation", "Advanced retouching", "Print release"],
      popular: true,
    },
    {
      name: "Soul Journey",
      price: 799,
      duration: "3 hours",
      features: [
        "50 edited photos",
        "Premium online gallery",
        "Multiple looks",
        "Professional retouching",
        "Print release",
        "Custom artwork",
      ],
      popular: false,
    },
  ],
  videography: [
    {
      name: "Story Capture",
      price: 899,
      duration: "Half day",
      features: ["4 hours filming", "Basic editing", "1 final video", "HD quality", "Music licensing"],
      popular: false,
    },
    {
      name: "Complete Vision",
      price: 1499,
      duration: "Full day",
      features: [
        "8 hours filming",
        "Professional editing",
        "2 final videos",
        "4K quality",
        "Music licensing",
        "Color grading",
      ],
      popular: true,
    },
    {
      name: "Cinematic Experience",
      price: 2299,
      duration: "2 days",
      features: [
        "16 hours filming",
        "Premium editing",
        "Multiple videos",
        "4K quality",
        "Custom music",
        "Advanced color grading",
        "Drone footage",
      ],
      popular: false,
    },
  ],
  photography: [
    {
      name: "Classic Session",
      price: 399,
      duration: "2 hours",
      features: ["25 edited photos", "Online gallery", "1 location", "Basic retouching", "Print release"],
      popular: false,
    },
    {
      name: "Premium Experience",
      price: 699,
      duration: "4 hours",
      features: [
        "50 edited photos",
        "Premium gallery",
        "2 locations",
        "Advanced retouching",
        "Print release",
        "Rush delivery",
      ],
      popular: true,
    },
    {
      name: "Ultimate Package",
      price: 1199,
      duration: "Full day",
      features: [
        "100 edited photos",
        "Premium gallery",
        "Multiple locations",
        "Professional retouching",
        "Print release",
        "Same-day preview",
        "Custom album",
      ],
      popular: false,
    },
  ],
}

export default function PackageSelection({ bookingData, updateBookingData, onNext }: PackageSelectionProps) {
  const currentPackages = packages[bookingData.serviceType as keyof typeof packages] || []

  const handlePackageSelect = (packageName: string, price: number) => {
    updateBookingData({ packageName, packagePrice: price })
    setTimeout(onNext, 300)
  }

  if (!bookingData.serviceType) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please select a service first</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Choose Your Package</h2>
        <p className="text-muted-foreground">Select the package that best fits your needs</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {currentPackages.map((pkg) => {
          const isSelected = bookingData.packageName === pkg.name
          const depositAmount = (pkg.price * 0.3).toFixed(0)

          return (
            <Card
              key={pkg.name}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg relative ${
                isSelected ? "ring-2 ring-primary bg-primary/5" : ""
              } ${pkg.popular ? "border-primary" : ""}`}
              onClick={() => handlePackageSelect(pkg.name, pkg.price)}
            >
              {pkg.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                <div className="text-3xl font-bold text-primary mb-1">${pkg.price}</div>
                <p className="text-muted-foreground text-sm">{pkg.duration}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="border-t pt-4 mb-4">
                <p className="text-sm text-muted-foreground text-center">
                  Deposit required: <span className="font-semibold text-primary">${depositAmount}</span> (30%)
                </p>
              </div>

              <Button className="w-full" variant={isSelected ? "default" : "outline"}>
                {isSelected ? "Selected" : "Select Package"}
              </Button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

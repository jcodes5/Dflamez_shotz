"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import ServiceSelection from "@/components/booking/service-selection"
import PackageSelection from "@/components/booking/package-selection"
import EventDetails from "@/components/booking/event-details"
import ContactInfo from "@/components/booking/contact-info"
import BookingReview from "@/components/booking/booking-review"

const steps = [
  { id: 1, title: "Service", component: ServiceSelection },
  { id: 2, title: "Package", component: PackageSelection },
  { id: 3, title: "Details", component: EventDetails },
  { id: 4, title: "Contact", component: ContactInfo },
  { id: 5, title: "Review", component: BookingReview },
]

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    serviceType: "",
    packageName: "",
    packagePrice: 0,
    eventDate: "",
    eventLocation: "",
    specialRequests: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
  })

  const updateBookingData = (data: Partial<typeof bookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const CurrentStepComponent = steps[currentStep - 1].component

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 text-sm sm:text-base ${
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-12 sm:w-16 mx-1 sm:mx-2 transition-all duration-300 ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Book Your Session</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
            </p>
          </div>
        </div>

        <Card className="p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent
                bookingData={bookingData}
                updateBookingData={updateBookingData}
                onNext={nextStep}
                onPrev={prevStep}
                isFirstStep={currentStep === 1}
                isLastStep={currentStep === steps.length}
              />
            </motion.div>
          </AnimatePresence>
        </Card>

        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center justify-center gap-2 bg-transparent order-2 sm:order-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length}
            className="flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Clock, Check, ArrowRight } from "lucide-react"
import { HireForm } from "./hire-form"
import { services } from "@/lib/services"
import { cn } from "@/lib/utils"

interface HireModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedService?: string | null
}

export function HireModal({ open, onOpenChange, selectedService = null }: HireModalProps) {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)

  const handleSubmitSuccess = () => {
    setIsFormSubmitted(true)
    // Close modal after a delay
    setTimeout(() => {
      onOpenChange(false)
      setIsFormSubmitted(false)
    }, 2000)
  }

  if (isFormSubmitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Request Submitted!</h2>
            <p className="text-muted-foreground mb-4">
              Thank you for your hire request. I'll review your information and get back to you within 24 hours.
            </p>
            <Badge variant="outline" className="mb-4">
              Check your email for confirmation
            </Badge>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-bold">
            Hire Me for Your Project
          </DialogTitle>
          <DialogDescription>
            Let's create something amazing together. Fill out the form below and I'll get back to you within 24 hours.
          </DialogDescription>
        </DialogHeader>

        {selectedService && (
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">
                  {services.find(s => s.id === selectedService)?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {services.find(s => s.id === selectedService)?.description}
                </p>
              </div>
              <div className="text-right">
                <div className="font-bold text-primary">
                  ${services.find(s => s.id === selectedService)?.basePrice}+
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {services.find(s => s.id === selectedService)?.duration}
                </div>
              </div>
            </div>
          </div>
        )}

        <HireForm
          variant="modal"
          selectedService={selectedService}
          onSubmitSuccess={handleSubmitSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}

// Quick action button for service pages
interface HireButtonProps {
  selectedService?: string | null
  className?: string
  children?: React.ReactNode
}

export function HireButton({ selectedService = null, className, children }: HireButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={cn("bg-primary text-primary-foreground hover:bg-primary/90", className)}
      >
        {children || "HIRE ME NOW"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      <HireModal open={open} onOpenChange={setOpen} selectedService={selectedService} />
    </>
  )
}
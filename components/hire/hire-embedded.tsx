"use client"

import { HireForm } from "./hire-form"

interface HireEmbeddedProps {
  selectedService?: string | null
  onServiceSelect?: (serviceId: string) => void
}

export function HireEmbedded({ selectedService = null, onServiceSelect }: HireEmbeddedProps) {
  return (
    <div className="bg-background rounded-lg p-6 shadow-sm">
      <HireForm 
        variant="embedded" 
        selectedService={selectedService}
        onServiceSelect={onServiceSelect}
      />
    </div>
  )
}
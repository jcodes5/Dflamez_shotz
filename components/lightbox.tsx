"use client"

import { useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LightboxProps {
  images: Array<{
    id: string
    src: string
    alt: string
    category: string
    title?: string
  }>
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

export function Lightbox({ images, currentIndex, isOpen, onClose, onNext, onPrevious }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          onPrevious()
          break
        case "ArrowRight":
          onNext()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, onNext, onPrevious])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen || !images[currentIndex]) return null

  const currentImage = images[currentIndex]

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="flex h-full items-center justify-center p-4">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Previous button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
          onClick={onPrevious}
          disabled={images.length <= 1}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        {/* Next button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
          onClick={onNext}
          disabled={images.length <= 1}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>

        {/* Image */}
        <div className="relative max-h-full max-w-full">
          <img
            src={currentImage.src || "/placeholder.svg"}
            alt={currentImage.alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />

          {/* Image info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="text-white">
              {currentImage.title && <h3 className="font-serif text-xl font-bold mb-2">{currentImage.title}</h3>}
              <p className="text-sm text-primary font-semibold uppercase tracking-wide">{currentImage.category}</p>
              <p className="text-xs text-white/80 mt-1">
                {currentIndex + 1} of {images.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

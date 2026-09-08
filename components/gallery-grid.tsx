"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Lightbox } from "./lightbox"
import { GalleryFilter } from "./gallery-filter"
import { motion, AnimatePresence } from "framer-motion"

interface GalleryItem {
  id: string
  image_url: string
  title: string
  category: string
  description?: string
}

const categories = ["All", "Editorial", "Fashion", "Culture", "Soul Portraits"]

export function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch gallery items from API
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/gallery")
        if (!response.ok) {
          throw new Error("Failed to fetch gallery items")
        }
        const data = await response.json()
        setGalleryItems(data.data || [])
      } catch (error) {
        console.error("Error fetching gallery items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGalleryItems()
  }, [])

  const filteredItems = activeCategory === "All" 
    ? galleryItems 
    : galleryItems.filter((item) => item.category === activeCategory)

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredItems.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center">
          <p>Loading gallery...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      {/* Filter buttons */}
      <GalleryFilter categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      {/* Gallery grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              className={cn(
                "group relative overflow-hidden rounded-lg cursor-pointer",
                // Neubrutalism random rotations
                index % 3 === 0 && "rotate-1",
                index % 3 === 1 && "-rotate-1",
                index % 3 === 2 && "rotate-2",
              )}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
              }}
              whileHover={{
                scale: 1.05,
                rotate: 0,
                y: -5,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <motion.img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.png"
                  }}
                />
              </div>

              {/* Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-4"
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h3 className="text-white font-serif font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-primary text-sm font-semibold uppercase tracking-wide">{item.category}</p>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Lightbox */}
      <Lightbox
        images={filteredItems.map(item => ({ 
          id: item.id, 
          src: item.image_url, 
          alt: item.title,
          category: item.category,
          title: item.title
        }))}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrevious={previousImage}
      />
    </div>
  )
}

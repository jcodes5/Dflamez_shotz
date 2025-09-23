"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GalleryFilterProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function GalleryFilter({ categories, activeCategory, onCategoryChange }: GalleryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          className={cn(
            "font-bold px-6 py-3 text-sm uppercase tracking-wide transform transition-all duration-200",
            activeCategory === category
              ? "bg-primary text-primary-foreground hover:bg-primary/90 scale-105"
              : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105",
          )}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}

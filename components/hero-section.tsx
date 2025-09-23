"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Camera, Video, Palette, Star } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-background">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(212,175,55,0.1)_25%,rgba(212,175,55,0.1)_50%,transparent_50%,transparent_75%,rgba(212,175,55,0.1)_75%)] bg-[length:20px_20px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-foreground leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                SOUL
              </motion.span>
              <motion.span
                className="block text-primary transform -rotate-2 inline-block"
                initial={{ opacity: 0, y: 20, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: -2 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                PORTRAITS
              </motion.span>
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                & VISUAL
              </motion.span>
              <motion.span
                className="block text-primary transform rotate-1 inline-block"
                initial={{ opacity: 0, y: 20, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                STORIES
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg lg:text-xl leading-relaxed text-muted-foreground font-medium max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              I'm <span className="text-primary font-bold">Dflamez Shot</span>, capturing the essence of souls through
              powerful portraits, cinematic videography, and authentic photography that reveals the true spirit within.
            </motion.p>

            <motion.div
              className="flex justify-center lg:justify-start gap-4 sm:gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
              {[
                { icon: Palette, label: "Soul Portraits", rotation: 3 },
                { icon: Video, label: "Videography", rotation: -2 },
                { icon: Camera, label: "Photography", rotation: 1 },
              ].map((service, index) => (
                <motion.div
                  key={service.label}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: 0 }}
                >
                  <motion.div
                    className={`w-12 h-12 sm:w-14 sm:h-14 ${index === 1 ? "bg-card border-2 border-primary" : "bg-primary"} rounded-lg flex items-center justify-center`}
                    style={{ rotate: service.rotation }}
                    whileHover={{ rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <service.icon
                      className={`h-6 w-6 sm:h-7 sm:w-7 ${index === 1 ? "text-primary" : "text-primary-foreground"}`}
                    />
                  </motion.div>
                  <span className="mt-2 text-xs sm:text-sm font-semibold text-center">{service.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
                >
                  <Link href="/gallery">
                    VIEW MY WORK
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-black font-bold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-transparent w-full sm:w-auto"
                >
                  <Link
                    href="https://wa.me/1234567890?text=Hi%20Dfalmez,%20I'm%20interested%20in%20your%20services"
                    target="_blank"
                  >
                    HIRE ME NOW
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex items-center justify-center lg:justify-start gap-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.9 + i * 0.1 }}
                  >
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary fill-current" />
                  </motion.div>
                ))}
              </div>
              <span className="text-sm sm:text-base text-muted-foreground">
                <span className="font-bold text-foreground">30+</span> souls captured
              </span>
            </motion.div>
          </motion.div>

          {/* Right side - Hero image */}
          <motion.div
            className="relative order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              className="aspect-[3/4] sm:aspect-[4/5] bg-muted rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-sm sm:max-w-md lg:max-w-none"
              initial={{ rotate: 2 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src="/dflamez.png"
                alt="Dfalmez Shot - Soul Portrait Artist"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.png"
                }}
              />
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center"
              initial={{ rotate: 12, scale: 0 }}
              animate={{ 
                rotate: [12, 15, 12],
                scale: [1, 1, 1]
              }}
              transition={{ 
                duration: 0.5, 
                delay: 1.2,
                rotate: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.1, rotate: 0 }}
            >
              <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-12 h-12 sm:w-16 sm:h-16 bg-card border-4 border-primary rounded-lg flex items-center justify-center"
              initial={{ rotate: -12, scale: 0 }}
              animate={{ 
                rotate: [-12, -15, -12],
                scale: [1, 1, 1] 
              }}
              transition={{ 
                duration: 0.5, 
                delay: 1.4,
                rotate: { duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.1, rotate: 0 }}
            >
              <Video className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 sm:mt-20 lg:mt-24"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <div className="text-center mb-8 sm:mb-12">
            <motion.h2
              className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 transform -rotate-1 inline-block"
              whileHover={{ rotate: 0, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              FEATURED WORK
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-sm sm:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.2 }}
            >
              A glimpse into the souls I've captured
            </motion.p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { src: "/gallery-showcase-1.png", title: "Soul Portrait Session", rotation: 1 },
              { src: "/gallery-showcase-2.png", title: "Cinematic Story", rotation: -2 },
              { src: "/gallery-showcase-3.png", title: "Artistic Portrait", rotation: 2 },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.3 + index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <motion.div
                  className="aspect-square bg-muted rounded-xl overflow-hidden shadow-lg"
                  initial={{ rotate: item.rotation }}
                  whileHover={{ rotate: 0, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.png"
                    }}
                  />
                </motion.div>
                <motion.p
                  className="mt-3 text-sm sm:text-base font-semibold text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 2.5 + index * 0.1 }}
                >
                  {item.title}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

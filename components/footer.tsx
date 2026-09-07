"use client"

import { Button } from "@/components/ui/button"
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { HireButton } from "@/components/hire/hire-modal"

export function Footer() {
  return (
    <footer className="bg-card border-t-4 border-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          {/* Brand section */}
          <div className="sm:col-span-2 lg:col-span-2 text-center sm:text-left">
            <motion.h3
              className="font-brand text-3xl sm:text-4xl font-normal text-foreground mb-4 transform -rotate-1"
              whileHover={{ rotate: 0, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Dflamez <span className="text-primary">Shotz</span>
            </motion.h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto sm:mx-0 text-sm sm:text-base">
              Capturing souls through powerful portraits, cinematic videography, and authentic photography. Every frame
              tells a story, every shot reveals the essence within.
            </p>
            <div className="flex justify-center sm:justify-start space-x-3 sm:space-x-4">
              {[
                { icon: Instagram, href: "https://instagram.com" },
                { icon: Twitter, href: "https://twitter.com" },
                { icon: Facebook, href: "https://facebook.com" },
                // { icon: <a href="https://www.flaticon.com/free-icons/tiktok" title="tiktok icons">Tiktok icons created by Freepik - Flaticon</a>, href:}
              ].map((social, index) => (
                <motion.div key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all bg-transparent w-9 h-9 sm:w-10 sm:h-10"
                    asChild
                  >
                    <Link href={social.href} target="_blank">
                      <social.icon className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="text-center sm:text-left">
            <h4 className="font-serif text-base sm:text-lg font-bold text-foreground mb-4 transform rotate-1">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { name: "Gallery", href: "/gallery" },
                { name: "Services", href: "/services" },
                { name: "Hire", href: "/hire" },
                { name: "About", href: "/about" },
                { name: "Gold's Pen", href: "/blog" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className="text-center sm:text-left">
            <h4 className="font-serif text-base sm:text-lg font-bold text-foreground mb-4 transform -rotate-1">
              GET IN TOUCH
            </h4>
            <div className="space-y-3 mb-6">
              {[
                { icon: Mail, text: "hello@dflamezshotz.com" },
                { icon: Phone, text: "+2348106643611" },
                { icon: MapPin, text: "Akure, Nigeria" },
              ].map((contact, index) => (
                <div key={index} className="flex items-center justify-center sm:justify-start space-x-2">
                  <contact.icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground text-sm sm:text-base">{contact.text}</span>
                </div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <HireButton
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
              >
                HIRE ME NOW
              </HireButton>
            </motion.div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
              © 2025 Dflamez Shotz. All rights reserved.
            </p>
            <div className="flex space-x-4 sm:space-x-6">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-primary text-xs sm:text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-primary text-xs sm:text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

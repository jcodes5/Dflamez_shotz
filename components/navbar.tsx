"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Hire", href: "/hire" },
  { name: "Gallery", href: "/gallery" },
  { name: "Gold's Pen", href: "/blog" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto"
      return () => {
        document.body.style.overflow = "auto"
      }
    }
  }, [mobileMenuOpen])

  const handleHireClick = () => {
    router.push("/hire")
  }

  return (
    <motion.header
      className="bg-background border-b border-border shadow-sm sticky top-0 z-40 lg:bg-background/80 lg:backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="flex items-center gap-2 p-1.5" aria-label="Dflamez Photography home">
              <span className="font-brand text-3xl font-normal text-primary">Dflamez</span>
              <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/70">Photography</span>
            </Link>
          </motion.div>
        </div>

        {/* Mobile toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              aria-label="Open menu"
              className="inline-flex items-center justify-center rounded-md p-2"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </motion.div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex lg:gap-x-10">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-primary after:transition-all
                  ${isActive
                      ? "text-primary after:w-full"
                      : "text-foreground hover:text-primary after:w-0 hover:after:w-full"}`}
                >
                  {item.name}
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Desktop Right */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
          <ThemeToggle />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleHireClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6"
            >
              HIRE ME
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-sm bg-background/60 backdrop-blur-lg px-6 py-6 shadow-2xl lg:hidden rounded-l-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="flex items-center justify-between">
                <Link href="/" className="p-1.5" aria-label="Dflamez Photography home">
                  <span className="font-brand text-3xl font-normal text-primary">Dflamez</span>
                  <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/70">Photography</span>
                </Link>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      aria-label="Close menu"
                      className="rounded-md p-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <X className="h-6 w-6" aria-hidden="true" />
                    </Button>
                  </motion.div>
                </div>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-border/50">
                  <div className="space-y-2 py-6">
                    {navigation.map((item, index) => {
                      const isActive = pathname === item.href
                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            className={`-mx-3 block rounded-lg px-3 py-3 text-base font-medium transition-colors
                            ${isActive
                                ? "text-primary bg-muted"
                                : "text-foreground hover:bg-muted"}`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                  <motion.div
                    className="py-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <Button
                      onClick={handleHireClick}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                    >
                      HIRE ME
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

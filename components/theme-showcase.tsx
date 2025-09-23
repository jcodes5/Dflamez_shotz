"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Palette, Sparkles, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeShowcase() {
  const { theme } = useTheme()

  return (
    <motion.section
      className="py-20 px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            className="font-serif text-3xl font-bold mb-4 flex items-center justify-center gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Palette className="w-8 h-8 text-primary" />
            Theme Showcase
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.h2>
          <motion.p
            className="text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Experience the elegant gold accents in both light and dark modes
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Color Palette Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                Current Theme: {theme === "dark" ? "Dark" : "Light"}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full border-2 border-border" />
                  <span className="text-sm">Primary Gold</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-background border-2 border-border rounded-full" />
                  <span className="text-sm">Background</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-foreground rounded-full" />
                  <span className="text-sm">Foreground</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-muted rounded-full border border-border" />
                  <span className="text-sm">Muted</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Interactive Elements */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Interactive Elements</h3>
              <div className="space-y-3">
                <Button className="w-full">Primary Button</Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Outline Button
                </Button>
                <Button variant="ghost" className="w-full">
                  Ghost Button
                </Button>
                <div className="flex gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Typography Showcase */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Typography</h3>
              <div className="space-y-3">
                <h1 className="font-serif text-2xl font-bold text-primary">Heading Serif</h1>
                <h2 className="font-sans text-xl font-semibold">Heading Sans</h2>
                <p className="text-foreground">Regular body text with perfect contrast</p>
                <p className="text-muted-foreground">Muted text for secondary information</p>
                <code className="font-mono text-sm bg-muted px-2 py-1 rounded">Code snippet</code>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Theme Benefits */}
        <motion.div
          className="mt-12 text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="p-8 bg-primary/5 border-primary/20">
            <h3 className="font-serif text-2xl font-bold mb-4 text-primary">Sophisticated Design System</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our carefully crafted color palette ensures perfect readability and visual hierarchy in both light and
              dark modes, with elegant gold accents that maintain the luxurious aesthetic of Dfalmez's brand.
            </p>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  )
}

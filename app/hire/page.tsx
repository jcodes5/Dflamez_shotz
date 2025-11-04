"use client";

import { Navbar } from "@/components/navbar";
import { HireForm } from "@/components/hire/hire-form";

export default function HirePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h1 className="font-serif text-5xl font-black tracking-tight text-foreground sm:text-6xl mb-6">
            <span className="block">LET'S CREATE</span>
            <span className="block text-primary transform rotate-1 inline-block">
              SOMETHING AMAZING
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell me about your vision and let's bring it to life through
            powerful imagery.
          </p>
        </div>
      </section>

      {/* Hire Form */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <HireForm variant="standalone" />
        </div>
      </section>
    </main>
  );
}

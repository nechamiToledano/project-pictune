"use client"

import HeroSection from '@/components/home/hero-section'
import FeaturesSection from '@/components/home/features-section'
import HowItWorksSection from '@/components/home/how-it-works-section'
import TestimonialsSection from '@/components/home/testimonials-section'
import PricingSection from '@/components/home/pricing-section'
import CTASection from '@/components/home/CTA-section'
import Background from './Background'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Background/>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </main>
  )
}
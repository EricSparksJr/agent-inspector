"use client"

import { motion, useReducedMotion } from "framer-motion"
import Hero from "@/components/sections/Hero"
import PatternGrid from "@/components/sections/PatternGrid"
import AboutStrip from "@/components/sections/AboutStrip"
import Footer from "@/components/sections/Footer"

export default function Page() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className="flex min-h-full flex-col"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <Hero />
      <PatternGrid />
      <AboutStrip />
      <div className="mt-24 md:mt-36">
        <Footer />
      </div>
    </motion.div>
  )
}

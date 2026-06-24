"use client"

import { useEffect } from "react"
import { scrollToHashTarget } from "@/lib/scroll-to-hash"

export default function ScrollHashOnMount() {
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToHashTarget(id))
    })

    return () => cancelAnimationFrame(raf)
  }, [])

  return null
}

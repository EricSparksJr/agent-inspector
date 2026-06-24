"use client"

import { useEffect } from "react"
import { scrollToHashTarget } from "@/lib/scroll-to-hash"

export default function ScrollHashOnMount() {
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }

    const id = window.location.hash.slice(1)

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (id) {
          scrollToHashTarget(id)
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" })
        }
      })
    })

    return () => cancelAnimationFrame(raf)
  }, [])

  return null
}

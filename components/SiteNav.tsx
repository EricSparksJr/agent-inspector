"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 h-14 transition-colors duration-300"
      style={{
        backgroundColor: scrolled ? "var(--nav-bg-scrolled)" : "var(--bg)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      }}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium transition-opacity duration-[120ms] hover:opacity-70"
          style={{ color: "var(--text)" }}
        >
          {/* 2×2 pattern-grid mark: top-left square in accent, others in text */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            {/* top-left — accent */}
            <rect x="0" y="0" width="7" height="7" rx="1" fill="var(--accent)" />
            {/* top-right */}
            <rect x="11" y="0" width="7" height="7" rx="1" fill="currentColor" />
            {/* bottom-left */}
            <rect x="0" y="11" width="7" height="7" rx="1" fill="currentColor" />
            {/* bottom-right */}
            <rect x="11" y="11" width="7" height="7" rx="1" fill="currentColor" />
          </svg>
          Agent Inspector
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}

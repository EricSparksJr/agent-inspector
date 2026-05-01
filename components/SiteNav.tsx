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
<<<<<<< HEAD
          {/* Split-lens mark */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
=======
          {/* Split-lens mark: two halves making a whole, with transparent center gap */}
          <svg
            width="20"
            height="20"
>>>>>>> 38543c23d647ff28c6fcbb3b334188be0c28ba9b
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
<<<<<<< HEAD
=======
            {/* Left half */}
>>>>>>> 38543c23d647ff28c6fcbb3b334188be0c28ba9b
            <path
              d="M9 2H15V30H9C5.13401 30 2 26.866 2 23V9C2 5.13401 5.13401 2 9 2Z"
              fill="var(--accent)"
            />
<<<<<<< HEAD
=======
            {/* Right half */}
>>>>>>> 38543c23d647ff28c6fcbb3b334188be0c28ba9b
            <path
              d="M17 2H23C26.866 2 30 5.13401 30 9V23C30 26.866 26.866 30 23 30H17V2Z"
              fill="var(--accent)"
            />
          </svg>
          Agent Inspector
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.getAttribute("data-theme") === "dark")
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light")
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  if (!mounted) {
    return <div style={{ width: 40, height: 40 }} aria-hidden="true" />
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex items-center justify-center rounded-full transition-colors"
      style={{
        width: 40,
        height: 40,
        color: "var(--text-subtle)",
        transitionDuration: "120ms",
        transitionTimingFunction: "ease-out",
        marginRight: 4,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--bg-subtle)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent"
      }}
    >
      {isDark ? (
        <Sun strokeWidth={1.5} style={{ width: 20, height: 20 }} />
      ) : (
        <Moon strokeWidth={1.5} style={{ width: 20, height: 20 }} />
      )}
    </button>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Circle, ArrowRight } from "lucide-react"
import { patterns } from "@/lib/patterns"

// Active card shadows
const SHADOW_REST =
  "0 1px 2px oklch(0% 0 0 / 0.04), 0 4px 12px oklch(0% 0 0 / 0.06), 0 12px 32px oklch(0% 0 0 / 0.04)"
const SHADOW_HOVER =
  "0 2px 4px oklch(0% 0 0 / 0.04), 0 8px 20px oklch(0% 0 0 / 0.07), 0 16px 40px oklch(0% 0 0 / 0.08)"

export default function PatternGrid() {
  return (
    <section id="patterns" className="pt-24 pb-40">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">

        <div className="mb-10">
          <p
            className="mb-4 text-[12px] font-medium uppercase tracking-[0.08em]"
            style={{ color: "var(--text-subtle)" }}
          >
            Library
          </p>
          <h2
            className="mb-4 font-semibold leading-[1.15] tracking-[-0.01em] text-balance"
            style={{ fontSize: "var(--text-h2)", color: "var(--text)" }}
          >
            Six patterns
          </h2>
          <p
            className="max-w-lg text-pretty leading-[1.6]"
            style={{ fontSize: "var(--text-body)", color: "var(--text-muted)" }}
          >
            Each pattern includes a working demo, the reasoning behind it,
            and what it intentionally does not do.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {patterns.map((pattern, index) => {
            const isLive = !!pattern.href
            return (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, ease: "easeOut", delay: index * 0.05 }}
                viewport={{ once: true, margin: "-40px" }}
              >
                {isLive ? (
                  <Link href={pattern.href!} className="group block h-full">
                    <LiveCard pattern={pattern} />
                  </Link>
                ) : (
                  <ComingSoonCard pattern={pattern} />
                )}
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

// ─── active card ──────────────────────────────────────────────────────────────

function LiveCard({ pattern }: { pattern: (typeof patterns)[number] }) {
  return (
    <div
      className="relative flex h-full flex-col rounded-xl p-7 transition-all duration-200"
      style={{
        backgroundColor: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        boxShadow: SHADOW_REST,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = SHADOW_HOVER
        e.currentTarget.style.transform = "translateY(-2px)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = SHADOW_REST
        e.currentTarget.style.transform = ""
      }}
    >
      <h3
        className="mb-3 font-semibold leading-[1.25] tracking-[-0.005em] text-balance"
        style={{ fontSize: "var(--text-h3)", color: "var(--text)" }}
      >
        {pattern.name}
      </h3>
      <p
        className="flex-1 text-pretty leading-[1.6]"
        style={{ fontSize: "var(--text-body)", color: "var(--text-muted)" }}
      >
        {pattern.description}
      </p>
      <div className="mt-6 flex items-center gap-1">
        <span
          className="text-sm transition-colors duration-[180ms]"
          style={{ color: "var(--text-muted)" }}
        >
          See it work
        </span>
        <ArrowRight
          className="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1"
          style={{ color: "var(--text-muted)" }}
        />
      </div>
    </div>
  )
}

// ─── coming-soon card ─────────────────────────────────────────────────────────

function ComingSoonCard({ pattern }: { pattern: (typeof patterns)[number] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="flex h-full flex-col p-7"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top row: title (left) + status indicator (right) */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3
          className="font-semibold leading-[1.25] tracking-[-0.005em] text-balance transition-colors duration-200 ease-out"
          style={{
            fontSize: "var(--text-h3)",
            color: hovered ? "var(--text)" : "var(--text-muted)",
          }}
        >
          {pattern.name}
        </h3>

        {/* In-progress status — top-right */}
        <div
          className="flex shrink-0 items-center gap-1 pt-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          <Circle style={{ width: 10, height: 10, strokeWidth: 1.5 }} />
          <span className="text-[12px]">In progress</span>
        </div>
      </div>

      <p
        className="flex-1 text-pretty leading-[1.6] transition-colors duration-200 ease-out"
        style={{
          fontSize: "var(--text-body)",
          color: hovered ? "oklch(40% 0.005 250)" : "var(--text-muted)",
        }}
      >
        {pattern.description}
      </p>
    </div>
  )
}

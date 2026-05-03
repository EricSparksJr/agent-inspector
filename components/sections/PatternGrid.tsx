"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { patterns } from "@/lib/patterns"
import { cn } from "@/lib/utils"

const CARD_BASE =
  "relative flex h-full min-h-0 flex-col rounded-[12px] p-6 transition-colors duration-200"

function PillLive() {
  return (
    <span
      className="inline-flex h-[22px] shrink-0 items-center rounded-full border border-solid px-[10px] text-[11px] font-bold uppercase tracking-wide"
      style={{
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        borderColor: "var(--accent)",
        color: "var(--accent)",
      }}
    >
      Live
    </span>
  )
}

function PillInProgress() {
  return (
    <span
      className="inline-flex h-[22px] shrink-0 items-center rounded-full border border-solid px-[10px] text-[11px] font-bold uppercase tracking-wide"
      style={{
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        borderColor: "var(--text-faint)",
        color: "var(--text-faint)",
      }}
    >
      In progress
    </span>
  )
}

export default function PatternGrid() {
  return (
    <section id="patterns" className="mt-24 md:mt-36">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">

        <header>
          <p
            className="text-[12px] font-medium uppercase tracking-[0.08em]"
            style={{ color: "var(--text-subtle)" }}
          >
            Library
          </p>
          <h2
            className="mt-4 text-balance font-semibold leading-[1.15] tracking-[-0.01em]"
            style={{ fontSize: "var(--text-h2)", color: "var(--text)" }}
          >
            Six patterns
          </h2>
        </header>

        <p
          className="mt-8 max-w-lg text-pretty leading-[1.6]"
          style={{ fontSize: "var(--text-body)", color: "var(--text-muted)" }}
        >
          Each pattern includes a working demo, the reasoning behind it,
          and what it intentionally does not do.
        </p>

        <div
          className="mt-14 md:mt-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 [grid-auto-rows:1fr]"
        >
          {patterns.map((pattern, index) => {
            const isLive = pattern.status === "live"
            return (
              <motion.div
                key={pattern.id}
                className="h-full min-h-0"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, ease: "easeOut", delay: index * 0.05 }}
                viewport={{ once: true, margin: "-40px" }}
              >
                {isLive ? (
                  <Link
                    href={pattern.href!}
                    className="group/livecard block h-full min-h-0 rounded-[12px] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]"
                  >
                    <LiveCard pattern={pattern} />
                  </Link>
                ) : (
                  <InProgressCard pattern={pattern} />
                )}
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

function LiveCard({ pattern }: { pattern: (typeof patterns)[number] }) {
  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 flex-col rounded-[12px] p-6",
        "border border-solid border-[color:var(--border)] bg-[var(--card-bg)] [box-shadow:var(--card-shadow)]",
        "transition-[transform,box-shadow,border-color] duration-200",
        "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
        "motion-safe:group-hover/livecard:-translate-y-0.5",
        "group-hover/livecard:border-[color:var(--border-strong)]",
        "group-hover/livecard:shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)]",
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3
          className="min-w-0 flex-1 pr-2 text-balance text-[20px] font-bold leading-[1.25] tracking-[-0.005em]"
          style={{ color: "var(--text)", fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {pattern.name}
        </h3>
        <PillLive />
      </div>
      <p
        className="min-h-0 flex-1 text-pretty text-[15px] leading-[1.6]"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {pattern.description}
      </p>
      <div className="mt-auto pt-6">
        <span
          className="inline-flex items-baseline text-[14px] leading-normal"
          style={{ color: "var(--text)", fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          Open pattern
        </span>
      </div>
    </div>
  )
}

function InProgressCard({ pattern }: { pattern: (typeof patterns)[number] }) {
  return (
    <div
      className={CARD_BASE}
      style={{
        backgroundColor: "var(--card-bg)",
        borderStyle: "dashed",
        borderColor: "#C4C4C4",
        borderWidth: "1px",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3
          className="min-w-0 flex-1 pr-2 text-balance text-[18px] font-bold leading-[1.25] tracking-[-0.005em]"
          style={{ color: "var(--text-faint)", fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {pattern.name}
        </h3>
        <PillInProgress />
      </div>
      <p
        className="min-h-0 flex-1 text-pretty text-[15px] leading-[1.6]"
        style={{ color: "var(--text-faint)", fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {pattern.description}
      </p>
    </div>
  )
}

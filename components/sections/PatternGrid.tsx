"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { patterns } from "@/lib/patterns"

const CARD_BASE =
  "relative flex h-full min-h-0 flex-col rounded-[12px] p-6 transition-colors duration-200"

function PillLive() {
  return (
    <span
      className="shrink-0 rounded-[4px] px-2 py-1 text-[11px] font-normal uppercase tracking-[0.04em]"
      style={{
        fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
        backgroundColor: "var(--accent)",
        color: "#fff",
      }}
    >
      Live
    </span>
  )
}

function PillInProgress() {
  return (
    <span
      className="shrink-0 rounded-[4px] border border-solid px-2 py-1 text-[11px] font-normal uppercase tracking-[0.04em]"
      style={{
        fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
        color: "var(--text-muted)",
        backgroundColor: "transparent",
        borderColor: "var(--border)",
      }}
    >
      In progress
    </span>
  )
}

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

        <div
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 [grid-auto-rows:1fr]"
        >
          {patterns.map((pattern, index) => {
            const isLive = !!pattern.href
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
                  <Link href={pattern.href!} className="group block h-full min-h-0 cursor-pointer">
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

function LiveCard({ pattern }: { pattern: (typeof patterns)[number] }) {
  return (
    <div
      className={`${CARD_BASE} group-hover:[border-color:var(--accent)]`}
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3
          className="min-w-0 flex-1 pr-2 font-semibold leading-[1.25] tracking-[-0.005em] text-balance"
          style={{ fontSize: "var(--text-h3)", color: "var(--text)" }}
        >
          {pattern.name}
        </h3>
        <PillLive />
      </div>
      <p
        className="min-h-0 flex-1 text-pretty leading-[1.6]"
        style={{ fontSize: "var(--text-body)", color: "var(--text-muted)" }}
      >
        {pattern.description}
      </p>
      <div className="mt-auto pt-6">
        <span
          className="inline-flex items-baseline text-[14px] leading-normal"
          style={{ color: "var(--text)", fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          Open pattern
          <span className="ml-[2px]" aria-hidden>
            →
          </span>
        </span>
      </div>
    </div>
  )
}

function ComingSoonCard({ pattern }: { pattern: (typeof patterns)[number] }) {
  return (
    <div
      className={CARD_BASE}
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3
          className="min-w-0 flex-1 pr-2 font-semibold leading-[1.25] tracking-[-0.005em] text-balance opacity-70"
          style={{ fontSize: "var(--text-h3)", color: "var(--text)" }}
        >
          {pattern.name}
        </h3>
        <PillInProgress />
      </div>
      <p
        className="min-h-0 flex-1 text-pretty leading-[1.6]"
        style={{ fontSize: "var(--text-body)", color: "var(--text-muted)" }}
      >
        {pattern.description}
      </p>
      <div className="mt-auto pt-6" aria-hidden />
    </div>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { CircleCheck, Copy, CalendarPlus, FileText, Keyboard } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// ─── types ────────────────────────────────────────────────────────────────────

interface Confidence {
  percent: number
  source: string
  tier: "high" | "low"
}

interface ExampleAction {
  label: string
  icon: React.ReactNode
  verified: boolean
}

interface Example {
  id: string
  cardTag: string
  specimenNumber: string
  specimenQuery: string
  specimenVariant: string
  query: string
  answer: string
  confidence: Confidence
  actions: ExampleAction[]
}

// ─── data ─────────────────────────────────────────────────────────────────────

const EXAMPLES: Example[] = [
  {
    id: "acme",
    cardTag: "Agent · Example 01 · High-Confidence Query",
    specimenNumber: "Example 01",
    specimenQuery: "High-Confidence",
    specimenVariant: "Variant A",
    query: "What's the deadline for the Acme contract renewal?",
    answer: "The Acme contract renewal deadline is March 15, 2026.",
    confidence: {
      percent: 92,
      source: "Verified from Notion doc",
      tier: "high",
    },
    actions: [
      { label: "Copy", icon: <Copy className="size-3" />, verified: false },
      { label: "Add to calendar", icon: <CalendarPlus className="size-3" />, verified: true },
    ],
  },
  {
    id: "revenue",
    cardTag: "Agent · Example 02 · Ambiguous Query",
    specimenNumber: "Example 02",
    specimenQuery: "Ambiguous Query",
    specimenVariant: "Variant B",
    query: "What's our Q2 revenue?",
    answer: "Approximately $4.2M, based on partial data.",
    confidence: {
      percent: 64,
      source: "Partial data, 3 of 5 sources loaded",
      tier: "low",
    },
    actions: [
      { label: "Copy", icon: <Copy className="size-3" />, verified: false },
      { label: "Generate report", icon: <FileText className="size-3" />, verified: false },
    ],
  },
]

// ─── sub-components ───────────────────────────────────────────────────────────

function ConfidencePill({
  confidence,
  prefersReducedMotion,
}: {
  confidence: Confidence
  prefersReducedMotion: boolean | null
}) {
  const isHigh = confidence.tier === "high"
  const color = isHigh ? "var(--success)" : "var(--caution)"

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="inline-flex flex-wrap items-center gap-2"
    >
      <motion.span
        className="block size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
        animate={
          prefersReducedMotion
            ? {}
            : { scale: [1, 1.35, 1], opacity: [0.7, 0.3, 0.7] }
        }
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
      <span className="text-[12px] uppercase tracking-[0.06em]">
        <span style={{ color: "var(--text)", fontWeight: 500 }}>
          {confidence.percent}%
        </span>
        {" "}
        <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
          Confident
        </span>
      </span>
      <span style={{ color: "var(--border-strong)" }}>·</span>
      <span
        className="text-pretty"
        style={{ fontSize: "var(--text-small)", color: "var(--text-muted)" }}
      >
        {confidence.source}
      </span>
    </motion.div>
  )
}

function ActionButton({
  action,
  showVerified,
}: {
  action: ExampleAction
  showVerified: boolean
}) {
  return (
    <button
      className="inline-flex h-7 items-center gap-1.5 rounded-md px-3 text-[13px] transition-colors duration-[180ms]"
      style={{
        border: "1px solid var(--border)",
        color: "var(--text-muted)",
        backgroundColor: "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--bg-subtle)"
        e.currentTarget.style.borderColor = "var(--border-strong)"
        e.currentTarget.style.color = "var(--text)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent"
        e.currentTarget.style.borderColor = "var(--border)"
        e.currentTarget.style.color = "var(--text-muted)"
      }}
    >
      {action.icon}
      {action.label}
      <AnimatePresence>
        {action.verified && showVerified && (
          <motion.span
            key="verified-icon"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18, ease: "easeOut", delay: 0.1 }}
            style={{ color: "var(--success)" }}
          >
            <CircleCheck className="size-3.5" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

function ResponseCard({
  example,
  showIndicator,
  prefersReducedMotion,
  embedded = false,
}: {
  example: Example
  showIndicator: boolean
  prefersReducedMotion: boolean | null
  embedded?: boolean
}) {
  const isHigh = example.confidence.tier === "high"

  const borderColor = showIndicator
    ? isHigh
      ? "color-mix(in srgb, var(--success) 25%, var(--border))"
      : "color-mix(in srgb, var(--caution) 25%, var(--border))"
    : "var(--border)"

  return (
    <div className="flex items-start gap-0">

      {/* Left specimen labels — desktop only, hidden in embedded mode */}
      {!embedded && (
        <div
          aria-hidden="true"
          className="hidden w-24 shrink-0 flex-col gap-1 pr-4 pt-2 lg:flex"
        >
          {[
            example.specimenNumber,
            example.specimenQuery,
            example.specimenVariant,
            "Toggle-Driven",
          ].map((label) => (
            <p
              key={label}
              className="uppercase leading-[1.4] tracking-[0.06em]"
              style={{ fontSize: "10px", color: "var(--text-subtle)" }}
            >
              {label}
            </p>
          ))}
        </div>
      )}

      {/* Card */}
      <div
        className={`min-w-0 flex-1 rounded-xl transition-all duration-[250ms] ${embedded ? "p-5" : "p-6"}`}
        style={{
          border: "1px solid var(--border)",
          backgroundColor: "var(--bg-elevated)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Confidence indicator — animated height to prevent collapse */}
        <AnimatePresence>
          {showIndicator && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
              className="mb-4"
            >
              <ConfidencePill
                confidence={example.confidence}
                prefersReducedMotion={prefersReducedMotion}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Query */}
        <p
          className="mb-2 italic leading-relaxed"
          style={{ fontSize: "15px", color: "var(--text-muted)" }}
        >
          <span
            className="not-italic font-mono text-[12px]"
            style={{ color: "var(--text-subtle)" }}
          >
            /{" "}
          </span>
          {example.query}
        </p>

        {/* Answer */}
        <p
          className="mb-6 text-pretty leading-[1.65]"
          style={{ fontSize: "var(--text-body-lg)", color: "var(--text)", fontWeight: 500 }}
        >
          {example.answer}
        </p>

        {/* Actions */}
        <div
          className="flex flex-wrap items-center gap-2 pt-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {example.actions.map((action) => (
            <ActionButton
              key={action.label}
              action={action}
              showVerified={showIndicator}
            />
          ))}
        </div>
      </div>

      {/* Right specimen timestamp — desktop only, hidden in embedded mode */}
      {!embedded && (
        <div
          aria-hidden="true"
          className="hidden w-10 shrink-0 items-center justify-center pl-3 lg:flex"
          style={{ alignSelf: "stretch" }}
        >
          <p
            className="font-mono tabular-nums"
            style={{
              fontSize: "10px",
              color: "var(--text-subtle)",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              letterSpacing: "0.06em",
            }}
          >
            04.30.2026
          </p>
        </div>
      )}

    </div>
  )
}

// ─── main export ──────────────────────────────────────────────────────────────

export default function ConfidenceIndicatorsDemo({ embedded = false }: { embedded?: boolean }) {
  const prefersReducedMotion = useReducedMotion()

  const [showIndicator, setShowIndicator] = useState<boolean>(() => {
    // Embedded hero preview always starts with indicators visible
    if (embedded) return true
    if (typeof window !== "undefined") {
      return localStorage.getItem("demo-confidence-toggle") === "true"
    }
    return false
  })

  const demoRef = useRef<HTMLDivElement>(null)
  const [demoVisible, setDemoVisible] = useState(true)
  const [announcement, setAnnouncement] = useState("")

  const handleToggle = (val: boolean) => {
    setShowIndicator(val)
    setAnnouncement(`Confidence indicators ${val ? "on" : "off"}`)
    if (!embedded && typeof window !== "undefined") {
      localStorage.setItem("demo-confidence-toggle", String(val))
    }
  }

  // Keyboard shortcut T
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return
      if (e.key === "t" || e.key === "T") handleToggle(!showIndicator)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [showIndicator])

  // IntersectionObserver for sticky toggle — full-page mode only
  useEffect(() => {
    if (embedded) return
    const el = demoRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setDemoVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [embedded])

  const visibleExamples = embedded ? [EXAMPLES[0]] : EXAMPLES

  return (
    <div
      ref={demoRef}
      className={embedded ? "" : "mx-auto max-w-4xl"}
      style={
        embedded
          ? undefined
          : {
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
            }
      }
    >
      {/* Screen reader state announcer */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <div className={embedded ? "p-6" : "py-16"}>

        {/* Demo frame label — full page only */}
        {!embedded && (
          <p
            className="mb-6 text-[12px] font-medium uppercase tracking-[0.08em]"
            style={{ color: "var(--text-subtle)" }}
          >
            Demo / Interactive
          </p>
        )}

        {/* Control surface — sticky on full page, inline on embedded */}
        <AnimatePresence>
          {(embedded || demoVisible) && (
            <motion.div
              key="toggle-bar"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={embedded ? "mb-5" : "sticky top-4 z-20 mb-10"}
            >
              <div
                className="inline-flex items-center gap-3 rounded-lg px-4 py-2.5 backdrop-blur-md"
                style={{
                  backgroundColor: "var(--nav-bg-scrolled)",
                  border: "1px solid var(--border)",
                }}
              >
                <span
                  className="text-[12px] font-medium uppercase tracking-[0.08em]"
                  style={{ color: "var(--text-subtle)" }}
                >
                  State
                </span>

                <div
                  className="h-4 w-px shrink-0"
                  style={{ backgroundColor: "var(--border)" }}
                />

                <Switch
                  checked={showIndicator}
                  onCheckedChange={handleToggle}
                  id={embedded ? "confidence-toggle-embedded" : "confidence-toggle"}
                  aria-label="Toggle confidence indicators on demo"
                  role="switch"
                  aria-checked={showIndicator}
                  className="data-checked:bg-accent"
                />

                <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.08em]">
                  <span
                    className="transition-colors duration-[180ms]"
                    style={{
                      color: !showIndicator ? "var(--text)" : "var(--text-subtle)",
                    }}
                  >
                    Without
                  </span>
                  <span style={{ color: "var(--border-strong)" }}>/</span>
                  <span
                    className="transition-colors duration-[180ms]"
                    style={{
                      color: showIndicator ? "var(--accent)" : "var(--text-subtle)",
                    }}
                  >
                    With
                  </span>
                </div>

                {!embedded && (
                  <>
                    <div
                      className="h-4 w-px shrink-0"
                      style={{ backgroundColor: "var(--border)" }}
                    />
                    <TooltipProvider delay={300}>
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <button
                              type="button"
                              aria-label="Keyboard shortcut: press T to toggle"
                              className="flex items-center justify-center rounded transition-colors duration-[180ms]"
                              style={{ color: "var(--text-subtle)" }}
                              tabIndex={-1}
                            />
                          }
                        >
                          <Keyboard className="size-3.5" strokeWidth={1.75} />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <span className="font-mono">T</span> to toggle
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Example cards */}
        <div className={`flex flex-col ${embedded ? "gap-4" : "gap-10"}`}>
          {visibleExamples.map((example) => (
            <ResponseCard
              key={example.id}
              example={example}
              showIndicator={showIndicator}
              prefersReducedMotion={prefersReducedMotion}
              embedded={embedded}
            />
          ))}
        </div>

      </div>
    </div>
  )
}

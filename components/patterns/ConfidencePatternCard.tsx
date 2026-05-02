"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Copy,
  CalendarPlus,
  CircleCheck,
  FileText,
  Database,
  Mail,
  MessageSquare,
  BarChart2,
} from "lucide-react"
import { SparkleMark } from "@/components/icons/SparkleMark"

// ─── types ────────────────────────────────────────────────────────────────────

export type ConfidenceState = "confident" | "mixed" | "uncertain"

export interface ConfidencePatternCardProps {
  state: ConfidenceState
  showOverflow?: boolean          // show "+12 more" pill in source row, default true
  variant?: "default" | "compact" // compact = smaller padding, inline source count only
  numbered?: boolean              // anatomy callout circles, default false
  showWithWithoutToggle?: boolean // WITH/WITHOUT value-prop toggle, default false
}

interface SourceItem {
  label: string
  icon: React.ReactNode
}

interface CardData {
  percent: number
  color: string
  sourceCount: number  // total sources (displayed inline in pill)
  query: string
  answer: string
  sources: SourceItem[]
}

// ─── data ─────────────────────────────────────────────────────────────────────

const DATA: Record<ConfidenceState, CardData> = {
  confident: {
    percent: 92,
    color: "oklch(0.50 0.13 145)",
    sourceCount: 14,
    query: "What's the deadline for the Acme contract renewal?",
    answer: "The Acme contract renewal deadline is March 15, 2026.",
    sources: [
      { label: "Notion: Contract Terms 2025", icon: <FileText className="size-3 shrink-0" /> },
      { label: "CRM: Acme account history",   icon: <Database className="size-3 shrink-0" /> },
      { label: "Email: Mar 3 confirmation",    icon: <Mail     className="size-3 shrink-0" /> },
    ],
  },
  mixed: {
    percent: 68,
    color: "oklch(0.62 0.14 55)",
    sourceCount: 5,
    query: "What's our Q2 revenue?",
    answer: "Approximately $4.2M based on partial data. Three of five reporting sources are loaded.",
    sources: [
      { label: "Salesforce: Partial pipeline", icon: <Database  className="size-3 shrink-0" /> },
      { label: "Finance sheet: Missing April", icon: <BarChart2  className="size-3 shrink-0" /> },
      { label: "Stripe: Loaded",               icon: <Database  className="size-3 shrink-0" /> },
    ],
  },
  uncertain: {
    percent: 34,
    color: "oklch(0.55 0.16 27)",
    sourceCount: 2,
    query: "What's our current return-to-office policy?",
    answer: "I found references to a policy update but the information is incomplete and may be outdated.",
    sources: [
      { label: "Docs: Index not current",  icon: <FileText      className="size-3 shrink-0" /> },
      { label: "Slack: Unverified thread", icon: <MessageSquare className="size-3 shrink-0" /> },
    ],
  },
}

// Ease matching Material Design standard curve — used for all transitions
const EASE = [0.4, 0, 0.2, 1] as const

// ─── callout circle (anatomy mode) ───────────────────────────────────────────

function Callout({ n }: { n: number }) {
  return (
    <span
      aria-label={`Callout ${n}`}
      className="absolute flex items-center justify-center rounded-full text-[12px] font-semibold"
      style={{
        width: 24, height: 24,
        backgroundColor: "var(--accent)",
        color: "#fff",
        left: -56,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
      }}
    >
      {n}
    </span>
  )
}

// ─── action button ────────────────────────────────────────────────────────────

function ActionBtn({ icon, label, suffix }: {
  icon: React.ReactNode
  label: string
  suffix?: React.ReactNode
}) {
  return (
    <button
      type="button"
      className="inline-flex h-7 items-center gap-1.5 rounded-md px-3 text-[13px] transition-colors duration-[180ms] hover:bg-bg-subtle"
      style={{ border: "1px solid var(--border)", color: "var(--text-muted)", backgroundColor: "transparent" }}
    >
      {icon}{label}{suffix}
    </button>
  )
}

// ─── confidence pill ──────────────────────────────────────────────────────────
// Cross-fades on state change via AnimatePresence key. Static value, no count-up.

function ConfidencePill({ state }: { state: ConfidenceState }) {
  const d = DATA[state]
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: EASE }}
        className="flex items-center gap-2"
      >
        {/* Pulsing dot */}
        <motion.span
          className="block shrink-0 rounded-full"
          style={{ width: 10, height: 10, backgroundColor: d.color }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Percent — weight 500, 15px */}
        <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>
          {d.percent}%
        </span>
        <span style={{ color: "var(--border-strong)" }}>·</span>
        {/* Source summary — 13px muted */}
        <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text-muted)" }}>
          Verified · {d.sourceCount} sources
        </span>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── source pills row (default variant, pattern page only) ───────────────────

function SourcePillRow({ state, showOverflow }: { state: ConfidenceState; showOverflow: boolean }) {
  const d = DATA[state]
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: EASE }}
        className="flex flex-wrap items-center gap-1.5"
      >
        {d.sources.map((src) => (
          <span
            key={src.label}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px]"
            style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-subtle)", color: "var(--text-muted)" }}
          >
            {src.icon}
            {src.label}
          </span>
        ))}
        {showOverflow && (
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-[13px]"
            style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-subtle)", color: "var(--text-subtle)" }}
          >
            +12 more
          </span>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// ─── WITH / WITHOUT segmented toggle ─────────────────────────────────────────

function WithWithoutToggle({ value, onChange }: {
  value: "with" | "without"
  onChange: (v: "with" | "without") => void
}) {
  return (
    <div
      className="mb-4 inline-flex items-center"
      style={{ height: 32, borderRadius: 9999, border: "1px solid var(--border)", backgroundColor: "var(--bg-elevated)", padding: 2 }}
    >
      {(["without", "with"] as const).map((seg) => {
        const active = value === seg
        return (
          <button
            key={seg}
            type="button"
            onClick={() => onChange(seg)}
            className="flex h-full items-center px-3 text-[13px] rounded-full transition-all duration-200"
            style={{
              backgroundColor: active ? "var(--accent)" : "transparent",
              color: active ? "#fff" : "var(--text-muted)",
            }}
          >
            {seg === "without" ? "Without" : "With"}
          </button>
        )
      })}
    </div>
  )
}

// ─── canonical component ──────────────────────────────────────────────────────

export default function ConfidencePatternCard({
  state,
  showOverflow = true,
  variant = "default",
  numbered = false,
  showWithWithoutToggle = false,
}: ConfidencePatternCardProps) {
  const data = DATA[state]
  const [withState, setWithState] = useState<"with" | "without">("with")

  const showMetadata = numbered || withState === "with"
  const showSourcePills = variant !== "compact" // compact: count inline in pill only
  const pad = variant === "compact" ? "p-5" : "p-7"

  return (
    <div className={`relative ${numbered ? "ml-8" : ""}`}>

      {/* WITH / WITHOUT toggle — homepage only */}
      {showWithWithoutToggle && (
        <WithWithoutToggle value={withState} onChange={setWithState} />
      )}

      <div
        className={`rounded-xl ${pad}`}
        style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
      >

        {/* ── Metadata block: confidence pill + optional source pills ── */}
        {numbered ? (
          // Anatomy mode: always visible, no height animation
          <>
            <div className="relative mb-3">
              <Callout n={1} />
              <ConfidencePill state={state} />
            </div>
            {showSourcePills && (
              <div className="relative mb-4">
                <Callout n={2} />
                <SourcePillRow state={state} showOverflow={showOverflow} />
              </div>
            )}
            <div className="mb-4" style={{ borderTop: "1px solid var(--border)" }} />
          </>
        ) : (
          <AnimatePresence>
            {showMetadata && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
                style={{ overflow: "hidden" }}
              >
                <div className="mb-3">
                  <ConfidencePill state={state} />
                </div>
                {showSourcePills && (
                  <div className="mb-4">
                    <SourcePillRow state={state} showOverflow={showOverflow} />
                  </div>
                )}
                {/* Divider only visible in "with" mode */}
                <div className="mb-4" style={{ borderTop: "1px solid var(--border)" }} />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ── Conversation block ──────────────────────────────────────── */}
        <div className="relative">
          {numbered && <Callout n={3} />}

          {/* User query — right-aligned bubble, asymmetric radius */}
          <div className="mb-4 flex justify-end">
            <div
              className="max-w-[75%] bg-bg-subtle dark:bg-[oklch(0.22_0.005_250)] text-[15px] leading-[1.5]"
              style={{
                padding: "10px 14px",
                borderRadius: "18px 18px 4px 18px",
                color: "var(--text)",
              }}
            >
              {data.query}
            </div>
          </div>

          {/* Agent response — sparkle mark + plain prose, no bubble */}
          <div className="flex items-start gap-3">
            <SparkleMark className="mt-0.5 shrink-0" />
            <AnimatePresence mode="wait">
              <motion.p
                key={state}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: EASE }}
                className="text-pretty leading-[1.6]"
                style={{ fontSize: 15, color: "var(--text)", fontWeight: 400 }}
              >
                {data.answer}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Divider + action buttons ────────────────────────────────── */}
        <div
          className="relative mt-5 pt-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {numbered && <Callout n={4} />}
          <div className="flex flex-wrap items-center gap-2">
            <ActionBtn icon={<Copy className="size-3" />} label="Copy" />
            {state === "confident" && (
              <ActionBtn
                icon={<CalendarPlus className="size-3" />}
                label="Add to calendar"
                suffix={<CircleCheck className="size-3.5" style={{ color: "var(--success)" }} />}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

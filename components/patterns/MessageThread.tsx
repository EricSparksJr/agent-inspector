"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Copy,
  CalendarPlus,
  RotateCcw,
  ChevronDown,
  FileText,
  Database,
  Mail,
  MessageSquare,
  Check,
  ArrowUp,
} from "lucide-react"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

// ─── types (re-exported from shared data module) ─────────────────────────────

export type {
  SourceType,
  ConfidenceTier,
  Citation,
  Source,
  UserMessage,
  AssistantMessage,
  Message,
} from "./messageThreadData"

export {
  DEMO_MESSAGES,
  DEMO_MESSAGES_SINGLE,
  DEMO_SOURCES_T1,
  DEMO_SOURCES_T2,
} from "./messageThreadData"

import type {
  SourceType,
  ConfidenceTier,
  Citation,
  Source,
  UserMessage,
  AssistantMessage,
  Message,
} from "./messageThreadData"

export interface MessageThreadProps {
  messages: Message[]
  maxHeight?: number
  numbered?: boolean              // anatomy callout mode
  showWithWithoutToggle?: boolean // homepage value-prop toggle
  variant?: "default" | "compact"
}

// ─── constants ────────────────────────────────────────────────────────────────

const TIER_COLOR: Record<ConfidenceTier, string> = {
  high:   "oklch(0.50 0.13 145)",
  medium: "oklch(0.62 0.14 55)",
  low:    "oklch(0.55 0.16 27)",
}
const TIER_LABEL: Record<ConfidenceTier, string> = {
  high: "Confident", medium: "Mixed", low: "Uncertain",
}
const SOURCE_ICONS: Record<SourceType, React.ElementType> = {
  notion: FileText, crm: Database, email: Mail, doc: FileText, slack: MessageSquare,
}

const EASE = [0.4, 0, 0.2, 1] as const


// ─── anatomy callout circle ───────────────────────────────────────────────────

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
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {n}
    </span>
  )
}

// ─── inline citation pill with popover ───────────────────────────────────────

function InlineCitationPill({
  citation,
  sources,
  isFirst,
  numbered,
  stripped,
}: {
  citation: Citation
  sources: Source[]
  isFirst: boolean
  numbered: boolean
  stripped: boolean
}) {
  const source = sources.find((s) => s.id === citation.sourceId)
  const Icon = SOURCE_ICONS[source?.type ?? "doc"]

  if (stripped) return null

  return (
    <PopoverPrimitive.Root>
      <span className="relative inline-flex items-center">
        {numbered && isFirst && <Callout n={1} />}
        <PopoverPrimitive.Trigger
          render={
            <button
              type="button"
              aria-label={`Citation ${citation.id}: ${source?.title ?? "source"}`}
              className="mx-0.5 inline-flex items-center rounded px-1.5 py-0.5 text-[12px] transition-colors duration-[120ms] hover:bg-bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{
                backgroundColor: "var(--bg-subtle)",
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                // focus ring color
                ["--tw-ring-color" as string]: "var(--accent)",
              }}
            />
          }
        >
          [{citation.id}]
        </PopoverPrimitive.Trigger>
      </span>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner side="top" sideOffset={6} className="z-50">
          <PopoverPrimitive.Popup
            className="w-64 rounded-xl p-3 text-[13px] shadow-lg animate-in fade-in-0 zoom-in-95 duration-100"
            style={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div className="mb-2 flex items-center gap-1.5">
              <Icon className="size-3.5 shrink-0" style={{ color: "var(--text-subtle)" }} />
              <span className="font-medium leading-snug" style={{ color: "var(--text)" }}>
                {source?.title ?? "Unknown source"}
              </span>
              {source?.verified && (
                <Check className="ml-auto size-3 shrink-0" style={{ color: "var(--success)" }} />
              )}
            </div>
            <p
              className="leading-[1.5] text-pretty"
              style={{ color: "var(--text-muted)" }}
            >
              "{citation.quote}"
            </p>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

// ─── parse content with citation markers ─────────────────────────────────────

function renderContent(
  content: string,
  citations: Citation[],
  sources: Source[],
  numbered: boolean,
  stripped: boolean
): React.ReactNode {
  const parts = content.split(/(\[\d+\])/g)
  let firstCitation = true
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/)
    if (match) {
      const id = parseInt(match[1])
      const citation = citations.find((c) => c.id === id)
      if (citation) {
        const isFirst = firstCitation
        firstCitation = false
        return (
          <InlineCitationPill
            key={i}
            citation={citation}
            sources={sources}
            isFirst={isFirst}
            numbered={numbered}
            stripped={stripped}
          />
        )
      }
    }
    return <span key={i}>{part}</span>
  })
}

// ─── source pill (inside collapsible) ────────────────────────────────────────

function SourcePill({ source }: { source: Source }) {
  const Icon = SOURCE_ICONS[source.type]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px]"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--bg-subtle)",
        color: "var(--text-muted)",
        opacity: source.verified ? 1 : 0.65,
      }}
    >
      <Icon className="size-3 shrink-0" />
      {source.title}
      {!source.verified && (
        <span style={{ color: "var(--caution)", fontSize: 10, marginLeft: 2 }}>●</span>
      )}
    </span>
  )
}

// ─── collapsible sources disclosure ──────────────────────────────────────────

function SourcesDisclosure({
  sources,
  numbered,
}: {
  sources: Source[]
  numbered: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <CollapsiblePrimitive.Root open={open} onOpenChange={setOpen}>
      <div className="relative inline-flex items-center">
        {numbered && <Callout n={3} />}
        <CollapsiblePrimitive.Trigger
          className="flex items-center gap-1 text-[13px] transition-colors duration-[120ms] hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          style={{
            color: "var(--accent)",
            ["--tw-ring-color" as string]: "var(--accent)",
          }}
        >
          Used {sources.length} sources
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="inline-flex"
          >
            <ChevronDown className="size-3.5" />
          </motion.span>
        </CollapsiblePrimitive.Trigger>
      </div>

      <CollapsiblePrimitive.Panel>
        <motion.div
          initial={false}
          animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          style={{ overflow: "hidden" }}
        >
          <div className="mt-2 flex flex-wrap gap-1.5">
            {sources.map((src) => (
              <SourcePill key={src.id} source={src} />
            ))}
          </div>
        </motion.div>
      </CollapsiblePrimitive.Panel>
    </CollapsiblePrimitive.Root>
  )
}

// ─── per-message action buttons ──────────────────────────────────────────────

function MessageActions({
  isHighConfidence,
  numbered,
}: {
  isHighConfidence: boolean
  numbered: boolean
}) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="relative ml-auto flex items-center gap-0.5">
      {numbered && <Callout n={4} />}
      <IconBtn
        icon={copied ? <Check className="size-3.5" style={{ color: "var(--success)" }} /> : <Copy className="size-3.5" />}
        label="Copy"
        onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      />
      <IconBtn icon={<RotateCcw className="size-3.5" />} label="Regenerate" />
      {isHighConfidence && (
        <IconBtn icon={<CalendarPlus className="size-3.5" />} label="Add to calendar" />
      )}
    </div>
  )
}

function IconBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-7 items-center justify-center rounded-md transition-colors duration-[120ms] hover:bg-bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      style={{
        color: "var(--text-subtle)",
        ["--tw-ring-color" as string]: "var(--accent)",
      }}
    >
      {icon}
    </button>
  )
}

// ─── user turn ────────────────────────────────────────────────────────────────

function UserTurn({ message }: { message: UserMessage }) {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-[75%] bg-bg-subtle dark:bg-[oklch(0.22_0.005_250)] text-[15px] leading-[1.5]"
        style={{
          padding: "10px 14px",
          borderRadius: "18px 18px 4px 18px",
          color: "var(--text)",
        }}
      >
        {message.content}
      </div>
    </div>
  )
}

// ─── assistant turn ───────────────────────────────────────────────────────────

function AssistantTurn({
  message,
  showMetadata,
  numbered,
}: {
  message: AssistantMessage
  showMetadata: boolean
  numbered: boolean
}) {
  const isHighConfidence = message.confidence.tier === "high"
  const color = TIER_COLOR[message.confidence.tier]

  return (
    <div className="flex items-start gap-3">
      {/* Assistant indicator — solid accent star (no stroke / gradient) */}
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mt-0.5 shrink-0"
        aria-hidden
      >
        <path
          d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
          fill="var(--accent)"
        />
      </svg>

      <div className="min-w-0 flex-1">
        {/* Prose with inline citations */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`${message.id}-content`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: EASE }}
            className="leading-[1.6] text-pretty"
            style={{ fontSize: 15, color: "var(--text)", fontWeight: 400 }}
          >
            {renderContent(
              message.content,
              message.citations,
              message.sources,
              numbered,
              !showMetadata
            )}
          </motion.p>
        </AnimatePresence>

        {/* Metadata strip */}
        <AnimatePresence>
          {showMetadata && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
              style={{ overflow: "hidden" }}
            >
              <div
                className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px]"
                style={{ color: "var(--text-muted)" }}
              >
                {/* Confidence pill */}
                <div className="relative flex items-center gap-1.5">
                  {numbered && <Callout n={2} />}
                  <motion.span
                    className="block shrink-0 rounded-full"
                    style={{ width: 8, height: 8, backgroundColor: color }}
                    animate={{ scale: [1, 1.25, 1], opacity: [0.65, 1, 0.65] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span style={{ fontWeight: 500, color: "var(--text)" }}>
                    {message.confidence.percent}%
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {TIER_LABEL[message.confidence.tier]}
                  </span>
                </div>

                <span style={{ color: "var(--border-strong)" }}>·</span>

                {/* Sources collapsible */}
                <SourcesDisclosure sources={message.sources} numbered={numbered} />

                {/* Right-aligned actions */}
                <MessageActions isHighConfidence={isHighConfidence} numbered={numbered} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── WITH / WITHOUT toggle ────────────────────────────────────────────────────

function WithWithoutToggle({
  value,
  onChange,
}: {
  value: "with" | "without"
  onChange: (v: "with" | "without") => void
}) {
  return (
    <div
      className="mb-4 inline-flex items-center"
      style={{
        height: 32,
        borderRadius: 9999,
        border: "1px solid var(--border)",
        backgroundColor: "var(--bg-elevated)",
        padding: 2,
      }}
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

// ─── canonical MessageThread component ───────────────────────────────────────

export default function MessageThread({
  messages,
  maxHeight,
  numbered = false,
  showWithWithoutToggle = false,
  variant = "default",
}: MessageThreadProps) {
  const [withState, setWithState] = useState<"with" | "without">("with")
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [messages])

  // "Scroll to latest" button via IntersectionObserver
  useEffect(() => {
    if (!bottomRef.current || !containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowScrollBtn(!entry.isIntersecting),
      { root: containerRef.current, threshold: 0 }
    )
    observer.observe(bottomRef.current)
    return () => observer.disconnect()
  }, [])

  const resolvedMaxHeight = numbered ? undefined : (maxHeight ?? (variant === "compact" ? 480 : 600))
  const showMetadata = withState === "with"
  const pad = variant === "compact" ? "p-5" : "p-6"

  return (
    <div className={`relative ${numbered ? "ml-10" : ""}`}>

      {showWithWithoutToggle && (
        <WithWithoutToggle value={withState} onChange={setWithState} />
      )}

      {/* Card shell */}
      <div
        className="relative rounded-xl"
        style={{
          backgroundColor: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
          overflow: "hidden",
        }}
      >
        {/* Scrollable message list */}
        <div
          ref={containerRef}
          className="overflow-y-auto"
          style={{ maxHeight: resolvedMaxHeight }}
        >
          <div className={`flex flex-col gap-5 ${pad}`}>
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => {
                const isLastAssistant =
                  msg.role === "assistant" &&
                  messages.slice(i + 1).every((m) => m.role === "user")

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                  >
                    {msg.role === "user" ? (
                      <UserTurn message={msg} />
                    ) : (
                      <AssistantTurn
                        message={msg as AssistantMessage}
                        showMetadata={showMetadata}
                        numbered={numbered && isLastAssistant}
                      />
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Static follow-up composer (visual demo only; not wired to input handlers) */}
        <div className="shrink-0">
          <div
            className="mx-4 h-px shrink-0"
            style={{ backgroundColor: "var(--border)" }}
          />
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="inline-flex items-center gap-0">
              <span
                className="text-[15px] leading-[1.6]"
                style={{ color: "#94949C" }}
              >
                Ask a follow-up
              </span>
              <span
                className="followup-composer-caret ml-px inline-block shrink-0 align-middle"
                aria-hidden
              />
            </span>
            <button
              type="button"
              aria-label="Send message"
              className="followup-composer-send group inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#F5F5F7] p-0 text-[#94949C] shadow-none outline-none transition-colors duration-[120ms] hover:bg-[#EBEBED] hover:text-[#28251D] focus:outline-none focus-visible:outline-none dark:bg-[rgba(255,255,255,0.06)] dark:text-[#94949C] dark:hover:bg-[rgba(255,255,255,0.1)] dark:hover:text-white"
            >
              <ArrowUp className="size-3.5 shrink-0" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Scroll-to-latest floater */}
        <AnimatePresence>
          {showScrollBtn && !numbered && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              onClick={() =>
                bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
              }
              className="absolute bottom-[5.25rem] right-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] transition-colors duration-[120ms]"
              style={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <ChevronDown className="size-3" />
              Latest
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

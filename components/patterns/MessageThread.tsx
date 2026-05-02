"use client"

import { useState, useRef, useEffect, useId, type CSSProperties } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  Copy,
  RotateCcw,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Database,
  Mail,
  MessageSquare,
  Check,
  ArrowUp,
} from "lucide-react"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"
import { DemoGroundingSignalsTray } from "@/components/patterns/DemoGroundingSignalsTray"

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
  showWithWithoutToggle?: boolean // homepage value-prop toggle
  /** When true with showWithWithoutToggle, renders Off/On inside the card header (confidence demo). */
  patternToggleInsideCard?: boolean
  variant?: "default" | "compact"
  /** Industry-style metadata rail + expandable sources (Confidence Indicators demo only). */
  researchRailFooter?: boolean
  /** Optional left offset for anatomy layouts that reserve a legend gutter. */
  numbered?: boolean
}

// ─── constants ────────────────────────────────────────────────────────────────

const TIER_DOT_COLOR: Record<ConfidenceTier, string> = {
  high: "#1F8B4C",
  medium: "#C8881C",
  low: "#C42929",
}
const TIER_HEADLINE: Record<ConfidenceTier, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
}

/** Confidence chip popover: Sources + Recency lines per tier (fixed copy). */
const CHIP_POPOVER_LINES: Record<
  ConfidenceTier,
  { sourcesValue: string; recencyValue: string }
> = {
  high: {
    sourcesValue: "3 verified",
    recencyValue: "within 30 days",
  },
  medium: {
    sourcesValue: "2 verified \u00b7 1 outdated",
    recencyValue: "mixed (last 6 months)",
  },
  low: {
    sourcesValue: "1 verified \u00b7 2 unverified",
    recencyValue: "outdated (90+ days)",
  },
}
const SOURCE_ICONS: Record<SourceType, React.ElementType> = {
  notion: FileText, crm: Database, email: Mail, doc: FileText, slack: MessageSquare,
}

const EASE = [0.4, 0, 0.2, 1] as const

function confidenceReasoning(message: AssistantMessage): string {
  const verified = message.sources.filter((s) => s.verified).length
  const vLabel = verified === 1 ? "source" : "sources"
  switch (message.confidence.tier) {
    case "high":
      return `Based on ${verified} verified ${vLabel}, with recent matching sources and no conflicting signals.`
    case "medium":
      return `Based on ${verified} verified ${vLabel} and partial context. Verify before acting.`
    case "low":
      return `Sources are limited or unverified. Confirm before you rely on this.`
    default:
      return ""
  }
}

function ConfidenceChipPopover({
  message,
  triggerClassName,
  labelClassName,
  dotClassName,
  labelStyle,
}: {
  message: AssistantMessage
  triggerClassName?: string
  labelClassName?: string
  dotClassName?: string
  labelStyle?: CSSProperties
}) {
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const dotColor = TIER_DOT_COLOR[message.confidence.tier]
  const tierLabel = TIER_HEADLINE[message.confidence.tier]
  const lines = CHIP_POPOVER_LINES[message.confidence.tier]
  const tierTitleId = useId()
  const popoverDescId = useId()

  const valueNumericStyle: CSSProperties = {
    color: "var(--text)",
    fontVariantNumeric: "lining-nums tabular-nums",
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={(next) => setOpen(next)}>
      <PopoverPrimitive.Trigger
        type="button"
        role="button"
        tabIndex={0}
        openOnHover
        delay={150}
        closeDelay={100}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          "inline-flex cursor-default items-center gap-1.5 rounded border-0 bg-transparent p-0 font-[inherit] text-[inherit] outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]",
          triggerClassName,
        )}
        aria-label={`${tierLabel}. Open detail panel for trust summary.`}
      >
        <span
          aria-hidden
          className={cn("block shrink-0 rounded-full", dotClassName ?? "size-1.5")}
          style={{ backgroundColor: dotColor }}
        />
        <span className={cn(labelClassName)} style={labelStyle}>
          {tierLabel}
        </span>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner side="top" sideOffset={8} className="z-50">
          <PopoverPrimitive.Popup
            role="tooltip"
            aria-modal={false}
            initialFocus={false}
            finalFocus={false}
            aria-labelledby={tierTitleId}
            aria-describedby={popoverDescId}
            className={cn(
              "max-w-[280px] rounded-[10px] p-4 outline-none [font-family:var(--font-sans),system-ui,sans-serif]",
              reduceMotion
                ? "transition-opacity duration-[80ms] ease-out data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
                : "transition-[opacity,transform] duration-[160ms] ease-out data-[starting-style]:translate-y-1 data-[starting-style]:opacity-0 data-[ending-style]:translate-y-1 data-[ending-style]:opacity-0 data-[ending-style]:duration-[120ms] data-[ending-style]:ease-in",
            )}
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              boxShadow: "var(--card-shadow-elevated)",
            }}
          >
            <PopoverPrimitive.Title
              id={tierTitleId}
              className="m-0 flex items-center gap-2 text-[13px] font-medium leading-tight"
              style={{ color: "var(--text)" }}
            >
              <span
                aria-hidden
                className="block size-2 shrink-0 rounded-full"
                style={{ backgroundColor: dotColor }}
              />
              {tierLabel}
            </PopoverPrimitive.Title>

            <div id={popoverDescId} className="mt-3">
              <div className="flex flex-row items-center gap-1.5 text-[13px] font-normal leading-snug">
                <span className="shrink-0" style={{ color: "var(--text-muted)" }}>
                  Sources:
                </span>
                <span style={valueNumericStyle}>{lines.sourcesValue}</span>
              </div>
              <div className="mt-1.5 flex flex-row items-center gap-1.5 text-[13px] font-normal leading-snug">
                <span className="shrink-0" style={{ color: "var(--text-muted)" }}>
                  Recency:
                </span>
                <span style={valueNumericStyle}>{lines.recencyValue}</span>
              </div>
            </div>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

function InlineCitationPill({
  citation,
  sources,
  stripped,
}: {
  citation: Citation
  sources: Source[]
  stripped: boolean
}) {
  const source = sources.find((s) => s.id === citation.sourceId)
  const Icon = SOURCE_ICONS[source?.type ?? "doc"]

  if (stripped) return null

  return (
    <PopoverPrimitive.Root>
      <span className="inline-flex items-center">
        <PopoverPrimitive.Trigger
          render={
            <button
              type="button"
              aria-label={`Citation ${citation.id}: ${source?.title ?? "source"}`}
              className={
                "mx-0.5 inline-flex items-center rounded px-1.5 py-0.5 text-[12px] transition-colors duration-[120ms] hover:bg-bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              }
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
              {'"'}{citation.quote}{'"'}
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
  stripped: boolean
): React.ReactNode {
  const parts = content.split(/(\[\d+\])/g)
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/)
    if (match) {
      const id = parseInt(match[1])
      const citation = citations.find((c) => c.id === id)
      if (citation) {
        return (
          <InlineCitationPill
            key={i}
            citation={citation}
            sources={sources}
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

function SourcesDisclosure({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false)

  return (
    <CollapsiblePrimitive.Root open={open} onOpenChange={setOpen}>
      <div className="inline-flex items-center">
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
          <div className="mt-2 flex flex-wrap gap-1.5 pb-4">
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

function MessageActions() {
  const [copied, setCopied] = useState(false)

  return (
    <div className="ml-auto flex items-center gap-0.5">
      <IconBtn
        icon={copied ? <Check className="size-3.5" style={{ color: "var(--success)" }} /> : <Copy className="size-3.5" />}
        label="Copy"
        onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      />
      <IconBtn icon={<RotateCcw className="size-3.5" />} label="Regenerate" />
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

function AssistantSingleRowFooter({ message }: { message: AssistantMessage }) {
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const sourcesPanelId = useId()
  const n = message.sources.length
  const sourcesLabel = n === 1 ? "source" : "sources"

  return (
    <div className="flex flex-col">
      {/* Single-row metadata strip */}
      <div
        className="mt-3 flex items-center text-[12px] leading-normal"
        style={{
          color: "var(--text-muted)",
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        {/* Confidence chip + teaching popover */}
        <ConfidenceChipPopover message={message} />

        {/* 16px gap */}
        <span className="w-4 shrink-0" aria-hidden />

        {/* Sources toggle button */}
        <button
            type="button"
            aria-expanded={sourcesOpen}
            aria-controls={sourcesPanelId}
            onClick={() => setSourcesOpen((o) => !o)}
            className={
              "group/sources inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-[inherit] outline-none transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]"
            }
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted)"
            }}
          >
            <span className="transition-[text-decoration-color] duration-150 group-hover/sources:underline">
              {n} {sourcesLabel}
            </span>
            <motion.span
              aria-hidden
              animate={{ rotate: sourcesOpen ? 180 : 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex"
            >
              <ChevronDown className="size-3" strokeWidth={2} />
            </motion.span>
        </button>

        {/* Spacer pushes actions to right */}
        <span className="flex-1" aria-hidden />

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <FooterIconBtn
            label="Copy message"
            onClick={() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
          >
            {copied ? (
              <Check
                className="size-3.5 stroke-[1.75]"
                style={{ color: "var(--success)" }}
              />
            ) : (
              <Copy className="size-3.5 stroke-[1.75]" />
            )}
          </FooterIconBtn>
          <FooterIconBtn label="Regenerate response">
            <RotateCcw className="size-3.5 stroke-[1.75]" />
          </FooterIconBtn>
          <FooterIconBtn label="Helpful">
            <ThumbsUp className="size-3.5 stroke-[1.75]" />
          </FooterIconBtn>
          <FooterIconBtn label="Not helpful">
            <ThumbsDown className="size-3.5 stroke-[1.75]" />
          </FooterIconBtn>
        </div>
      </div>

      {/* Expandable sources panel */}
      <motion.div
        id={sourcesPanelId}
        role="region"
        aria-label="Sources"
        aria-hidden={!sourcesOpen}
        initial={false}
        animate={
          sourcesOpen
            ? { height: "auto", opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ overflow: "hidden" }}
      >
        <div className="flex flex-wrap gap-1.5 pt-3 pb-2">
          {message.sources.map((src) => (
            <SourcePill key={src.id} source={src} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function FooterIconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-6 shrink-0 items-center justify-center rounded-md outline-none transition-colors duration-150 hover:bg-[rgba(0,0,0,0.04)] hover:[color:var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]"
      style={{ color: "var(--text-muted)" }}
    >
      {children}
    </button>
  )
}

// ─── assistant turn ───────────────────────────────────────────────────────────

function AssistantTurn({
  message,
  showMetadata,
  researchRailFooter,
}: {
  message: AssistantMessage
  showMetadata: boolean
  researchRailFooter: boolean
}) {
  const reasoningText = confidenceReasoning(message)
  const sparkleGradId = `ai-sparkle-gradient-msg-${useId().replace(/:/g, "")}`

  return (
    <div className="flex items-start gap-3">
      {/* Assistant indicator - 8-point sparkle */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        className="mt-0.5 shrink-0"
        aria-hidden
      >
        <defs>
          <linearGradient
            id={sparkleGradId}
            x1={2}
            y1={2}
            x2={22}
            y2={22}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#0070F3" />
            <stop offset="100%" stopColor="#5AA9FF" />
          </linearGradient>
        </defs>
        <path
          d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z"
          fill={`url(#${sparkleGradId})`}
        />
        <path
          d="M19 14L19.7 17.3L23 18L19.7 18.7L19 22L18.3 18.7L15 18L18.3 17.3L19 14Z"
          fill={`url(#${sparkleGradId})`}
          opacity={0.7}
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
              !showMetadata,
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
              {researchRailFooter ? (
                <AssistantSingleRowFooter message={message} />
              ) : (
                <div className="mt-3 flex flex-col gap-2 pb-0 pt-1">
                  {/* Categorical confidence + reasoning (calm sentence) */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <ConfidenceChipPopover
                      message={message}
                      triggerClassName="inline-flex max-w-full shrink-0 px-[3px] py-[3px]"
                      labelClassName="text-[14px] font-normal leading-snug"
                      labelStyle={{
                        color: "var(--text)",
                        fontFamily: "var(--font-sans), system-ui, sans-serif",
                      }}
                      dotClassName="size-2"
                    />
                    <span
                      className="min-w-0 flex-1 text-pretty text-[14px] font-normal leading-snug"
                      style={{
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-sans), system-ui, sans-serif",
                      }}
                    >
                      {reasoningText}
                    </span>
                  </div>

                  {/* Sources disclosure + actions */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <SourcesDisclosure sources={message.sources} />
                    <MessageActions />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── OFF / ON pattern toggle (hero demo) ─────────────────────────────────────

function WithWithoutToggle({
  value,
  onChange,
}: {
  value: "with" | "without"
  onChange: (v: "with" | "without") => void
}) {
  const prefersReducedMotion = useReducedMotion()
  const isOn = value === "with"

  return (
    <div
      role="switch"
      aria-checked={isOn}
      aria-label="Pattern: off or on"
      tabIndex={0}
      className={cn(
        "relative mb-4 inline-grid shrink-0 grid-cols-2 self-start rounded-full p-[3px] outline-none",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]",
      )}
      style={{
        borderRadius: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.04)",
      }}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault()
          onChange(isOn ? "without" : "with")
          return
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault()
          onChange("without")
        }
        if (e.key === "ArrowRight") {
          e.preventDefault()
          onChange("with")
        }
      }}
    >
      {/* Sliding active thumb */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-[3px] top-[3px] bottom-[3px] z-0 rounded-full"
        style={{
          width: "calc(50% - 3px)",
          backgroundColor: "var(--accent)",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
          borderRadius: 9999,
          transform: value === "without" ? "translateX(0)" : "translateX(100%)",
          transition: prefersReducedMotion
            ? "none"
            : "transform 240ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      />

      {(["without", "with"] as const).map((seg) => {
        const active = value === seg
        const label = seg === "without" ? "Off" : "On"
        return (
          <button
            key={seg}
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={() => onChange(seg)}
            className={cn(
              "relative z-10 flex w-full min-w-0 cursor-pointer items-center justify-center px-[14px] py-[6px] text-[13px] font-medium leading-normal tracking-normal outline-none transition-colors duration-[120ms]",
              active ? "text-white" : "text-[var(--text-muted)] hover:[color:var(--text)]",
            )}
            style={{
              fontFamily: "var(--font-sans), system-ui, sans-serif",
            }}
          >
            {label}
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
  showWithWithoutToggle = false,
  patternToggleInsideCard = false,
  variant = "default",
  researchRailFooter = false,
  numbered = false,
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

  const resolvedMaxHeight = maxHeight ?? (variant === "compact" ? 480 : 600)
  const showMetadata = withState === "with"
  const padBottom = researchRailFooter ? "pb-4" : "pb-6"
  const toggleInsideCard = Boolean(showWithWithoutToggle && patternToggleInsideCard)
  const padClasses =
    variant === "compact"
      ? cn("px-5 pt-6", padBottom)
      : cn("px-6 pt-6", padBottom)
  const scrollInnerPad = toggleInsideCard
    ? variant === "compact"
      ? cn("px-5 pb-6 pt-6", padBottom)
      : cn("px-6 pb-6 pt-6", padBottom)
    : padClasses
  // Composer caret aligns with assistant sparkle center: pad-left plus half sparkle (8px) minus half caret (0.75px)
  const composerPadInline =
    variant === "compact"
      ? { paddingLeft: "calc(1.25rem + 8px - 0.75px)", paddingRight: "1.25rem" }
      : { paddingLeft: "calc(1.5rem + 8px - 0.75px)", paddingRight: "1.5rem" }
  const composerHairlineInset = variant === "compact" ? "mx-5" : "mx-6"

  return (
    <div
      className={cn("relative flex flex-col", numbered && "ml-10")}
    >
      {showWithWithoutToggle && !patternToggleInsideCard && (
        <WithWithoutToggle value={withState} onChange={setWithState} />
      )}

      {/* Card shell */}
      <div
        className="relative rounded-xl"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        {toggleInsideCard && (
          <DemoGroundingSignalsTray
            variant={variant === "compact" ? "compact" : "default"}
            value={withState}
            onChange={setWithState}
          />
        )}

        {/* Scrollable message list */}
        <div
          ref={containerRef}
          className="overflow-y-auto"
          style={{ maxHeight: resolvedMaxHeight }}
        >
          <div className={cn("flex flex-col", scrollInnerPad)}>
            <div className="flex flex-col gap-5">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
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
                        researchRailFooter={researchRailFooter}
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div ref={bottomRef} className="h-0 shrink-0" aria-hidden />
          </div>
        </div>

        {/* Static follow-up composer (visual demo only; not wired to input handlers) */}
        <div className="shrink-0">
          <div
            className={`${composerHairlineInset} h-px shrink-0`}
            style={{ backgroundColor: "var(--border)" }}
          />
          <div
            className="flex items-center justify-between py-3.5"
            style={composerPadInline}
          >
            <div className="flex min-w-0 items-center gap-[3px]">
              <span className="followup-composer-caret" aria-hidden />
              <span
                className="text-[15px] leading-[1.6]"
                style={{ color: "#94949C" }}
              >
                Ask a follow-up
              </span>
            </div>
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
          {showScrollBtn && (
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

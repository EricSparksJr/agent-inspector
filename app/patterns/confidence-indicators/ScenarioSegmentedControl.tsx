"use client"

import { useCallback, useRef, type KeyboardEvent } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

const SCENARIO_ORDER = ["confident", "uncertain", "conversation"] as const
export type ScenarioKey = (typeof SCENARIO_ORDER)[number]

const LABELS: Record<ScenarioKey, string> = {
  confident: "Confident",
  uncertain: "Uncertain",
  conversation: "Conversation",
}

export default function ScenarioSegmentedControl({
  active,
  onChange,
}: {
  active: ScenarioKey
  onChange: (key: ScenarioKey) => void
}) {
  const reduceMotion = useReducedMotion()
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])

  const focusIndex = useCallback((idx: number) => {
    queueMicrotask(() => tabsRef.current[idx]?.focus())
  }, [])

  const onButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      const next = (idx + 1) % SCENARIO_ORDER.length
      onChange(SCENARIO_ORDER[next])
      focusIndex(next)
      return
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      const prev = (idx - 1 + SCENARIO_ORDER.length) % SCENARIO_ORDER.length
      onChange(SCENARIO_ORDER[prev])
      focusIndex(prev)
    }
  }

  const springTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 500, damping: 35 }

  return (
    <div
      role="tablist"
      aria-label="Demo scenario"
      className="mb-8 inline-flex w-full max-w-full items-center gap-0 rounded-full p-1 md:w-auto"
      style={{ backgroundColor: "var(--bg-subtle)" }}
    >
      {SCENARIO_ORDER.map((key, idx) => {
        const selected = key === active
        return (
          <button
            key={key}
            ref={(el) => {
              tabsRef.current[idx] = el
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            id={`scenario-tab-${key}`}
            onClick={() => onChange(key)}
            onKeyDown={(e) => onButtonKeyDown(e, idx)}
            className={cn(
              "relative z-10 flex-1 basis-0 rounded-full px-4 py-1.5 text-center text-[14px] font-medium outline-none transition-colors duration-200 ease-out md:flex-none md:basis-auto",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]",
              !selected &&
                "text-[var(--text-muted)] hover:bg-black/5 hover:text-[var(--text)]",
              selected && "text-[var(--text)]",
            )}
          >
            {selected && (
              <motion.span
                layoutId="scenario-active-pill"
                transition={springTransition}
                className="pointer-events-none absolute inset-0 -z-10 rounded-full"
                style={{
                  backgroundColor: "var(--card-bg)",
                  boxShadow:
                    "0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 1px rgba(0, 0, 0, 0.04)",
                }}
              />
            )}
            <span className="relative">{LABELS[key]}</span>
          </button>
        )
      })}
    </div>
  )
}

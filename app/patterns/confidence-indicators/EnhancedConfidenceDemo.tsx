"use client"

import { useState, useEffect } from "react"
import MessageThread from "@/components/patterns/MessageThread"
import { type Message, DEMO_MESSAGES, DEMO_MESSAGES_SINGLE } from "@/components/patterns/messageThreadData"

const UNCERTAIN_MESSAGES: Message[] = [
  {
    id: "u-unc",
    role: "user",
    content: "What's our current return-to-office policy?",
  },
  {
    id: "a-unc",
    role: "assistant",
    content:
      "I found references to a policy update but the information is incomplete and may be outdated. [1] I recommend checking with HR for the current version. [2]",
    citations: [
      { id: 1, sourceId: "docs-unc", quote: "Policy doc last updated Q3 2024. May be superseded." },
      { id: 2, sourceId: "slack-unc", quote: "HR mentioned a new policy is in review." },
    ],
    confidence: { tier: "low", percent: 34 },
    sources: [
      { id: "docs-unc",  title: "Docs: Policy v3 (outdated)", type: "doc",   verified: false },
      { id: "slack-unc", title: "Slack: HR thread",            type: "slack", verified: false },
    ],
  },
]

const STATES = {
  confident:    { title: "Confident",    subtitle: "92% · high confidence", messages: DEMO_MESSAGES_SINGLE },
  uncertain:    { title: "Uncertain",    subtitle: "34% · low confidence",  messages: UNCERTAIN_MESSAGES },
  conversation: { title: "Conversation", subtitle: "multi-turn",            messages: DEMO_MESSAGES },
} as const

type StateKey = keyof typeof STATES
const ORDER: StateKey[] = ["confident", "uncertain", "conversation"]

export default function EnhancedConfidenceDemo() {
  const [active, setActive] = useState<StateKey>("confident")

  // Arrow-key navigation
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return
      if (e.key === "ArrowRight")
        setActive((p) => ORDER[(ORDER.indexOf(p) + 1) % ORDER.length])
      else if (e.key === "ArrowLeft")
        setActive((p) => ORDER[(ORDER.indexOf(p) - 1 + ORDER.length) % ORDER.length])
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [])

  return (
    <div>
      {/* Segmented state picker — two-line labels */}
      <div className="mb-6 flex flex-wrap items-stretch gap-2">
        {ORDER.map((key) => {
          const isActive = key === active
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className="rounded-xl px-4 py-2.5 text-left transition-all duration-150"
              style={{
                backgroundColor: isActive ? "var(--bg-elevated)" : "transparent",
                border: isActive
                  ? "1px solid var(--border)"
                  : "1px solid transparent",
                boxShadow: isActive ? "var(--shadow-sm)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.backgroundColor = "var(--bg-subtle)"
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <p
                className="text-[15px] font-medium leading-tight"
                style={{ color: "var(--text)" }}
              >
                {STATES[key].title}
              </p>
              <p
                className="mt-0.5 text-[12px] leading-tight"
                style={{ color: "var(--text-muted)" }}
              >
                {STATES[key].subtitle}
              </p>
            </button>
          )
        })}
      </div>

      <MessageThread messages={STATES[active].messages} />
    </div>
  )
}

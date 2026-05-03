"use client"

import { useState } from "react"
import MessageThread from "@/components/patterns/MessageThread"
import {
  type Message,
  DEMO_MESSAGES,
  DEMO_MESSAGES_SINGLE,
} from "@/components/patterns/messageThreadData"
import ScenarioSegmentedControl, { type ScenarioKey } from "./ScenarioSegmentedControl"

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
      "I found snippets about an ongoing policy rewrite in two places. [1] Neither excerpt states your exact rule verbatim. [2]",
    citations: [
      { id: 1, sourceId: "docs-unc", quote: "Policy doc last updated Q3 2024. May be superseded." },
      { id: 2, sourceId: "slack-unc", quote: "HR mentioned a new policy is in review." },
    ],
    confidence: { tier: "low", percent: 34 },
    sources: [
      { id: "docs-unc", title: "Docs: Policy index (unverified)", type: "doc", verified: false },
      { id: "slack-unc", title: "Slack: HR thread", type: "slack", verified: false },
    ],
  },
]

const STATES: Record<ScenarioKey, { messages: Message[] }> = {
  confident: { messages: DEMO_MESSAGES_SINGLE },
  uncertain: { messages: UNCERTAIN_MESSAGES },
  conversation: { messages: DEMO_MESSAGES },
}

export default function EnhancedConfidenceDemo() {
  const [active, setActive] = useState<ScenarioKey>("confident")

  return (
    <>
      <ScenarioSegmentedControl active={active} onChange={setActive} />

      <div className="mt-8">
        <MessageThread
          researchRailFooter
          showWithWithoutToggle
          patternToggleInsideCard
          messages={STATES[active].messages}
        />
      </div>
    </>
  )
}

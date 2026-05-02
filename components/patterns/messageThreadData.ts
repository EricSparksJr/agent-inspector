// Pure data — no "use client" so it's importable from both server and client

export type SourceType = "notion" | "crm" | "email" | "doc" | "slack"
export type ConfidenceTier = "high" | "medium" | "low"

export interface Citation {
  id: number
  sourceId: string
  quote: string
}

export interface Source {
  id: string
  title: string
  type: SourceType
  verified: boolean
}

export interface UserMessage {
  id: string
  role: "user"
  content: string
}

export interface AssistantMessage {
  id: string
  role: "assistant"
  content: string
  citations: Citation[]
  confidence: { tier: ConfidenceTier; percent: number }
  sources: Source[]
}

export type Message = UserMessage | AssistantMessage

// ─── demo data ────────────────────────────────────────────────────────────────

export const DEMO_SOURCES_T1: Source[] = [
  { id: "notion-1", title: "Notion: Contract Terms 2025",  type: "notion", verified: true  },
  { id: "crm-1",    title: "CRM: Acme account history",    type: "crm",    verified: true  },
  { id: "email-1",  title: "Email: Mar 3 confirmation",    type: "email",  verified: true  },
]

export const DEMO_SOURCES_T2: Source[] = [
  { id: "crm-2",     title: "CRM: Standard contract terms", type: "crm", verified: true },
  { id: "email-renew", title: "Email: Ops renewal playbook", type: "email", verified: true },
  { id: "slack-1", title: "Slack: Legal thread (unverified)", type: "slack", verified: false },
]

export const DEMO_MESSAGES: Message[] = [
  {
    id: "u1",
    role: "user",
    content: "What's the deadline for the Acme contract renewal?",
  },
  {
    id: "a1",
    role: "assistant",
    content:
      "The Acme contract renewal deadline is March 15, 2026. [1] The original contract was signed on March 15, 2023 with a 3-year term. [2]",
    citations: [
      { id: 1, sourceId: "notion-1", quote: "Renewal date: March 15, 2026. 3-year initial term." },
      { id: 2, sourceId: "crm-1",    quote: "Contract signed: March 15, 2023. Acme Corp." },
    ],
    confidence: { tier: "high", percent: 92 },
    sources: DEMO_SOURCES_T1,
  },
  {
    id: "u2",
    role: "user",
    content: "What happens if we miss it?",
  },
  {
    id: "a2",
    role: "assistant",
    content:
      "Based on similar contracts, missing the deadline typically triggers a 30-day grace period, [1] after which the contract auto-renews at house terms until a new rider is filed. Ops email lines up with that reading for Acme-tier accounts. [3] Renewal language for this specific deal is unfinished in Slack. [2]",
    citations: [
      { id: 1, sourceId: "crm-2", quote: "Standard grace period: 30 days post-deadline." },
      {
        id: 2,
        sourceId: "slack-1",
        quote: "Renewal rider language not finalized yet for Q1 pushes.",
      },
      {
        id: 3,
        sourceId: "email-renew",
        quote: "Ops playbook: grace window and auto-renew remain default unless legal files an override.",
      },
    ],
    confidence: { tier: "medium", percent: 68 },
    sources: DEMO_SOURCES_T2,
  },
]

// First turn only — for homepage compact
export const DEMO_MESSAGES_SINGLE: Message[] = DEMO_MESSAGES.slice(0, 2)

export interface Pattern {
  id: string
  number: string
  name: string
  description: string
  href?: string
  meta: string
  spec: string
}

export const patterns: Pattern[] = [
  {
    id: "confidence-indicators",
    number: "01",
    name: "Confidence Indicators",
    description: "Show how certain the agent is before the user has to ask.",
    href: "/patterns/confidence-indicators",
    meta: "UPDATED 2026-04",
    spec: "1 demo · 2 examples · Updated 2026-04",
  },
  {
    id: "thought-transparency",
    number: "02",
    name: "Thought Transparency",
    description: "Let users see into the agent's reasoning without overwhelming them.",
    meta: "",
    spec: "Coming soon",
  },
  {
    id: "override-controls",
    number: "03",
    name: "Override Controls",
    description: "Make it effortless to correct or stop the agent mid-task.",
    meta: "",
    spec: "Coming soon",
  },
  {
    id: "error-recovery",
    number: "04",
    name: "Error Recovery",
    description: "Turn agent failures into user trust moments.",
    meta: "",
    spec: "Coming soon",
  },
  {
    id: "progressive-autonomy",
    number: "05",
    name: "Progressive Autonomy",
    description: "Let users grant the agent more freedom as trust builds.",
    meta: "",
    spec: "Coming soon",
  },
  {
    id: "intent-confirmation",
    number: "06",
    name: "Intent Confirmation",
    description: "Make the user's mapped intent explicit before execution.",
    meta: "",
    spec: "Coming soon",
  },
]

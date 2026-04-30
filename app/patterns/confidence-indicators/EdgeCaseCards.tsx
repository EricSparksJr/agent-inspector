"use client"

const EDGE_CASES = [
  {
    label: "Failure 01",
    title: "When confidence is wrong",
    body: "A stale source returns cached data. The score reads 92% but the answer is incorrect. Source freshness is out of scope here. It belongs to a separate layer.",
  },
  {
    label: "Failure 02",
    title: "When sources within a turn conflict",
    body: "Source A says March 15. Source B says April 2. The agent returns a majority answer. The minority signal disappears from the per-message metadata.",
  },
  {
    label: "Failure 03",
    title: "When the user disagrees with a turn",
    body: "The user knows a specific turn's answer is wrong but 89% shows in the metadata strip. There is no affordance to flag it at the message level.",
  },
  {
    label: "Failure 04",
    title: "When confidence drops mid-task",
    body: "A multi-step task starts at 91% and falls to 40% across turns. The multi-turn thread shows the degradation, but the agent doesn't surface it proactively.",
  },
]

export default function EdgeCaseCards() {
  return (
    <div
      className="flex gap-6 overflow-x-auto pb-4"
      style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
    >
      {EDGE_CASES.map((card) => (
        <div
          key={card.title}
          className="shrink-0 w-[300px] rounded-xl p-5 transition-all duration-200"
          style={{
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg-elevated)",
            scrollSnapAlign: "start",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "var(--shadow-sm)"
            e.currentTarget.style.transform = "translateY(-2px)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none"
            e.currentTarget.style.transform = ""
          }}
        >
          {/* Failure mode label */}
          <p
            className="mb-4 text-[12px] uppercase tracking-[0.06em]"
            style={{ color: "var(--text-muted)" }}
          >
            {card.label}
          </p>

          {/* Title */}
          <p
            className="mb-2 text-[14px] font-semibold leading-snug"
            style={{ color: "var(--text)" }}
          >
            {card.title}
          </p>

          {/* Body */}
          <p
            className="text-[13px] leading-[1.55] text-pretty"
            style={{ color: "var(--text-muted)" }}
          >
            {card.body}
          </p>
        </div>
      ))}
    </div>
  )
}

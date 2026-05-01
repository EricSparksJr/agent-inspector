"use client"

const EDGE_CASES = [
  {
    title: "When confidence is wrong",
    body: "A stale source returns cached data. The chip reads high confidence but the answer is incorrect. Source freshness is out of scope for this pattern. It belongs to a separate retrieval and indexing layer.",
  },
  {
    title: "When sources within a turn conflict",
    body: "One source says March 15. Another says April 2. The agent returns a majority answer and the minority signal disappears from the per-message metadata. Surfacing intra-turn disagreement requires a different display layer that this pattern does not own.",
  },
  {
    title: "When the user disagrees with a turn",
    body: 'The user knows a specific turn\'s answer is wrong but the metadata strip still reads "high confidence" because the agent was confident in a wrong source. The thumbs-down control captures the disagreement signal but does not propagate to the upstream sources. Source-level correction is out of scope for this pattern. It belongs to a feedback loop layer.',
  },
  {
    title: "When confidence drops mid-task",
    body: "A multi-step task starts on solid ground and degrades across turns. The thread shows the change tier-by-tier, but the agent does not surface the trend proactively or warn the user that earlier confident steps may have been built on later uncertain ones. Cross-turn confidence summarization is a separate pattern.",
  },
]

export default function EdgeCaseCards() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {EDGE_CASES.map((card, i) => (
        <div
          key={card.title}
          className="rounded-xl p-8 lg:p-10"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <p
            className="font-[family-name:var(--font-mono)] text-[40px] font-light leading-none tracking-[-0.02em] opacity-60"
            style={{ color: "var(--text-muted)" }}
          >
            {String(i + 1).padStart(2, "0")}
          </p>
          <p
            className="mt-5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em]"
            style={{ color: "var(--text-muted)" }}
          >
            Failure
          </p>
          <h3
            className="mt-2 text-[17px] font-medium leading-snug"
            style={{ color: "var(--text)" }}
          >
            {card.title}
          </h3>
          <p
            className="mt-3 text-[14px] leading-[1.65] text-pretty"
            style={{ color: "var(--text)" }}
          >
            {card.body}
          </p>
        </div>
      ))}
    </div>
  )
}

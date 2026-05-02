import { codeToHtml } from "shiki"
import CopyButton from "./CopyButton"

// ─── code to display ──────────────────────────────────────────────────────────

const CODE = `type ConfidenceTier = "high" | "medium" | "low"

interface ConfidenceData {
  tier: ConfidenceTier
  reasoning: string
}

const TIER_DOT: Record<ConfidenceTier, string> = {
  high: "#1F8B4C",
  medium: "#C8881C",
  low: "#C42929",
}

const TIER_LABEL: Record<ConfidenceTier, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
}

export function ConfidenceChip({ confidence }: { confidence: ConfidenceData }) {
  return (
    <Popover>
      <PopoverTrigger className="inline-flex items-center gap-1.5 text-[12px]">
        <span
          aria-hidden
          className="size-1.5 rounded-full"
          style={{ backgroundColor: TIER_DOT[confidence.tier] }}
        />
        <span style={{ color: "var(--text-muted)" }}>
          {TIER_LABEL[confidence.tier]}
        </span>
      </PopoverTrigger>
      <PopoverContent side="top" className="max-w-[280px]">
        <p className="text-[13px]">{confidence.reasoning}</p>
      </PopoverContent>
    </Popover>
  )
}`

// ─── component ────────────────────────────────────────────────────────────────

export default async function CodeBlock() {
  const html = await codeToHtml(CODE, {
    lang: "tsx",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: "light",
  })

  return (
    <div className="relative">
      {/*
        Shiki inlines per-token colors. These rules:
        1. Strip shiki's white background so our --bg-subtle shows through.
        2. Switch token colors to the dark palette when data-theme="dark" is
           on <html> (matches the site's theme toggle).
      */}
      <style>{`
        .ci-code-block .shiki         { margin: 0; background: transparent !important; }
        .ci-code-block .shiki code    { font-family: inherit; font-size: inherit; line-height: inherit; }
        [data-theme="dark"] .ci-code-block .shiki,
        [data-theme="dark"] .ci-code-block .shiki span {
          color:            var(--shiki-dark)    !important;
          background-color: var(--shiki-dark-bg) !important;
        }
        [data-theme="dark"] .ci-code-block .shiki { background: transparent !important; }
      `}</style>

      <CopyButton code={CODE} />

      <div
        className="ci-code-block overflow-x-auto rounded-xl px-7 pb-7 pt-16 text-[13px] leading-[1.75]"
        style={{
          backgroundColor: "var(--bg-subtle)",
          border: "1px solid var(--border)",
          fontFamily: "var(--font-mono), ui-monospace, monospace",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

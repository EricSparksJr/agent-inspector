import { codeToHtml } from "shiki"
import CopyButton from "./CopyButton"

// ─── code to display ──────────────────────────────────────────────────────────

const CODE = `interface ConfidenceData {
  percent: number
  source: string
  tier: 'high' | 'medium' | 'low'
}

const TIER_DOT: Record<ConfidenceData['tier'], string> = {
  high:   'bg-emerald-600',
  medium: 'bg-amber-500',
  low:    'bg-red-500',
}

const TIER_TEXT: Record<ConfidenceData['tier'], string> = {
  high:   'text-emerald-700',
  medium: 'text-amber-700',
  low:    'text-red-700',
}

export function ConfidencePill({
  confidence,
}: {
  confidence: ConfidenceData
}) {
  const dot  = TIER_DOT[confidence.tier]
  const text = TIER_TEXT[confidence.tier]

  return (
    <span className="inline-flex items-center gap-2 rounded-md bg-neutral-100 px-3 py-1.5 font-mono text-xs tabular-nums">
      <span className={\`size-1.5 shrink-0 rounded-full \${dot}\`} />
      <span className={text}>{confidence.percent}% Confident</span>
      <span className="text-neutral-400">·</span>
      <span className="text-neutral-500">{confidence.source}</span>
    </span>
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

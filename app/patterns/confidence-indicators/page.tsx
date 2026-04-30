import type { Metadata } from "next"
import Link from "next/link"
import Footer from "@/components/sections/Footer"
import EnhancedConfidenceDemo from "./EnhancedConfidenceDemo"
import MessageThread from "@/components/patterns/MessageThread"
import { DEMO_MESSAGES } from "@/components/patterns/messageThreadData"
import CodeBlock from "./CodeBlock"
import EdgeCaseCards from "./EdgeCaseCards"

export const metadata: Metadata = {
  title: "Confidence Indicators · Agent Inspector",
  description:
    "Agents act on probabilistic outputs, but most UIs present them as certainties. A pattern for surfacing confidence before users have to ask.",
}

// ─── page-level constants ─────────────────────────────────────────────────────

const W = "mx-auto max-w-[1040px] px-6 md:px-10"
const GAP = "mt-24"   // 96px between major sections
const S = "mt-8"      // 32px between elements within a section

const DECISIONS = [
  {
    decision: "Show percentage vs. category label",
    considered: "High/Med/Low chips, 5-star rating, raw probability, slider",
    why: "Numeric is more honest about uncertainty bands. Categories collapse the signal: 'High' hides whether the model is at 82% or 99%.",
  },
  {
    decision: "Inline pill vs. separate confidence panel",
    considered: "Sidebar widget, modal detail view, sticky footer bar",
    why: "Inline keeps confidence attached to the claim. Separate panels decouple the signal from the content and add an extra interaction.",
  },
  {
    decision: "Source list vs. single verified badge",
    considered: '"Verified" badge only, source count, full document title + link',
    why: "Attribution turns a number into evidence. A badge tells the user nothing actionable; a source name tells them where to verify.",
  },
  {
    decision: "Count-up animation vs. instant reveal",
    considered: "No animation, fade-in, pulse on load, instant display",
    why: "Count-up signals that the system computed the score. Instant display feels like a cached value, which undermines trust in the signal.",
  },
  {
    decision: "Two semantic tiers vs. continuous scale",
    considered: "Full gradient, five-tier scale, percentage only, traffic-light",
    why: "Two tiers (act / verify) map directly to the two decisions users make. More tiers increase cognitive load without adding actionable resolution.",
  },
]

// ─── callout legend circle (legend only, not on the card) ────────────────────

function CalloutSmall({ n }: { n: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
      style={{
        width: 20,
        height: 20,
        backgroundColor: "var(--bg-subtle)",
        color: "var(--text-muted)",
      }}
      aria-label={`Callout ${n}`}
    >
      {n}
    </span>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function ConfidenceIndicatorsPage() {
  return (
    <div className="flex min-h-full flex-col page-enter">
      <div className={W}>

        {/* ══════════════════════════════════════════════════════════════
            SECTION A — Breadcrumb + meta
        ══════════════════════════════════════════════════════════════ */}
        <div className="pt-32">
          <div
            className="flex items-center justify-between text-[13px]"
            style={{ color: "var(--text-muted)" }}
          >
            <nav className="flex items-center gap-2" aria-label="Breadcrumb">
              <Link
                href="/"
                className="transition-colors duration-[180ms] hover:opacity-70"
                style={{ color: "var(--text-muted)" }}
              >
                Patterns
              </Link>
              <span style={{ color: "var(--border-strong)" }}>/</span>
              <span style={{ color: "var(--text)" }}>Confidence Indicators</span>
            </nav>
            <span className="hidden sm:block">Updated Apr 2026 · 8 min read</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION B — Editorial header
        ══════════════════════════════════════════════════════════════ */}
        <div className={`${GAP} max-w-[640px]`}>
          <p
            className="mb-5 text-[12px] font-medium uppercase tracking-[0.08em]"
            style={{ color: "var(--text-subtle)" }}
          >
            Pattern 01
          </p>

          <h1
            className="mb-6 text-balance font-semibold leading-[1.05]"
            style={{
              fontSize: "48px",
              letterSpacing: "-2.4px",
              color: "var(--text)",
            }}
          >
            Confidence Indicators.
          </h1>

          <p
            className={`${S} text-pretty`}
            style={{
              fontSize: "20px",
              lineHeight: "1.5",
              maxWidth: "64ch",
              color: "var(--text-muted)",
            }}
          >
            Agents act on probabilistic outputs, but most UIs present them as
            certainties. Users learn to either over-trust or ignore the system
            entirely.
          </p>

          <div className={`${S} flex flex-wrap items-center gap-2`}>
            {["Confidence", "Trust", "Agentic UX"].map((tag) => (
              <span
                key={tag}
                className="rounded-md px-2.5 py-1 text-[12px] font-medium"
                style={{
                  backgroundColor: "var(--bg-subtle)",
                  color: "var(--text-muted)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION C — Live demo
        ══════════════════════════════════════════════════════════════ */}
        <div className={GAP}>
          {/* Live status — accent use 1 of 5 */}
          <div className="mb-4 flex items-center gap-2">
            <span
              className="shrink-0 rounded-full"
              style={{ width: 6, height: 6, backgroundColor: "var(--accent)" }}
              aria-hidden="true"
            />
            <p
              className="text-[12px] tracking-[0.04em]"
              style={{ color: "var(--text-muted)" }}
            >
              Live
            </p>
          </div>

          <EnhancedConfidenceDemo />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION D — The thinking (2-column editorial)
        ══════════════════════════════════════════════════════════════ */}
        <div className={GAP}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_264px] lg:gap-16">

            {/* Left — editorial */}
            <div className="min-w-0">
              <h2
                className="mb-8 text-balance font-semibold leading-[1.2]"
                style={{
                  fontSize: "32px",
                  letterSpacing: "-1.2px",
                  color: "var(--text)",
                }}
              >
                Why probability needs a face.
              </h2>

              <p
                className="mb-8 text-pretty leading-[1.6]"
                style={{
                  fontSize: "var(--text-body)",
                  maxWidth: "64ch",
                  color: "var(--text-muted)",
                }}
              >
                Without a confidence signal, users fill the gap themselves. The
                pattern we observe most often: one wrong answer at high stakes
                creates global distrust. The user stops acting on any output,
                including correct ones, because they cannot tell which is
                which. The agent becomes a suggestion box, not a collaborator.
              </p>

              <p
                className="mb-8 text-pretty leading-[1.6]"
                style={{
                  fontSize: "var(--text-body)",
                  maxWidth: "64ch",
                  color: "var(--text-muted)",
                }}
              >
                A percentage alone is not enough. "92% confident" without a
                source is an assertion. "92% confident, verified from Notion"
                is evidence. The source is what allows the user to decide
                whether to act immediately, verify, or escalate. Confidence
                without attribution is still opacity, just with a number
                attached.
              </p>

              {/* Pull quote — accent use 2 of 5 */}
              <blockquote
                className="my-10 py-1 pl-6"
                style={{ borderLeft: "2px solid var(--accent)" }}
              >
                <p
                  className="text-balance leading-[1.4]"
                  style={{
                    fontSize: "24px",
                    fontStyle: "italic",
                    color: "var(--text)",
                  }}
                >
                  "The goal is calibrated trust, not high trust."
                </p>
              </blockquote>

              <p
                className="text-pretty leading-[1.6]"
                style={{
                  fontSize: "var(--text-body)",
                  maxWidth: "64ch",
                  color: "var(--text-muted)",
                }}
              >
                The failure mode of false precision is subtle: an agent that
                reports 87.3% when the underlying model cannot distinguish 87%
                from 91% teaches users to trust decimal places. Show confidence
                as a range or a semantic tier when precision is not meaningful.
                The display should be as honest as the signal it represents.
              </p>
            </div>

            {/* Right — sticky sidenote */}
            <div className="hidden lg:block">
              <div className="sticky top-28">
                <p
                  className="mb-5 text-[11px] font-medium uppercase tracking-[0.08em]"
                  style={{ color: "var(--text-subtle)" }}
                >
                  Related research
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    {
                      title: "Guidelines for Human-AI Interaction",
                      authors: "Amershi et al. · CHI 2019",
                      desc: "18 design guidelines derived from user studies across Microsoft AI products.",
                      href: "https://dl.acm.org/doi/10.1145/3290605.3300233",
                    },
                    {
                      title: "Measuring Faithfulness in Chain-of-Thought Reasoning",
                      authors: "Turpin et al. · Anthropic 2023",
                      desc: "Examines when model explanations diverge from actual reasoning paths.",
                      href: "https://arxiv.org/abs/2307.13702",
                    },
                    {
                      title: "People + AI Guidebook",
                      authors: "Google PAIR",
                      desc: "Practical patterns for human-AI co-design, grounded in user research.",
                      href: "https://pair.withgoogle.com/guidebook",
                    },
                  ].map((paper) => (
                    <a
                      key={paper.href}
                      href={paper.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl border border-border p-4 transition-colors duration-[180ms] hover:border-border-strong"
                      style={{ backgroundColor: "var(--bg-elevated)" }}
                    >
                      <p
                        className="mb-1 text-[13px] font-medium leading-snug"
                        style={{ color: "var(--text)" }}
                      >
                        {paper.title}
                      </p>
                      <p
                        className="mb-2 text-[11px] font-medium uppercase tracking-[0.05em]"
                        style={{ color: "var(--text-subtle)" }}
                      >
                        {paper.authors}
                      </p>
                      <p
                        className="text-[12px] leading-[1.5] text-pretty"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {paper.desc}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION E — Anatomy diagram
        ══════════════════════════════════════════════════════════════ */}
        <div className={GAP}>
          <p
            className="mb-4 text-[12px] font-medium uppercase tracking-[0.08em]"
            style={{ color: "var(--text-subtle)" }}
          >
            Anatomy
          </p>
          <h2
            className={`${S} text-balance font-semibold leading-[1.2]`}
            style={{ fontSize: "var(--text-h2)", color: "var(--text)" }}
          >
            What each element does.
          </h2>

          {/* Anatomy: two-column — live demo left, callout guide right */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[3fr_2fr] lg:items-start">

            {/* Left: live, interactive demo — no overlaid circles */}
            <MessageThread messages={[DEMO_MESSAGES[1]]} />

            {/* Right: element guide */}
            <div>
              <p
                className="mb-5 text-[11px] font-medium uppercase tracking-[0.08em]"
                style={{ color: "var(--text-subtle)" }}
              >
                Element guide
              </p>
              <div className="flex flex-col gap-5">
                {[
                  [1, "Inline citation",      "Numbered [1] pills appear inside prose. Hover or click to see the source title, type, and an exact quote."],
                  [2, "Confidence indicator", "Per-message certainty in the metadata strip. Dot color is semantic: green = act on this, amber = verify first."],
                  [3, "Source disclosure",    "Collapsible list of sources used for this response. Unverified sources are visually dimmed."],
                  [4, "Message actions",      "Copy, regenerate, and calendar actions sit icon-only at rest. Calendar only shows when confidence is high."],
                ].map(([n, title, desc]) => (
                  <div key={String(n)} className="flex gap-3">
                    {/* Accent circle */}
                    <span
                      className="flex shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                      style={{
                        width: 24, height: 24,
                        backgroundColor: "var(--accent)",
                        color: "#fff",
                      }}
                    >
                      {n as number}
                    </span>
                    <div>
                      <p
                        className="mb-1 text-[14px] font-medium"
                        style={{ color: "var(--text)" }}
                      >
                        {title as string}
                      </p>
                      <p
                        className="text-[13px] leading-[1.5] text-pretty"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {desc as string}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION F — Edge cases (horizontal scroll snap)
        ══════════════════════════════════════════════════════════════ */}
        <div className={GAP}>
          <p
            className="mb-4 text-[12px] font-medium uppercase tracking-[0.08em]"
            style={{ color: "var(--text-subtle)" }}
          >
            Edge Cases
          </p>
          <h2
            className={`${S} text-balance font-semibold leading-[1.2]`}
            style={{ fontSize: "var(--text-h2)", color: "var(--text)" }}
          >
            What this pattern doesn't solve.
          </h2>
          <p
            className={`${S} text-pretty leading-[1.6]`}
            style={{
              fontSize: "var(--text-body)",
              maxWidth: "64ch",
              color: "var(--text-muted)",
            }}
          >
            Four failure modes that exist outside this pattern's scope. Each
            requires its own treatment.
          </p>
          <div className="mt-8">
            <EdgeCaseCards />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION G — Implementation notes + code
        ══════════════════════════════════════════════════════════════ */}
        <div className={GAP}>
          <p
            className="mb-4 text-[12px] font-medium uppercase tracking-[0.08em]"
            style={{ color: "var(--text-subtle)" }}
          >
            Implementation
          </p>
          <h2
            className={`${S} font-semibold leading-[1.2]`}
            style={{ fontSize: "var(--text-h2)", color: "var(--text)" }}
          >
            The ConfidencePill component.
          </h2>
          <p
            className={`${S} text-pretty leading-[1.6]`}
            style={{
              fontSize: "var(--text-body)",
              maxWidth: "64ch",
              color: "var(--text-muted)",
            }}
          >
            The core display primitive. Accepts a confidence object with
            percent, source, and tier. Uses oklch color space for perceptually
            uniform, muted semantic colors that hold in both light and dark
            modes.
          </p>
          <div className="mt-8">
            <CodeBlock />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION H — Decision log (table)
        ══════════════════════════════════════════════════════════════ */}
        <div className={GAP}>
          <p
            className="mb-4 text-[12px] font-medium uppercase tracking-[0.08em]"
            style={{ color: "var(--text-subtle)" }}
          >
            Decision Log
          </p>
          <h2
            className={`${S} font-semibold leading-[1.2]`}
            style={{ fontSize: "var(--text-h2)", color: "var(--text)" }}
          >
            Five calls we made.
          </h2>

          <div
            className="mt-10 overflow-hidden rounded-xl"
            style={{ border: "1px solid var(--border)" }}
          >
            <table className="w-full text-[14px]">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border)",
                    backgroundColor: "var(--bg-subtle)",
                  }}
                >
                  {["Decision", "Considered", "Why we shipped this"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-[0.06em]"
                      style={{ color: "var(--text-subtle)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DECISIONS.map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom:
                        i < DECISIONS.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                      backgroundColor: "var(--bg-elevated)",
                    }}
                  >
                    <td
                      className="px-5 py-4 align-top text-[14px] font-medium"
                      style={{ color: "var(--text)" }}
                    >
                      {row.decision}
                    </td>
                    <td
                      className="px-5 py-4 align-top text-[13px] leading-[1.55]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {row.considered}
                    </td>
                    <td
                      className="px-5 py-4 align-top text-[13px] leading-[1.55]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {row.why}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION I — Footer nav (Linear-style prev/next)
        ══════════════════════════════════════════════════════════════ */}
        <div className="mt-24 pb-24">
          <div
            className="flex items-start justify-between pt-8"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {/* Previous — disabled */}
            <div className="flex flex-col gap-1">
              <span
                className="text-[11px] font-medium uppercase tracking-[0.06em]"
                style={{ color: "var(--text-subtle)" }}
              >
                Previous
              </span>
              <span
                className="text-[15px] font-medium"
                style={{ color: "var(--text-subtle)" }}
              >
                First pattern in the set
              </span>
            </div>

            {/* Next — active */}
            <Link
              href="#"
              className="flex flex-col items-end gap-1 transition-opacity duration-[180ms] hover:opacity-70"
            >
              <span
                className="text-[11px] font-medium uppercase tracking-[0.06em]"
                style={{ color: "var(--text-subtle)" }}
              >
                Next
              </span>
              <span
                className="text-[15px] font-medium"
                style={{ color: "var(--text)" }}
              >
                02 / Thought Transparency
              </span>
            </Link>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}

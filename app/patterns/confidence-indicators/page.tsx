import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import Footer from "@/components/sections/Footer"
import EnhancedConfidenceDemo from "./EnhancedConfidenceDemo"
import MessageThread from "@/components/patterns/MessageThread"
import { DEMO_MESSAGES } from "@/components/patterns/messageThreadData"
import CodeBlock from "./CodeBlock"
import EdgeCaseCards from "./EdgeCaseCards"

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#FAFAFA",
}

export const metadata: Metadata = {
  title: "Confidence Indicators · Agent Inspector",
  description:
    "Agents act on probabilistic outputs, but most UIs present them as certainties. A pattern for surfacing confidence before users have to ask.",
}

// ─── page-level constants ─────────────────────────────────────────────────────

const DECISIONS = [
  {
    decision: "Categorical tier vs raw percentage",
    considered: "High/Med/Low chips, 5-star rating, raw probability, slider",
    why: "Numeric confidence drifts with model version and prompting in ways the user cannot see. Categorical tiers survive that drift and align with how people actually decide: act, verify, or confirm. The raw numeric value stays in the chip detail panel for users who open it.",
  },
  {
    decision: "Inline metadata strip vs separate confidence panel",
    considered: "Sidebar widget, modal detail view, sticky footer bar",
    why: "A separate panel decouples the signal from the claim it qualifies. The user has to look in two places. Inline keeps confidence attached to the answer it describes and removes one step from the verify path.",
  },
  {
    decision: "Named source pills vs verified badge",
    considered: '"Verified" badge only, source count alone, full document title with link',
    why: 'A badge tells the user the system is sure of itself. A named source tells the user where to verify. In enterprise agents, sources are systems of record (Notion, CRM, Email). Naming them lets the user open the right tool, not a generic verification page.',
  },
  {
    decision: "Reasoning on hover vs reasoning in row",
    considered: "Inline grounding sentence, tooltip-only, expandable detail",
    why: "The reasoning matters for users who want to inspect the call, but it adds a full extra row of vertical space for users who do not. Keeping that detail behind the chip keeps the row compact while preserving the signal for anyone who opens it.",
  },
  {
    decision: "Three semantic tiers vs two",
    considered: "Two tiers (act / verify), full gradient, percentage only, traffic-light",
    why: 'Two tiers force "verify" and "do not act" into the same bucket. Three separates the case where the agent is confident but the user should sanity-check (medium) from the case where the agent itself is unsure (low). Three tiers map to three distinct user actions without adding cognitive load.',
  },
]

function anatomyInlineLabel(children: string) {
  return (
    <code
      className="rounded px-1 font-[family-name:var(--font-mono)] text-[12px] font-normal"
      style={{
        backgroundColor: "var(--bg-subtle)",
        color: "var(--text-muted)",
      }}
    >
      {children}
    </code>
  )
}

const ANATOMY_ITEMS: {
  num: string
  title: string
  locator: string
  body: ReactNode
}[] = [
  {
    num: "01",
    title: "Inline citation",
    locator: "In the message body, after each grounded claim",
    body: (
      <>
        Numbered {anatomyInlineLabel("[1]")} pills appear inside prose, anchored
        to the exact claim they support. Click to reveal the source title, type,
        and an exact quote. Citations render only when the pattern is on. Off
        mode shows the prose without them so the baseline stays honest about
        what the model produced before grounding.
      </>
    ),
  },
  {
    num: "02",
    title: "Confidence indicator",
    locator: "Metadata strip, left edge",
    body: "A semantic chip in the metadata strip. Color encodes the calibrated confidence tier, green for high, amber for medium, red for low. Click the chip for the tier rationale plus how many sources corroborate the answer.",
  },
  {
    num: "03",
    title: "Source disclosure",
    locator: "Metadata strip, immediately right of the chip",
    body: (
      <>
        A muted button labeled {anatomyInlineLabel("3 sources")} (count is
        dynamic) with a rotating chevron. Click expands a row of pills, one per
        system the agent consulted. Each pill shows the system icon and the source
        title. Pills carry a status indicator only when the source is not
        independently confirmed, rendered with dimmed text and a colored dot.
        Verified sources render at full opacity without an indicator.
      </>
    ),
  },
  {
    num: "04",
    title: "Message actions",
    locator: "Metadata strip, right side",
    body: "Four icon-only controls on the right of the metadata strip: copy, regenerate, helpful, not helpful. Always visible because hidden feedback controls go unused. Each control surfaces its label on hover via tooltip.",
  },
]

const RELATED_RESEARCH = [
  {
    publisher: "Amershi et al. · CHI 2019 · Microsoft Research",
    title: "Guidelines for Human-AI Interaction",
    blurb:
      "Eighteen design guidelines validated across user studies of Microsoft AI products. The reference set most teams still build on.",
    url: "https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/",
  },
  {
    publisher: "Turpin et al. · Anthropic · 2023",
    title: "Measuring Faithfulness in Chain-of-Thought Reasoning",
    blurb:
      "Evidence that model explanations can systematically misrepresent the actual reasoning behind a prediction. Why we treat the chip's reasoning as a hint, not proof.",
    url: "https://arxiv.org/abs/2305.04388",
  },
  {
    publisher: "Google PAIR",
    title: "People + AI Guidebook",
    blurb:
      "Practitioner patterns for human-AI co-design, organized around mental models, explainability, and feedback. Heavily referenced in the calibrated-trust literature.",
    url: "https://pair.withgoogle.com/guidebook",
  },
  {
    publisher: "Apple · 2025",
    title: "Generative AI Human Interface Guidelines",
    blurb:
      "Apple's first design guidance specifically for generative AI features, emphasizing transparency, user agency, and graceful uncertainty.",
    url: "https://developer.apple.com/design/human-interface-guidelines/generative-ai",
  },
] as const

const W = "mx-auto max-w-[1040px] px-6 md:px-10"

// ─── page ─────────────────────────────────────────────────────────────────────

export default function ConfidenceIndicatorsPage() {
  return (
    <div className="flex min-h-full flex-col bg-background page-enter">
      <div className={W}>

        {/* ══════════════════════════════════════════════════════════════
            SECTION A - Breadcrumb + meta
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
            SECTION B - Editorial header
        ══════════════════════════════════════════════════════════════ */}
        <header className="mt-24 max-w-[640px] md:mt-36">
          <p
            className="text-[12px] font-medium uppercase tracking-[0.08em]"
            style={{ color: "var(--text-subtle)" }}
          >
            Pattern 01
          </p>

          <h1
            className="mt-4 text-balance font-semibold leading-[1.05]"
            style={{
              fontSize: "48px",
              letterSpacing: "-2.4px",
              color: "var(--text)",
            }}
          >
            Confidence Indicators.
          </h1>
        </header>

        <p
          className="mt-8 max-w-[640px] text-pretty"
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

        {/* ══════════════════════════════════════════════════════════════
            SECTION C - Live demo
        ══════════════════════════════════════════════════════════════ */}
        <div className="mt-14 md:mt-20">
          <EnhancedConfidenceDemo />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION D - The thinking (2-column editorial)
        ══════════════════════════════════════════════════════════════ */}
        <section className="mt-24 md:mt-36">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_264px] lg:gap-20">

            {/* Left - editorial */}
            <div className="min-w-0">
              <h2
                className="text-balance font-semibold leading-[1.2]"
                style={{
                  fontSize: "32px",
                  letterSpacing: "-1.2px",
                  color: "var(--text)",
                }}
              >
                Why probability needs a face.
              </h2>

              <p
                className="mt-8 text-pretty leading-[1.6]"
                style={{
                  fontSize: "var(--text-body)",
                  maxWidth: "64ch",
                  color: "var(--text-muted)",
                }}
              >
                Without a confidence signal, users fill the gap themselves, and
                they fill it badly. One wrong answer at high stakes is enough to
                poison the well. The user stops acting on any output, including
                the correct ones, because nothing on screen tells them which is
                which. The agent becomes a suggestion box, not a collaborator.
              </p>

              <p
                className="mt-8 text-pretty leading-[1.6]"
                style={{
                  fontSize: "var(--text-body)",
                  maxWidth: "64ch",
                  color: "var(--text-muted)",
                }}
              >
                The UI problem is rarely raw accuracy. It is honest
                correspondence between what the model knows and what the
                interface claims. We treat confidence as the agent&apos;s own
                metacognitive report about how well its stated certainty lines
                up with outcomes it can defend. When that report is honest,
                people learn when to move and when to pause.
              </p>

              {/* Pull quote: 3px left rule uses foreground token (not accent). Internal py only. */}
              <blockquote
                className="mt-8 py-6"
                style={{
                  borderLeft: "3px solid var(--text)",
                  paddingLeft: "24px",
                }}
              >
                <p
                  className="text-balance leading-snug"
                  style={{
                    fontSize: "var(--text-h2)",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "var(--text)",
                  }}
                >
                  The goal is calibrated trust, not high trust.
                </p>
              </blockquote>

              <p
                className="mt-8 text-pretty leading-[1.6]"
                style={{
                  fontSize: "var(--text-body)",
                  maxWidth: "64ch",
                  color: "var(--text-muted)",
                }}
              >
                A category is more honest than a number. A label like &quot;high&quot;
                is a coarse signal, but a coarse signal is what the underlying model
                can actually support. Recent evaluation work shows that numeric
                confidence scores drift with prompting, model version, and decoding
                settings in ways the user cannot see. Three categorical tiers
                (high, medium, low) survive those shifts and align more closely
                with how people actually decide. We preserve the underlying score
                on hover for users who want to inspect it. The headline stays
                semantic.
              </p>

              <p
                className="mt-8 text-pretty leading-[1.6]"
                style={{
                  fontSize: "var(--text-body)",
                  maxWidth: "64ch",
                  color: "var(--text-muted)",
                }}
              >
                Source attribution is what turns a category into evidence.
                &quot;High confidence&quot; alone is an assertion. &quot;High
                confidence, grounded in three named systems&quot; is something
                the user can verify. Confidence without attribution is opacity
                with a label. The display we ship treats attribution as the
                primary trust signal and the category as the secondary read.
              </p>
            </div>

            {/* Right - sticky further reading */}
            <aside className="hidden min-w-0 lg:block lg:sticky lg:top-24 lg:self-start">
              <p
                className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em]"
                style={{ color: "var(--text-muted)" }}
              >
                Related research
              </p>
              <ul className="mt-8 flex flex-col gap-8">
                {RELATED_RESEARCH.map((s) => (
                  <li key={s.title} className="group">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <p
                        className="text-[10px] uppercase tracking-[0.1em]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {s.publisher}
                      </p>
                      <h4
                        className="mt-1.5 text-[14px] font-medium leading-snug decoration-[var(--border)] underline-offset-4 group-hover:underline"
                        style={{ color: "var(--text)" }}
                      >
                        {s.title}
                      </h4>
                      <p
                        className="mt-2 text-[12px] leading-[1.6] text-pretty"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {s.blurb}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION E - Anatomy diagram
        ══════════════════════════════════════════════════════════════ */}
        <section className="mt-24 md:mt-36" aria-labelledby="anatomy-heading">
          <header>
            <p
              className="text-[12px] font-medium uppercase tracking-[0.08em]"
              style={{ color: "var(--text-subtle)" }}
            >
              Anatomy
            </p>
            <h2
              id="anatomy-heading"
              className="mt-4 text-balance font-semibold leading-[1.2]"
              style={{ fontSize: "var(--text-h2)", color: "var(--text)" }}
            >
              What each element does.
            </h2>
          </header>
          <p
            className="mt-8 max-w-[64ch] text-pretty leading-[1.6]"
            style={{
              fontSize: "var(--text-body)",
              color: "var(--text-muted)",
            }}
          >
            Inline citations, the confidence chip, source disclosure, and message
            actions form one metadata system on each assistant turn.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <MessageThread
                researchRailFooter
                messages={[DEMO_MESSAGES[1]]}
              />
            </div>
            <div className="relative min-h-0">
              {/* Vertical hairline for the full legend column */}
              <div
                className="pointer-events-none absolute bottom-2 left-[14px] top-2 w-px bg-[var(--border)]"
                aria-hidden
              />
              <ol className="relative m-0 list-none p-0">
                {ANATOMY_ITEMS.map((item, i) => (
                  <li
                    key={item.num}
                    className={`relative ${i > 0 ? "mt-8" : ""} pl-12`}
                  >
                    <span
                      className="absolute left-0 top-0 flex h-[20px] w-[28px] items-center justify-center bg-[var(--bg)] font-[family-name:var(--font-mono)] text-[11px] tracking-[0.08em]"
                      style={{ color: "var(--text-muted)" }}
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className="text-[15px] font-medium leading-snug"
                      style={{ color: "var(--text)" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="mt-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.1em]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.locator}
                    </p>
                    <p
                      className="mt-3 text-[14px] leading-[1.65] text-pretty"
                      style={{ color: "var(--text)" }}
                    >
                      {item.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION F - Edge cases
        ══════════════════════════════════════════════════════════════ */}
        <section className="mt-24 md:mt-36">
          <div className="mx-auto max-w-[1100px]">
            <header>
              <p
                className="text-[12px] font-medium uppercase tracking-[0.08em]"
                style={{ color: "var(--text-subtle)" }}
              >
                Edge Cases
              </p>
              <h2
                className="mt-4 text-balance font-semibold leading-[1.2]"
                style={{ fontSize: "var(--text-h2)", color: "var(--text)" }}
              >
                What this pattern doesn&apos;t solve.
              </h2>
            </header>
            <p
              className="mt-8 max-w-[64ch] text-pretty leading-[1.6]"
              style={{
                fontSize: "var(--text-body)",
                color: "var(--text-muted)",
              }}
            >
              Four failure modes that exist outside this pattern&apos;s scope. Each
              requires its own treatment.
            </p>
            <div className="mt-14 md:mt-20">
              <EdgeCaseCards />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION G - Implementation notes + code
        ══════════════════════════════════════════════════════════════ */}
        <section className="mt-24 md:mt-36">
          <header>
            <p
              className="text-[12px] font-medium uppercase tracking-[0.08em]"
              style={{ color: "var(--text-subtle)" }}
            >
              Implementation
            </p>
            <h2
              className="mt-4 font-semibold leading-[1.2]"
              style={{ fontSize: "var(--text-h2)", color: "var(--text)" }}
            >
              The ConfidenceChip primitive.
            </h2>
          </header>
          <p
            className="mt-8 max-w-[64ch] text-pretty leading-[1.6]"
            style={{
              fontSize: "var(--text-body)",
              color: "var(--text-muted)",
            }}
          >
            The chip is the smallest display unit. It accepts a confidence object:
            a tier, a reasoning string, and the model&apos;s internal score. The dot
            encodes the recommended action. The label encodes the tier in plain
            language. The internal score is held in reserve and surfaced only on
            hover, alongside the reasoning, so the numeric signal is available for
            inspection without competing with the categorical headline.
          </p>
          <div className="mt-8">
            <CodeBlock />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION H - Trade-offs (table)
        ══════════════════════════════════════════════════════════════ */}
        <section className="mt-24 md:mt-36">
          <header>
            <p
              className="text-[12px] font-medium uppercase tracking-[0.08em]"
              style={{ color: "var(--text-subtle)" }}
            >
              TRADE-OFFS
            </p>
            <h2
              className="mt-4 font-semibold leading-[1.2]"
              style={{ fontSize: "var(--text-h2)", color: "var(--text)" }}
            >
              Why this, and not that.
            </h2>
          </header>
          <p
            className="mt-8 max-w-[64ch] text-pretty leading-[1.6]"
            style={{
              fontSize: "var(--text-body)",
              color: "var(--text-muted)",
            }}
          >
            Five places where the obvious choice and the right choice diverged.
          </p>

          <div
            className="mt-14 md:mt-20 overflow-hidden rounded-xl"
            style={{
              border: "1px solid var(--card-border)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            <table className="w-full text-[14px]">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--card-border)",
                    backgroundColor: "#F4F4F4",
                  }}
                >
                  {["Decision", "Considered", "Reasoning"].map((h) => (
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
                          ? "1px solid var(--card-border)"
                          : "none",
                      backgroundColor: "var(--card-bg)",
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
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION I - Footer nav (Linear-style prev/next)
        ══════════════════════════════════════════════════════════════ */}
        <div className="mt-24 md:mt-36">
          <div
            className="flex items-start justify-between pt-8"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {/* Previous - disabled */}
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

            {/* Next - active */}
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

      <div className="mt-24 md:mt-36">
        <Footer />
      </div>
    </div>
  )
}

"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import MessageThread from "@/components/patterns/MessageThread"
import { DEMO_MESSAGES_SINGLE } from "@/components/patterns/messageThreadData"

export default function Hero() {
  const prefersReducedMotion = useReducedMotion()

  const scrollToPatterns = () => {
    document.getElementById("patterns")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative pt-32 pb-0">
      {/* Subtle radial glow: light mode */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] dark:hidden"
        style={{
          background:
            "radial-gradient(ellipse 1200px 600px at 50% 0%, oklch(98% 0.008 250 / 0.6), transparent 70%)",
        }}
      />
      {/* Subtle radial glow: dark mode */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse 1200px 600px at 50% 0%, oklch(20% 0.02 250 / 0.4), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[540px_1fr] xl:gap-16">

          {/* ── Left column ── */}
          <motion.div
            className="max-w-[540px] self-start"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h1
              className="mt-0 pt-0 mb-6 text-balance font-semibold leading-[0.95] tracking-[-0.025em] [text-box-edge:cap_alphabetic] [text-box-trim:trim-start]"
              style={{ fontSize: "var(--text-display)", color: "var(--text)" }}
            >
              Designing trust into agentic systems.
            </h1>

            <p
              className="mb-10 max-w-[480px] text-pretty leading-[1.55]"
              style={{ fontSize: "var(--text-body-lg)", color: "var(--text-muted)" }}
            >
              Six interaction patterns for AI agents. Written and built by Eric
              Sparks, a product designer at Microsoft.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                className="h-10 px-5 text-sm font-medium"
                onClick={scrollToPatterns}
              >
                Explore patterns
              </Button>
              <a
                href="#about"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-10 px-5 text-sm font-medium"
                )}
              >
                Why this exists
              </a>
            </div>
          </motion.div>

          {/* Right column: DEMO label matches PatternGrid "Library"; MessageThread renders toggle then card */}
          <motion.div
            className="min-w-0 self-start"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          >
            <p
              className="mb-4 text-[12px] font-medium uppercase tracking-[0.08em]"
              style={{ color: "var(--text-subtle)" }}
            >
              Demo
            </p>
            <MessageThread
              messages={DEMO_MESSAGES_SINGLE}
              variant="compact"
              showWithWithoutToggle
              researchRailFooter
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}

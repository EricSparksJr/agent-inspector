import Image from "next/image"

export default function AboutStrip() {
  return (
    <section id="why-this-exists" className="mt-24 md:mt-36">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <header>
          <p
            className="text-[12px] font-medium uppercase tracking-[0.08em]"
            style={{ color: "var(--text-subtle)" }}
          >
            Why this exists
          </p>
          <h2
            className="mt-4 text-balance font-semibold leading-[1.15] tracking-[-0.01em]"
            style={{ fontSize: "var(--text-h2)", color: "var(--text)" }}
          >
            The interaction patterns are not documented.
          </h2>
        </header>

        <p
          className="mt-8 max-w-lg text-pretty leading-[1.6]"
          style={{ fontSize: "var(--text-body)", color: "var(--text-muted)" }}
        >
          The engineering patterns for AI agents are well documented. The
          interaction patterns are not. How trust, control, and recovery should
          feel from the user&apos;s side of the screen is still spread across
          blog posts, conference talks, and product launches.
        </p>

        <p
          className="mt-8 max-w-lg text-pretty leading-[1.6]"
          style={{ fontSize: "var(--text-body)", color: "var(--text-muted)" }}
        >
          Agent Inspector names those patterns, builds them, and argues for
          them.
        </p>

        {/* Awards strip */}
        <div className="mt-10 flex flex-col gap-6 md:mt-16 md:flex-row md:items-center md:gap-8">
          {/* Left column */}
          <div className="flex flex-shrink-0 flex-col gap-1.5">
            <p
              className="text-[12px] font-medium uppercase tracking-[0.08em]"
              style={{ color: "var(--text-subtle)" }}
            >
              Recognized by
            </p>
            <h3
              className="font-semibold"
              style={{ fontSize: "var(--text-h3)", color: "var(--text)" }}
            >
              CSS Design Awards 2026
            </h3>
            <p style={{ fontSize: "var(--text-small)", color: "var(--text-muted)" }}>
              Best UI, Best UX &amp; Best Innovation
            </p>
          </div>

          {/* Vertical hairline divider — desktop only */}
          <div
            className="hidden self-stretch md:block"
            style={{ width: "1px", backgroundColor: "var(--border)", flexShrink: 0 }}
            aria-hidden="true"
          />

          {/* Badge row — three official CSSDA vector badges */}
          <div className="flex flex-wrap items-center gap-6 md:gap-8">
            <Image
              src="/awards/cssda-ui-light.svg"
              alt="CSS Design Awards — Best UI Design"
              width={120}
              height={120}
              className="block h-auto w-[88px] dark:hidden"
            />
            <Image
              src="/awards/cssda-ui-dark.svg"
              alt="CSS Design Awards — Best UI Design"
              width={120}
              height={120}
              className="hidden h-auto w-[88px] dark:block"
            />
            <Image
              src="/awards/cssda-ux-light.svg"
              alt="CSS Design Awards — Best UX Design"
              width={120}
              height={120}
              className="block h-auto w-[88px] dark:hidden"
            />
            <Image
              src="/awards/cssda-ux-dark.svg"
              alt="CSS Design Awards — Best UX Design"
              width={120}
              height={120}
              className="hidden h-auto w-[88px] dark:block"
            />
            <Image
              src="/awards/cssda-inn-light.svg"
              alt="CSS Design Awards — Best Innovation"
              width={120}
              height={120}
              className="block h-auto w-[88px] dark:hidden"
            />
            <Image
              src="/awards/cssda-inn-dark.svg"
              alt="CSS Design Awards — Best Innovation"
              width={120}
              height={120}
              className="hidden h-auto w-[88px] dark:block"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

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
      </div>
    </section>
  )
}

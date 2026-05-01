export default function Footer() {
  return (
    <footer
      className="py-8"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">

        {/* Nav link row */}
        <div className="mb-5 flex items-center gap-3 text-[13px]">
          <a
            href="#patterns"
            className="transition-colors duration-[180ms] hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
          >
            Patterns
          </a>
          <span style={{ color: "var(--border-strong)" }}>·</span>
          <a
            href="#about"
            className="transition-colors duration-[180ms] hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
          >
            About
          </a>
        </div>

        {/* Copyright + meta row */}
        <div className="flex items-center justify-between">
          <p
            className="text-[13px]"
            style={{ color: "var(--text-subtle)" }}
          >
            © 2026 Eric Sparks
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/ericsparksjr/agent-inspector"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[13px] underline underline-offset-4 transition-colors duration-[180ms] hover:opacity-70"
              style={{
                color: "var(--text-subtle)",
                textDecorationColor: "var(--border-strong)",
              }}
            >
              GitHub
            </a>
            <span
              className="font-mono tabular-nums text-[13px]"
              style={{ color: "var(--text-subtle)" }}
            >
              v0.1.0
            </span>
          </div>
        </div>

      </div>
    </footer>
  )
}

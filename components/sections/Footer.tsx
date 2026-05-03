/** No underline at rest; 1px underline on hover (Stripe Press style). */
const FOOTER_LINK_NAV =
  "text-[14px] font-normal no-underline underline-offset-[6px] decoration-solid [text-decoration-thickness:1px] transition-opacity duration-150 hover:underline"

export default function Footer() {
  return (
    <footer
      className="py-16 md:py-20"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-24">
          {/* Brand */}
          <div className="flex min-w-0 flex-col gap-4">
            <p
              className="text-[12px] font-medium uppercase tracking-[0.08em]"
              style={{ color: "var(--text-subtle)" }}
            >
              Agent Inspector
            </p>
            <a
              href="https://www.linkedin.com/in/ericsparksjr/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${FOOTER_LINK_NAV} w-fit text-[15px] font-semibold`}
              style={{
                color: "var(--text)",
                textDecorationColor: "var(--border-strong)",
              }}
            >
              By Eric Sparks Jr
            </a>
            <p
              className="max-w-[36ch] text-[14px] leading-[1.6] text-pretty"
              style={{ color: "var(--text-muted)" }}
            >
              Product Designer at Microsoft. Designing AI agents inside enterprise
              software.
            </p>
            <a
              href="mailto:ericsparksjr@gmail.com"
              className={`${FOOTER_LINK_NAV} w-fit`}
              style={{
                color: "var(--text-muted)",
                textDecorationColor: "var(--border-strong)",
              }}
            >
              ericsparksjr@gmail.com
            </a>
          </div>

          {/* Explore */}
          <div className="flex min-w-0 flex-col gap-4">
            <p
              className="text-[12px] font-medium uppercase tracking-[0.08em]"
              style={{ color: "var(--text-subtle)" }}
            >
              Explore
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="/#patterns"
                className={`${FOOTER_LINK_NAV} w-fit`}
                style={{
                  color: "var(--text)",
                  textDecorationColor: "var(--border-strong)",
                }}
              >
                Patterns
              </a>
              <a
                href="/#why-this-exists"
                className={`${FOOTER_LINK_NAV} w-fit`}
                style={{
                  color: "var(--text)",
                  textDecorationColor: "var(--border-strong)",
                }}
              >
                Why this exists
              </a>
              <a
                href="https://github.com/EricSparksJr/agent-inspector"
                target="_blank"
                rel="noopener noreferrer"
                className={`${FOOTER_LINK_NAV} w-fit`}
                style={{
                  color: "var(--text)",
                  textDecorationColor: "var(--border-strong)",
                }}
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function AboutStrip() {
  return (
    <section id="about" className="pt-24 pb-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[14rem_1fr]">

          {/* Left: label */}
          <div className="pt-0.5">
            <p
              className="text-[12px] font-medium uppercase tracking-[0.08em]"
              style={{ color: "var(--text-subtle)" }}
            >
              About the Author
            </p>
          </div>

          {/* Right: prose + contact */}
          <div className="max-w-[58ch]">
            <p
              className="text-pretty leading-[1.65]"
              style={{ fontSize: "var(--text-body)", color: "var(--text-muted)" }}
            >
              Eric Sparks is a product designer at Microsoft. He started this
              library because pattern references for agent experience design are
              scattered across blog posts, internal docs, and Twitter threads.
            </p>

            <div className="mt-6 space-y-1.5">
              <p
                style={{ fontSize: "var(--text-small)", color: "var(--text-muted)" }}
              >
                email:{" "}
                <a
                  href="mailto:ericsparksjr@gmail.com"
                  className="underline underline-offset-4 transition-colors duration-[180ms] hover:text-text"
                  style={{ textDecorationColor: "var(--border-strong)" }}
                >
                  ericsparksjr@gmail.com
                </a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export function getScrollPaddingTop(): number {
  return (
    parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) ||
    0
  )
}

/** Scroll to an in-page anchor, honoring global html scroll-padding-top. */
export function scrollToHashTarget(id: string): void {
  const target = document.getElementById(id)
  if (!target) return

  target.scrollIntoView({ behavior: "auto", block: "start" })

  const paddingTop = getScrollPaddingTop()
  if (paddingTop <= 0) return

  const rect = target.getBoundingClientRect()
  // App Router cross-page loads may ignore scroll-padding-top; re-apply the CSS value.
  if (Math.abs(rect.top - paddingTop) > 2) {
    const top = rect.top + window.scrollY - paddingTop
    window.scrollTo({ top: Math.max(0, top), behavior: "auto" })
  }
}

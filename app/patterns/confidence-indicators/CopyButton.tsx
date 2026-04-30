"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export default function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy code"
      className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-all duration-[180ms]"
      style={{
        backgroundColor: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        color: copied ? "var(--success)" : "var(--text-muted)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {copied ? (
        <>
          <Check className="size-3" />
          Copied
        </>
      ) : (
        <>
          <Copy className="size-3" />
          Copy
        </>
      )}
    </button>
  )
}

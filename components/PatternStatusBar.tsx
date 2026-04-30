"use client"

import Link from "next/link"
import { patterns } from "@/lib/patterns"

export default function PatternStatusBar() {
  return (
    <div className="flex flex-wrap gap-2">
      {patterns.map((pattern) => {
        const isLive = !!pattern.href

        const chip = (
          <div
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.05em] transition-opacity duration-[180ms]"
            style={{
              backgroundColor: isLive ? "var(--bg-accent)" : "var(--bg-subtle)",
              color: isLive ? "var(--accent)" : "var(--text-muted)",
            }}
          >
            <span className="tabular-nums">{pattern.number}</span>
            <span style={{ color: isLive ? "var(--accent)" : "var(--border-strong)" }}>·</span>
            <span>{pattern.name}</span>
            {isLive ? (
              <span
                className="shrink-0 rounded-full"
                style={{ width: 5, height: 5, backgroundColor: "var(--accent)" }}
              />
            ) : (
              <span
                className="text-[10px]"
                style={{ color: "var(--text-subtle)" }}
              >
                Queued
              </span>
            )}
          </div>
        )

        return isLive ? (
          <Link
            key={pattern.id}
            href={pattern.href!}
            className="hover:opacity-75 transition-opacity duration-[180ms]"
          >
            {chip}
          </Link>
        ) : (
          <div key={pattern.id} className="cursor-default">
            {chip}
          </div>
        )
      })}
    </div>
  )
}

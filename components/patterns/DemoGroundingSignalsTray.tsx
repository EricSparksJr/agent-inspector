"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

type Variant = "default" | "compact"

export function DemoGroundingSignalsTray({
  variant = "default",
  value,
  onChange,
}: {
  variant?: Variant
  value: "with" | "without"
  onChange: (v: "with" | "without") => void
}) {
  const checked = value === "with"
  const px = variant === "compact" ? "px-5" : "px-6"

  return (
    <div
      className="flex w-full shrink-0 flex-col rounded-t-xl"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.02)",
        borderBottom: "1px solid var(--card-border)",
      }}
    >
      <label
        className={cn(
          "flex min-h-11 w-full cursor-pointer items-center justify-between gap-3",
          px,
        )}
      >
        <span
          className="min-w-0 shrink text-[13px] font-medium leading-normal tracking-normal"
          style={{
            color: "var(--text)",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          Show evidence
        </span>
        <SwitchPrimitive.Root
          checked={checked}
          onCheckedChange={(next) => onChange(next ? "with" : "without")}
          className={cn(
            "relative inline-flex h-6 w-[44px] shrink-0 cursor-pointer items-center rounded-full border-0 bg-[rgba(0,0,0,0.12)] p-0 outline-none transition-[background-color] duration-200 ease-out data-[checked]:bg-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]",
          )}
        >
          <SwitchPrimitive.Thumb
            className={cn(
              "pointer-events-none absolute left-[2px] top-1/2 size-5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition-[transform] duration-200 ease-out [transform:translate(0,-50%)] data-[checked]:[transform:translate(20px,-50%)]",
            )}
          />
        </SwitchPrimitive.Root>
      </label>
    </div>
  )
}

"use client"

import { useId, type SVGProps } from "react"

export type SparkleMarkProps = Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
  /** Renders width/height in pixels. Default matches MessageThread / pattern card sparkle. */
  size?: number
}

/**
 * Decorative AI sparkle: primary diamond plus satellite diamond, teal-to-blue aurora fill.
 */
export function SparkleMark({
  size = 16,
  className,
  "aria-hidden": ariaHidden = true,
  ...rest
}: SparkleMarkProps) {
  const gradientId = `sparkle-mark-grad-${useId().replace(/:/g, "")}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden={ariaHidden}
      {...rest}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <path
        d="M10 5 L12 11 L18 13 L12 15 L10 21 L8 15 L2 13 L8 11 Z"
        fill={`url(#${gradientId})`}
      />
      <path d="M18 2 L19 5 L22 6 L19 7 L18 10 L17 7 L14 6 L17 5 Z" fill={`url(#${gradientId})`} />
    </svg>
  )
}

"use client"

import { useEffect, useState } from "react"

const DEFAULT_ACCENT = "#8a2be2"

/**
 * Subscribes to the current music track's accent color. MusicPlayer dispatches
 * a `music:accent-changed` event whenever the playing track changes; any
 * component that wants to theme itself per-track can read this value.
 *
 * Also reads the current value of the `--accent` CSS variable on mount so
 * the first paint after navigation already matches the active track.
 */
export function useMusicAccent(fallback: string = DEFAULT_ACCENT): string {
  const [accent, setAccent] = useState<string>(fallback)

  useEffect(() => {
    if (typeof window === "undefined") return

    const current = document.documentElement.style.getPropertyValue("--accent")
    if (current) setAccent(current.trim())

    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ accent: string }>
      if (ce.detail?.accent) setAccent(ce.detail.accent)
    }
    window.addEventListener("music:accent-changed", handler)
    return () => window.removeEventListener("music:accent-changed", handler)
  }, [])

  return accent
}

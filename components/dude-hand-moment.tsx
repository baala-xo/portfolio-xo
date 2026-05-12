"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

/**
 * Beat-synced cartoon moment for 10,000 Aura.
 *
 * The hand peeks in from the upper-right with cartoon physics, rests at a
 * diagonal angle pointing down-left into the page, wags briefly, then whips
 * back out. The wrist/forearm is pushed off-screen so the "cut" edge sits
 * outside the viewport — the visitor only ever sees a complete palm + finger.
 */
export function DudeHandMoment() {
  const [active, setActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ effect: string }>
      if (ce.detail?.effect !== "dude-hand") return
      setActive(true)
      const t = window.setTimeout(() => setActive(false), 3000)
      return () => window.clearTimeout(t)
    }
    window.addEventListener("music:moment", handler)
    return () => window.removeEventListener("music:moment", handler)
  }, [])

  // Start the WebM playback AFTER the hand has slammed into view, so the
  // visitor doesn't miss the first half-second of frames while the hand is
  // still flying in from off-screen.
  useEffect(() => {
    if (!active) return
    const v = videoRef.current
    if (!v) return
    // Pause + reset immediately so the previous take's last frame doesn't
    // flash before the entry animation lands.
    try {
      v.pause()
      v.currentTime = 0
    } catch {
      // ignore
    }
    const playTimer = window.setTimeout(() => {
      try {
        v.currentTime = 0
        v.play().catch(() => undefined)
      } catch {
        // ignore
      }
    }, 200)
    return () => window.clearTimeout(playTimer)
  }, [active])

  return (
    <>
      {/* SVG luma-key filter — keeps the WebM's bright (hand) pixels and
        * makes near-black background pixels transparent in real time.
        * Saves us from re-exporting the asset with VP9 alpha. */}
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        style={{ position: "absolute", pointerEvents: "none" }}
      >
        <defs>
          <filter id="dude-hand-luma-key" colorInterpolationFilters="sRGB">
            <feColorMatrix type="luminanceToAlpha" result="luma" />
            <feComponentTransfer in="luma" result="mask">
              <feFuncA type="discrete" tableValues="0 0 1 1 1 1 1 1 1 1" />
            </feComponentTransfer>
            <feComposite in="SourceGraphic" in2="mask" operator="in" />
          </filter>
        </defs>
      </svg>

      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-[160] pointer-events-none overflow-hidden">
          <motion.video
            ref={videoRef}
            src="/dude-animation-3x.webm"
            muted
            playsInline
            autoPlay
            initial={{
              opacity: 0,
              scale: 0.62,
              rotate: -70,
              x: "20vw",
              y: "-22vh",
            }}
            animate={{
              opacity: [0, 1, 1, 1, 1, 1, 1, 1],
              scale: [0.62, 1.15, 0.95, 1.05, 1, 1, 1, 0.9],
              rotate: [-70, -32, -36, -28, -32, -28, -32, -78],
              x: ["20vw", "0vw", "0.8vw", "-0.8vw", "0vw", "0.8vw", "0vw", "45vw"],
              y: ["-22vh", "0vh", "0.8vh", "-0.8vh", "0vh", "-0.8vh", "0vh", "-35vh"],
            }}
            transition={{
              duration: 3.0,
              // Punchy entry (0 → 0.15 ≈ 450ms), long hold (0.15 → 0.95 ≈
              // 2.4s — well past the 1.75s WebM duration so the last frame
              // lingers), snappy 150ms withdraw at the end.
              times: [0, 0.06, 0.09, 0.12, 0.15, 0.7, 0.95, 1],
              ease: "easeOut",
            }}
            className="absolute"
            style={{
              // Sits in the top-right corner with the wrist/cuff edge of the
              // original frame pushed past the viewport edges, so the
              // artist's drawn cut line is hidden by the viewport boundary.
              top: "clamp(-30px, -2.5vh, -10px)",
              right: "clamp(-60px, -3.5vw, -20px)",
              width: "clamp(280px, 38vw, 480px)",
              height: "auto",
              transformOrigin: "65% 45%",
              // Order matters: luma-key first (drops black bg), then
              // drop-shadows applied to the keyed result.
              filter:
                "url(#dude-hand-luma-key) drop-shadow(0 14px 26px rgba(0,0,0,0.55)) drop-shadow(2px 2px 0 rgba(0,0,0,0.85))",
              willChange: "transform, opacity",
            }}
          />
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

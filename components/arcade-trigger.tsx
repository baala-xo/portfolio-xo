"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Press_Start_2P } from "next/font/google"
import MagneticWrapper from "@/components/atomixui/magnetic-wrapper"

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

export function ArcadeTrigger() {
  const [hovered, setHovered] = useState(false)

  const playInsertCoin = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = "square"
      o.frequency.setValueAtTime(660, ctx.currentTime)
      o.frequency.setValueAtTime(880, ctx.currentTime + 0.06)
      g.gain.setValueAtTime(0.08, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
      o.connect(g).connect(ctx.destination)
      o.start()
      o.stop(ctx.currentTime + 0.2)
    } catch {
      // Audio not available — silent fail.
    }
  }

  return (
    <div className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-50 pointer-events-none">
      <style>{`
        @keyframes arcade-pulse {
          0%, 100% { box-shadow: 4px 4px 0 #000, 0 0 14px rgba(255,46,136,0.55); }
          50% { box-shadow: 4px 4px 0 #000, 0 0 28px rgba(255,46,136,0.95), 0 0 40px rgba(0,240,255,0.35); }
        }
        @keyframes arcade-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.35; }
        }
        @keyframes arcade-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>

      <MagneticWrapper elasticity={0.4}>
      <motion.a
        href="/arcade"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={playInsertCoin}
        aria-label="Open BLEEP-BOX arcade"
        initial={{ opacity: 0, x: -20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        whileTap={{ scale: 0.94, transition: { duration: 0.08 } }}
        className={`${pressStart.className} pointer-events-auto relative inline-flex flex-col items-start gap-1 bg-black border-2 md:border-[3px] border-[#ff2e88] px-3 py-2.5 md:px-4 md:py-2.5 cursor-pointer select-none overflow-hidden active:translate-x-[2px] active:translate-y-[2px]`}
        style={{
          animation: "arcade-pulse 1.6s ease-in-out infinite",
          imageRendering: "pixelated",
          textDecoration: "none",
        }}
      >
        {/* CRT scanline sweep */}
        <span
          className="pointer-events-none absolute left-0 right-0 h-1 bg-white/10"
          style={{ animation: "arcade-scan 2.8s linear infinite" }}
        />

        {/* Top row: star + label */}
        <span className="relative flex items-center gap-2">
          <span
            className="text-[10px] md:text-[11px] text-[#fff200]"
            style={{ textShadow: "0 0 6px #fff200" }}
          >
            ★
          </span>
          <span
            className="text-[8px] md:text-[10px] text-[#ff2e88] tracking-[2px]"
            style={{ textShadow: "0 0 6px rgba(255,46,136,0.7)" }}
          >
            ARCADE
          </span>
        </span>

        {/* Bottom row: blinking insert coin */}
        <span
          className="relative text-[7px] md:text-[8px] text-[#00f0ff] tracking-[1px]"
          style={{
            textShadow: "0 0 4px rgba(0,240,255,0.9)",
            animation: "arcade-blink 1s steps(2) infinite",
          }}
        >
          ▶ INSERT COIN
        </span>

        {/* Hover tooltip */}
        <AnimatePresence>
          {hovered && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className={`${pressStart.className} pointer-events-none absolute left-0 bottom-full mb-2 whitespace-nowrap bg-black border-2 border-[#00f0ff] px-2 py-1.5 text-[7px] md:text-[8px] text-[#00f0ff]`}
              style={{
                textShadow: "0 0 4px rgba(0,240,255,0.9)",
                boxShadow: "3px 3px 0 #000, 0 0 12px rgba(0,240,255,0.45)",
              }}
            >
              BLEEP-BOX // 8-BIT SYNTH
            </motion.span>
          )}
        </AnimatePresence>
      </motion.a>
      </MagneticWrapper>
    </div>
  )
}

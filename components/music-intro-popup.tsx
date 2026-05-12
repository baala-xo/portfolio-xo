"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ClickyButton } from "@/components/atomixui/clicky-button"

const INTENT_KEY = "xo:music:intent"

export function MusicIntroPopup() {
  const [open, setOpen] = useState(false)

  // Show only if the visitor hasn't already chosen "play" or "skip" before.
  // Slight delay so the portfolio paints first.
  useEffect(() => {
    if (typeof window === "undefined") return
    const intent = window.localStorage.getItem(INTENT_KEY)
    if (intent === "play" || intent === "skip") return
    const t = window.setTimeout(() => setOpen(true), 500)
    return () => window.clearTimeout(t)
  }, [])

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const startMusic = () => {
    try {
      window.localStorage.setItem(INTENT_KEY, "play")
    } catch {
      // ignore — private mode etc.
    }
    window.dispatchEvent(new CustomEvent("music:play"))
    setOpen(false)
  }

  const skipMusic = () => {
    try {
      window.localStorage.setItem(INTENT_KEY, "skip")
    } catch {
      // ignore
    }
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md flex items-center justify-center px-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) skipMusic()
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="music-intro-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm rounded-2xl bg-background border border-white/10 shadow-2xl p-7 md:p-8"
          >
            <h2
              id="music-intro-title"
              className="text-2xl md:text-3xl font-bold leading-tight tracking-tight mb-3 lowercase text-foreground"
            >
              play the song.
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed mb-7">
              Timeless · The Weeknd.
            </p>

            <div className="flex items-center gap-5">
              <ClickyButton
                onClick={startMusic}
                className="text-sm font-semibold tracking-wide lowercase"
                aria-label="Play the soundtrack"
              >
                play
              </ClickyButton>
              <button
                onClick={skipMusic}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors lowercase"
                aria-label="Continue without music"
              >
                skip
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

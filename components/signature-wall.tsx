"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Signature } from "@/components/atomixui/signature"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SignatureDoc {
  _id: string
  _creationTime: number
  signature: string
  author_name?: string
}

const SESSION_KEY = "xo:signed"

export function SignatureWall() {
  const signatures = (useQuery(api.signatures.getSignatures) ?? []) as SignatureDoc[]
  const addSignature = useMutation(api.signatures.addSignature)

  const [name, setName] = useState("")
  const [hasSignedThisSession, setHasSignedThisSession] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    setHasSignedThisSession(sessionStorage.getItem(SESSION_KEY) === "true")
  }, [])

  const handleComplete = async (dataUrl: string) => {
    if (hasSignedThisSession) return
    setIsSubmitting(true)
    try {
      await addSignature({
        signature: dataUrl,
        author_name: name.trim() || undefined,
      })
      sessionStorage.setItem(SESSION_KEY, "true")
      setHasSignedThisSession(true)
      setName("")
    } catch (err) {
      console.error("[signature] post failed", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = signatures === undefined
  const count = signatures.length

  return (
    <section id="wall" className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight">Sign the wall</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {count > 0
            ? `${count} ${count === 1 ? "person has" : "people have"} signed so far. `
            : ""}
          If you&apos;ve made it this far, leave a mark. No login, no email — just a
          quick scribble. I see every one of them.
        </p>
      </div>

      {/* Sign card */}
      <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-5">
        <AnimatePresence mode="wait">
          {hasSignedThisSession ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-3 py-2"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8A2BE2]/15 border border-[#8A2BE2]/30">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">Thanks for signing.</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your mark is on the wall below — scroll down to find it.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="sig-author"
                  className="block text-sm font-medium text-foreground"
                >
                  Name{" "}
                  <span className="font-normal text-muted-foreground/70">(optional)</span>
                </label>
                <Input
                  id="sig-author"
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  data-1p-ignore
                  data-lpignore="true"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="What should we call you?"
                  maxLength={40}
                  className="bg-background/60 border-border/60 focus-visible:ring-2 focus-visible:ring-[#8A2BE2]/40 focus-visible:border-[#8A2BE2]/60 placeholder:text-muted-foreground/50"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Signature onComplete={handleComplete} isSubmitting={isSubmitting} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Wall */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/2] rounded-lg border border-border/30 bg-card/30 animate-pulse"
            />
          ))
        ) : signatures.length === 0 ? (
          <p className="col-span-full text-sm text-muted-foreground py-10 text-center">
            No signatures yet — be the first to leave one.
          </p>
        ) : (
          <AnimatePresence>
            {signatures.map((sig, i) => (
              <SignatureTile key={sig._id} sig={sig} index={i} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}

function SignatureTile({ sig, index }: { sig: SignatureDoc; index: number }) {
  const tilt = ((parseInt(sig._id.slice(-2), 36) % 7) - 3) * 0.6

  return (
    <motion.figure
      layout
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.03, 0.4),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -2, rotate: 0, scale: 1.03 }}
      style={{ rotate: `${tilt}deg` }}
      className={cn(
        "group relative aspect-[3/2] rounded-lg border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden",
        "transition-colors hover:border-[#8A2BE2]/40 hover:shadow-[0_0_20px_rgba(138,43,226,0.12)]",
      )}
    >
      <img
        src={sig.signature}
        alt={sig.author_name ? `Signed by ${sig.author_name}` : "Anonymous signature"}
        className="absolute inset-0 h-full w-full object-contain p-2"
        loading="lazy"
      />
      {sig.author_name && (
        <figcaption
          className={cn(
            "absolute bottom-0 left-0 right-0 px-2 py-1.5",
            "text-xs text-muted-foreground",
            "bg-gradient-to-t from-background/95 via-background/60 to-transparent",
            "truncate",
          )}
        >
          {sig.author_name}
        </figcaption>
      )}
    </motion.figure>
  )
}

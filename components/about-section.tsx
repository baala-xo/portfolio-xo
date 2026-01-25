"use client"

import { useState } from "react"
import Link from "next/link"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

export function AboutSection() {
  const [zemuriaTipOpen, setZemuriaTipOpen] = useState(false)
  const [saulTipOpen, setSaulTipOpen] = useState(false)
  const [zuckTipOpen, setZuckTipOpen] = useState(false)
  const [jesseTipOpen, setJesseTipOpen] = useState(false)

  return (
    <section id="about" className="space-y-6">
      <h2 className="text-2xl font-bold">About</h2>

      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>Builds software for the web.</p>
        <div>
          Got good enough to do it professionally at{" "}
          {/* Desktop: Tooltip on hover */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-primary underline decoration-dotted underline-offset-4 cursor-help hidden md:inline">
                  Zemuria Inc
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-sm">
                Operated by Jason Samuel
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* Mobile: Click to toggle tooltip */}
          <span
            className="text-primary underline decoration-dotted underline-offset-4 cursor-pointer md:hidden relative"
            onClick={() => setZemuriaTipOpen(!zemuriaTipOpen)}
          >
            Zemuria
            {zemuriaTipOpen && (
              <span className="absolute left-1/2 -translate-x-1/2 -top-10 bg-popover text-popover-foreground text-xs px-3 py-1.5 rounded-md shadow-lg border whitespace-nowrap z-50">
                Founded by Jason Samuel
              </span>
            )}
          </span>
          .
        </div>
        <p>Holds an M.Sc in Information Technology. 🐣</p>
        <p>In love with Claude Opus 🙂‍↔️.</p>
        <div>
          Influenced by the erratic brilliance of{" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-primary font-mono text-sm underline decoration-dotted underline-offset-4 cursor-help hidden md:inline">
                  Saul Goodman
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-background/95 border-border/50 backdrop-blur-md">
                <div className="font-mono text-[10px] space-y-1 p-1 uppercase tracking-tight">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-amber-500" />
                    <span className="text-muted-foreground/60">FILE_REF:</span>
                    <span>SLIPPIN_JIMMY</span>
                  </div>
                  <div className="text-muted-foreground/40 mt-1 pt-1 border-t border-border/10">
                    "S'all good, man!"
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span
            className="text-primary font-mono text-sm underline decoration-dotted underline-offset-4 cursor-pointer md:hidden relative"
            onClick={() => setSaulTipOpen(!saulTipOpen)}
          >
            Saul Goodman
            {saulTipOpen && (
              <span className="absolute left-1/2 -translate-x-1/2 -top-12 bg-popover text-popover-foreground text-[10px] px-3 py-1.5 rounded-md shadow-lg border whitespace-nowrap z-50 font-mono">
                REF: SLIPPIN_JIMMY | "S'all good, man!"
              </span>
            )}
          </span>
          , the resilience of{" "}
          <HoverCard>
            <HoverCardTrigger asChild>
              <span className="text-primary font-mono text-sm underline decoration-dotted underline-offset-4 cursor-pointer hidden md:inline">
                Jesse Pinkman
              </span>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 p-2 bg-background/95 border-border/50 backdrop-blur-md">
              <div className="space-y-2">
                <img
                  src="/aaron paul.jpeg"
                  alt="Jesse Pinkman"
                  className="rounded-md object-cover w-full h-40 filter grayscale hover:grayscale-0 transition-all duration-500"
                />
                <div className="font-mono text-[10px] space-y-1 p-1 uppercase tracking-tight">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground/60">ID:</span>
                    <span>CAPN_COOK</span>
                  </div>
                  <div className="text-muted-foreground/40 mt-1 pt-1 border-t border-border/10 text-[9px]">
                    "Yo, Science!"
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <span
            className="text-primary font-mono text-sm underline decoration-dotted underline-offset-4 cursor-pointer md:hidden relative"
            onClick={() => setJesseTipOpen(!jesseTipOpen)}
          >
            Jesse Pinkman
            {jesseTipOpen && (
              <span className="absolute left-1/2 -translate-x-1/2 -top-12 bg-popover text-popover-foreground text-[10px] px-3 py-1.5 rounded-md shadow-lg border whitespace-nowrap z-50 font-mono">
                ID: CAPN_COOK | "Yo, Science!"
              </span>
            )}
          </span>

          <span
            className="text-primary font-mono text-sm underline decoration-dotted underline-offset-4 cursor-pointer md:hidden relative"
            onClick={() => setZuckTipOpen(!zuckTipOpen)}
          >

            {zuckTipOpen && (
              <span className="absolute left-1/2 -translate-x-1/2 -top-12 bg-popover text-popover-foreground text-[10px] px-3 py-1.5 rounded-md shadow-lg border whitespace-nowrap z-50 font-mono">
                REF: SOCIAL_ENGINEER | "Move fast..."
              </span>
            )}
          </span>
          .
        </div>
        <div>
          In my leisure time, I enjoy scrolling on Instagram and X, listening to music, and playing{" "}
          {/* Mobile: Show as link */}
          <Link
            href="https://link.brawlstars.com/?supercell_id&p=41-aedd178d-3aa1-4ff3-beef-05ff9b2af2df"
            target="_blank"
            className="text-blue-600 underline cursor-pointer md:hidden"
          >
            Brawlstars
          </Link>
          {/* Desktop: Show hover card */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <span className="text-blue-600 underline cursor-pointer hidden md:inline">Brawlstars</span>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 p-2">
              <img
                src="/brawlstars-invite.jpeg"
                alt="Brawlstars invite preview"
                className="rounded-md object-cover w-full h-40"
              />
            </HoverCardContent>
          </HoverCard>
          .
        </div>
      </div>
    </section>
  )
}

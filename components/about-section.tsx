"use client"

import Link from "next/link"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"

export function AboutSection() {
  return (
    <section id="about" className="space-y-6">
      <h2 className="text-2xl font-bold">About</h2>

      <div className="space-y-5 text-muted-foreground leading-relaxed text-base">
        <p>
          I build for the web and somehow do it professionally at{" "}
          <span className="text-primary underline decoration-dotted underline-offset-4">Zemuria Inc</span>. 😎
        </p>
        <p>
          M.Sc. in IT, fueled by Claude Opus and the kind of energy{" "}
          <span className="text-primary font-mono text-sm underline decoration-dotted underline-offset-4">
            Saul Goodman
          </span>{" "}
          and{" "}
          <span className="text-primary font-mono text-sm underline decoration-dotted underline-offset-4">
            Jesse Pinkman
          </span>{" "}
          would probably approve of. 🩵😝
        </p>
        <p>
          Off the clock: music,{" "}
          {/* Mobile: Show as link */}
          <Link
            href="https://link.brawlstars.com/?supercell_id&p=41-aedd178d-3aa1-4ff3-beef-05ff9b2af2df"
            target="_blank"
            className="text-blue-600 underline cursor-pointer md:hidden"
          >
            Brawl Stars
          </Link>
          {/* Desktop: Show hover card */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link
                href="https://link.brawlstars.com/?supercell_id&p=41-aedd178d-3aa1-4ff3-beef-05ff9b2af2df"
                target="_blank"
                className="text-blue-600 underline cursor-pointer hidden md:inline"
              >
                Brawl Stars
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 p-2">
              <img
                src="/brawlstars-invite.jpeg"
                alt="Brawlstars invite preview"
                className="rounded-md object-cover w-full h-40"
              />
            </HoverCardContent>
          </HoverCard>
          , and a little too much Instagram/X. 🐣
        </p>
      </div>
    </section>
  )
}

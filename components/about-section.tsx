import Link from "next/link"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"

export function AboutSection() {
  return (
    <section id="about" className="space-y-6">
      <h2 className="text-2xl font-bold">About</h2>
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>tldr; learnt by building stuff on the internet.</p>
        <p>I deeply study web development, currently focusing on LLM integrations into web-apps.</p>
        <p>
          I’ve built and deployed several personal projects using modern frameworks like Next.js, Node.js, Tailwind, and FastAPI. 
          My recent experiments involve AI/ML, prompt engineering.
        </p>
        <p>I hold a Master’s degree in Information Technology (M.Sc IT).</p>
        <p>I love technology, gemini 2.5 pro and my family 💜.</p>
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

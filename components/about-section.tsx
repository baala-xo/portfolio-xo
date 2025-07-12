import { HoverCard,HoverCardContent,HoverCardTrigger } from "./ui/hover-card"


export function AboutSection() {
  return (
    <section id="about" className="space-y-6">
      <h2 className="text-2xl font-bold">About</h2>
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>tldr; learnt by building stuff on the internet.</p>
        <p>I deeply study web development,currently focusing on LLM integerations into web-apps .</p>
        <p>
          Graduated with Master's in Information Technology [M.Sc IT].
        </p>
        <p>I love technology , gemini 2.5 pro and my family .</p>
        <p>
    In my leisure time, I enjoy scrolling on Instagram and X, listening to music, and playing{' '}
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="text-blue-600 underline cursor-pointer">Brawlstars</span>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 p-2">
        <img
          src="/brawlstars-invite.jpeg"
          alt="Preview"
          className="rounded-md object-cover w-full h-40"
        />
      </HoverCardContent>
    </HoverCard>
    .
  </p>
      </div>
    </section>
  )
}

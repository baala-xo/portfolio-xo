"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"

const skills = ["React", "Next.js", "Vercel", "Git", "GitHub", "Supabase"]

export function SkillsSection() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  return (
    <section id="skills" className="space-y-6">
      <h2 className="text-2xl font-bold">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className={`px-3 py-1 text-sm font-normal bg-muted transition-all duration-300 ease-out cursor-pointer ${
              hoveredSkill === skill ? "skill-glow" : "border-border/50"
            }`}
            onMouseEnter={() => setHoveredSkill(skill)}
            onMouseLeave={() => setHoveredSkill(null)}
          >
            {skill}
          </Badge>
        ))}
      </div>
    </section>
  )
}

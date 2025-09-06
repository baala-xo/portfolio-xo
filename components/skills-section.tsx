"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"

// Categorized skills with their respective categories
const skillsData = [
  // Languages
  { name: "JavaScript", category: "Languages" },
  { name: "TypeScript", category: "Languages" },
  { name: "Python", category: "Languages" },
  
  // Frameworks
  { name: "React", category: "Frameworks" },
  { name: "Next.js", category: "Frameworks" },
  { name: "FastAPI", category: "Frameworks" },
  
  // Tools & Services
  { name: "Supabase", category: "Tools & Services" },
  { name: "Figma", category: "Tools & Services" },
  { name: "Vercel", category: "Tools & Services" },
  { name: "GitHub", category: "Tools & Services" },
  { name: "Convex", category: "Tools & Services" },
  { name: "Sanity", category: "Tools & Services" },
  { name: "ShadCN", category: "Tools & Services" },
]

// Category color mapping - swapped Languages and Frameworks colors
const categoryColors = {
  "Languages": {
    border: "border-purple-400", 
    hoverBorder: "border-purple-500",
    glow: "0 0 15px rgba(138, 43, 226, 0.5), 0 0 25px rgba(138, 43, 226, 0.3)"
  },
  "Frameworks": {
    border: "border-blue-400",
    hoverBorder: "border-blue-500",
    glow: "0 0 15px rgba(59, 130, 246, 0.5), 0 0 25px rgba(59, 130, 246, 0.3)"
  },
  "Tools & Services": {
    border: "border-green-400",
    hoverBorder: "border-green-500", 
    glow: "0 0 15px rgba(34, 197, 94, 0.5), 0 0 25px rgba(34, 197, 94, 0.3)"
  }
}

export function SkillsSection() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  return (
    <section id="skills" className="space-y-6">
      <h2 className="text-2xl font-bold">Skills</h2>
      
      {/* Optional: Category Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-2">
        {Object.entries(categoryColors).map(([category, colors]) => (
          <div key={category} className="flex items-center gap-1.5">
            <div 
              className={`w-3 h-3 rounded border ${colors.border}`}
            />
            <span>{category}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {skillsData.map((skill) => {
          const categoryStyle = categoryColors[skill.category as keyof typeof categoryColors]
          const isHovered = hoveredSkill === skill.name
          
          return (
            <Badge
              key={skill.name}
              variant="secondary"
              className={`
                px-3 py-1 text-sm font-normal bg-muted transition-all duration-300 ease-out cursor-pointer
                border ${isHovered ? categoryStyle.hoverBorder : categoryStyle.border}
              `}
              style={{
                boxShadow: isHovered ? categoryStyle.glow : 'none',
                transition: 'all 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out'
              }}
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
              title={`${skill.category}: ${skill.name}`}
            >
              {skill.name}
            </Badge>
          )
        })}
      </div>
    </section>
  )
}

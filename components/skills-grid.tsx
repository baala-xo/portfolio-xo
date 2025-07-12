import { Card, CardContent } from "@/components/ui/card"
import { Code2, Database, Globe, Smartphone, GitBranch, Cloud, Palette, Terminal, Layers } from "lucide-react"

const skills = [
  {
    category: "Languages",
    items: [
      { name: "JavaScript", icon: Code2 },
      { name: "Python", icon: Terminal },
    ],
  },
  {
    category: "Frontend",
    items: [
      { name: "ReactJS", icon: Layers },
      { name: "NextJS", icon: Globe },
      { name: "TailwindCSS", icon: Palette },
      { name: "ShadCN", icon: Smartphone },
    ],
  },
  {
    category: "Tools & Services",
    items: [
      { name: "Git", icon: GitBranch },
      { name: "GitHub", icon: GitBranch },
      { name: "Postman", icon: Globe },
      { name: "Vercel", icon: Cloud },
      { name: "Supabase", icon: Database },
    ],
  },
]

export function SkillsGrid() {
  return (
    <div className="space-y-8">
      {skills.map((category) => (
        <div key={category.category} className="space-y-4">
          <h3 className="text-xl font-semibold text-center">{category.category}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {category.items.map((skill) => {
              const IconComponent = skill.icon
              return (
                <Card
                  key={skill.name}
                  className="group hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6 flex flex-col items-center space-y-3">
                    <div className="p-3 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                      <IconComponent className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-center">{skill.name}</span>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

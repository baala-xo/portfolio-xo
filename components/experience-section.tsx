import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Calendar, MapPin } from "lucide-react"

const experiences = [
  {
    type: "education",
    title: "M.Sc. Information Technology",
    organization: "Hindusthan College of Arts and Science",
    location: "Coimbatore",
    period: "2023 - 2025",
    status: "Current",
    grade: "CGPA: 7.6",
    description: "Focusing on advanced software development, AI/ML applications, and modern web technologies.",
  },
  {
    type: "education",
    title: "B.Sc. Information Technology",
    organization: "Kaamadhenu Arts and Science College",
    location: "Erode",
    period: "2020 - 2023",
    status: "Completed",
    grade: "CGPA: 7.4",
    description: "Foundation in computer science, programming fundamentals, and software engineering principles.",
  },
]

export function ExperienceSection() {
  return (
    <section id="experience" className="py-32 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Education & Experience</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              My academic journey and professional development.
            </p>
          </div>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary"
              >
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <Badge variant={exp.status === "Current" ? "default" : "secondary"}>{exp.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {exp.period}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {exp.location}
                      </div>
                    </div>

                    <div className="md:col-span-3 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {exp.title}
                        </h3>
                        <p className="text-lg text-muted-foreground font-medium">{exp.organization}</p>
                        <Badge variant="outline" className="font-mono text-xs">
                          {exp.grade}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

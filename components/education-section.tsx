import Image from "next/image"
import { Badge } from "@/components/ui/badge"

const education = [
  {
    institution: "Hindusthan College of Arts and Science",
    degree: "M.Sc. Information Technology",
    period: "2023 - 2025",
    cgpa: "7.6",
    logo: "/hicas.png", // Placeholder: Add your Hindusthan College logo here (e.g., /hindusthan-logo.jpg)
  }

]

export function EducationSection() {
  return (
    <section id="education" className="space-y-6">
      <h2 className="text-2xl font-bold">Education</h2>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded overflow-hidden bg-muted">
                <Image
                  src={edu.logo || "/placeholder.svg"}
                  alt={edu.institution}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{edu.institution}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{edu.degree}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">CGPA:</span>
                  <Badge variant="outline" className="text-xs font-mono">
                    {edu.cgpa}
                  </Badge>
                </div>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">{edu.period}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

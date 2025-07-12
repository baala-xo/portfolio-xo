const experiences = [
  {
    company: "Freelance Projects",
    role: "Full-Stack Developer",
    period: "2023 - Present",
    icon: "💻",
  },
  {
    company: "Open Source Contributions",
    role: "Contributor",
    period: "2022 - Present",
    icon: "🌟",
  },
]

export function WorkExperience() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Cool places I worked at</h2>
      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-sm">{exp.icon}</div>
              <div>
                <h3 className="font-medium">{exp.company}</h3>
                <p className="text-sm text-muted-foreground">{exp.role}</p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">{exp.period}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

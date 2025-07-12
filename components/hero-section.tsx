"use client"

import { IdentityCard } from "@/components/identity-card"
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="container max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 lg:pr-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-lg text-muted-foreground font-medium">Hello, I'm</p>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none">
                  Balachandar<span className="text-primary">.</span>
                </h1>
                <h2 className="text-2xl md:text-3xl text-muted-foreground font-light">Full-Stack Developer</h2>
              </div>

              <div className="w-24 h-1 bg-primary rounded-full" />

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Passionate about building efficient, user-centric web applications with clean architecture and modern
                design principles. Specializing in AI integration and full-stack development.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button onClick={scrollToProjects} size="lg" className="px-8 py-6 text-base">
                View My Work
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-base bg-transparent" asChild>
                <a href="mailto:bala2003fd@gmail.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Get In Touch
                </a>
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <a
                href="https://github.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Right Content - ID Card (PRESERVED) */}
          <div className="flex justify-center lg:justify-end">
            <IdentityCard />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button onClick={scrollToProjects} className="text-muted-foreground hover:text-primary transition-colors">
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  )
}

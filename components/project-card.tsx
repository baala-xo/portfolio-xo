"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, FileText } from "lucide-react"

interface ProjectCardProps {
  number: number
  title: string
  description: string
  technologies: string[]
  link?: string
  status?: "building" | "completed"
  academic?: boolean
  documentationLink?: string
}

export function ProjectCard({
  number,
  title,
  description,
  technologies,
  link,
  status,
  academic,
  documentationLink,
}: ProjectCardProps) {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium mt-1">
            {number}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium">{title}</h3>
              {status === "building" && (
                <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                  building
                </Badge>
              )}
              {academic && (
                <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">
                  academic
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{description}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {technologies.map((tech) => (
                <span key={tech} className="text-xs text-muted-foreground">
                  {tech}
                  {technologies.indexOf(tech) < technologies.length - 1 && ", "}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-right">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 project-link-glow ${
                hoveredLink === "view" ? "active-link-glow" : ""
              }`}
              onMouseEnter={() => setHoveredLink("view")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              View <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {documentationLink && (
            <a
              href={documentationLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 project-link-glow ${
                hoveredLink === "docs" ? "active-link-glow" : ""
              }`}
              onMouseEnter={() => setHoveredLink("docs")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Docs <FileText className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

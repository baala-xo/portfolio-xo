"use client"

import { EnhancedProjectCard } from "./enhanced-project-card"

interface SimpleProjectCardProps {
  number: number
  title: string
  description: string
  technologies: string[]
  link?: string
  documentationLink?: string
  status?: "building" | "completed" | "planning"
  academic?: boolean
}

export function SimpleProjectCard(props: SimpleProjectCardProps) {
  return (
    <EnhancedProjectCard
      {...props}
      // You can set default handlers or omit them for simpler usage
      onFavoriteToggle={undefined}
      onShare={undefined}
    />
  )
}

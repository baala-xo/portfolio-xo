export interface ProjectCardProps {
  number: number
  title: string
  description: string
  technologies: string[]
  link?: string
  status?: "building" | "completed" | "planning"
  academic?: boolean
  documentationLink?: string
  thumbnailUrl?: string
  progress?: number
  lastUpdated?: string
  isFavorite?: boolean
  onFavoriteToggle?: (id: number) => void
  onShare?: (title: string, url?: string) => void
}

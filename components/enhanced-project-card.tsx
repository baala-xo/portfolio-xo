"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExternalLink, FileText, Heart, Share2, ChevronDown, ChevronUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'

// Inline hooks to avoid import issues
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

const useIsMobile = () => useMediaQuery('(max-width: 640px)')
const useHasHover = () => useMediaQuery('(hover: hover)')
const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

// Inline utility functions
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

const shareProject = async (title: string, url?: string) => {
  if (navigator.share && url) {
    try {
      await navigator.share({
        title: `Check out: ${title}`,
        url: url,
      })
    } catch (err) {
      console.log('Error sharing:', err)
    }
  } else if (url) {
    navigator.clipboard.writeText(url)
  }
}

const hapticFeedback = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50)
  }
}

// Component props interface
interface ProjectCardProps {
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

export function EnhancedProjectCard({
  number,
  title,
  description,
  technologies,
  link,
  status = "completed",
  academic,
  documentationLink,
  thumbnailUrl,
  progress,
  lastUpdated,
  isFavorite = false,
  onFavoriteToggle,
  onShare,
}: ProjectCardProps) {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [showAllTech, setShowAllTech] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const longPressTimer = useRef<NodeJS.Timeout>(undefined)

  const isMobile = useIsMobile()
  const hasHover = useHasHover()
  const prefersReducedMotion = usePrefersReducedMotion()

  const maxDescriptionLength = isMobile ? 100 : 200
  const maxVisibleTech = isMobile ? 3 : 6
  const shouldTruncateDescription = description.length > maxDescriptionLength
  const shouldTruncateTech = technologies.length > maxVisibleTech

  // Enhanced mobile click handler with loading state
  const handleMobileClick = useCallback(async (e: React.MouseEvent) => {
    if (!isMobile || !link) return

    e.preventDefault()
    setIsLoading(true)
    hapticFeedback()

    // Simulate loading delay for better UX
    setTimeout(() => {
      window.open(link, '_blank', 'noopener,noreferrer')
      setIsLoading(false)
    }, 200)
  }, [isMobile, link])

  // Long press handler for context menu
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return

    setIsPressed(true)
    longPressTimer.current = setTimeout(() => {
      hapticFeedback()
      if (onShare) {
        onShare(title, link)
      } else {
        shareProject(title, link)
      }
    }, 800)
  }, [isMobile, title, link, onShare])

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false)
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }, [])

  // Favorite toggle handler
  const handleFavoriteToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    hapticFeedback()
    onFavoriteToggle?.(number)
  }, [number, onFavoriteToggle])

  const getStatusIcon = () => {
    switch (status) {
      case "building":
        return <Clock className="w-3 h-3" />
      case "completed":
        return <CheckCircle className="w-3 h-3" />
      case "planning":
        return <AlertCircle className="w-3 h-3" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "building":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "planning":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
    }
  }, [])

  return (
    <Card
      ref={cardRef}
      className={`
        relative overflow-hidden transition-all duration-500 ease-out
        ${isMobile ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'}
        ${isPressed ? 'scale-[0.97] shadow-lg' : ''}
        ${isLoading ? 'opacity-70' : ''}
        ${!prefersReducedMotion ? 'transform-gpu' : ''}
        border-2 border-transparent
        p-4 sm:p-5
      `}
      style={{
        borderColor: isHovered ? 'rgba(138, 43, 226, 0.6)' : 'transparent',
        boxShadow: isHovered
          ? '0 0 20px rgba(138, 43, 226, 0.4), 0 0 40px rgba(138, 43, 226, 0.2), 0 0 60px rgba(138, 43, 226, 0.1)'
          : 'none',
        transition: 'all 0.5s ease-out, box-shadow 0.5s ease-out, border-color 0.5s ease-out'
      }}
      onClick={handleMobileClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={isMobile && link ? "button" : undefined}
      aria-label={isMobile && link ? `Open ${title} project` : undefined}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}



      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              {/* Title and badges */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-base sm:text-lg leading-tight">
                    {title}
                  </h3>

                  {/* Responsive badges */}
                  <div className={`flex gap-1.5 ${isMobile ? 'flex-wrap' : ''}`}>
                    <Badge
                      variant="outline"
                      className={`text-xs flex items-center gap-1 ${getStatusColor()}`}
                    >
                      {getStatusIcon()}
                      {status}
                    </Badge>

                    {academic && (
                      <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">
                        academic
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Favorite button (mobile and desktop) */}
                {onFavoriteToggle && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto shrink-0"
                    onClick={handleFavoriteToggle}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'
                        }`}
                    />
                  </Button>
                )}
              </div>

              {/* Enhanced Thumbnail with better aspect ratio handling */}
              {thumbnailUrl && !imageError && (
                <div className="mb-3 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={thumbnailUrl || "/placeholder.svg"}
                    alt={`${title} preview`}
                    className="w-full h-32 sm:h-40 object-cover object-center"
                    loading="lazy"
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                  />
                </div>
              )}

              {/* Fallback for missing/broken images */}
              {(!thumbnailUrl || imageError) && (
                <div className="mb-3 rounded-lg overflow-hidden bg-muted h-32 sm:h-40 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-muted-foreground/10 flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-xs">Project Preview</p>
                  </div>
                </div>
              )}

              {/* Description with expand/collapse */}
              <div className="mb-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {shouldTruncateDescription && !isExpanded
                    ? truncateText(description, maxDescriptionLength)
                    : description
                  }
                </p>

                {shouldTruncateDescription && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto text-xs text-primary hover:text-primary/80 mt-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsExpanded(!isExpanded)
                    }}
                  >
                    {isExpanded ? (
                      <>Show less <ChevronUp className="w-3 h-3 ml-1" /></>
                    ) : (
                      <>Show more <ChevronDown className="w-3 h-3 ml-1" /></>
                    )}
                  </Button>
                )}
              </div>

              {/* Enhanced technology tags with strong brinjal violet glow */}
              <div className="flex flex-wrap gap-1 mb-2">
                {(showAllTech ? technologies : technologies.slice(0, maxVisibleTech)).map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="text-xs text-muted-foreground transition-all duration-300 cursor-default"
                    style={{
                      borderColor: 'rgba(138, 43, 226, 0.4)',
                      transition: 'all 0.3s ease-out, box-shadow 0.3s ease-out'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.8)'
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(138, 43, 226, 0.5), 0 0 25px rgba(138, 43, 226, 0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.4)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    {tech}
                  </Badge>
                ))}

                {shouldTruncateTech && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto text-xs text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowAllTech(!showAllTech)
                    }}
                  >
                    {showAllTech ? 'Show less' : `+${technologies.length - maxVisibleTech} more`}
                  </Button>
                )}
              </div>

              {/* Last updated info */}
              {lastUpdated && (
                <p className="text-xs text-muted-foreground">
                  Updated {lastUpdated}
                </p>
              )}
            </div>
          </div>

          {/* Desktop links with smooth modern hover effects */}
          {!isMobile && (
            <div className="flex flex-col gap-2 text-right shrink-0 ml-4">
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out inline-flex items-center gap-1 group"
                  onMouseEnter={() => setHoveredLink("view")}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  View
                  <ExternalLink className="w-3 h-3 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}

              {documentationLink && (
                <a
                  href={documentationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out inline-flex items-center gap-1 group"
                  onMouseEnter={() => setHoveredLink("docs")}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  Docs
                  <FileText className="w-3 h-3 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}

              {/* Share button for desktop */}
              {(link || documentationLink) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto justify-end hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onShare) {
                      onShare(title, link)
                    } else {
                      shareProject(title, link)
                    }
                  }}
                  aria-label="Share project"
                >
                  <Share2 className="w-3 h-3 hover:text-foreground transition-colors duration-300" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Mobile-specific elements - styled like docs button */}
        {isMobile && (
          <div className="space-y-2">
            {/* Mobile action buttons in horizontal layout */}
            <div className="flex gap-2">
              {link && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(link, '_blank', 'noopener,noreferrer')
                  }}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View
                </Button>
              )}

              {documentationLink && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(documentationLink, '_blank', 'noopener,noreferrer')
                  }}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Docs
                </Button>
              )}

              {(link || documentationLink) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onShare) {
                      onShare(title, link)
                    } else {
                      shareProject(title, link)
                    }
                  }}
                  aria-label="Share project"
                >
                  <Share2 className="w-3 h-3" />
                </Button>
              )}
            </div>

            {/* Mobile hint */}
            {link && (
              <div className="text-xs text-muted-foreground text-center">
                {isPressed ? "Hold to share • " : ""}Tap card to view project
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

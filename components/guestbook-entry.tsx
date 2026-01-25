"use client"

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface GuestbookEntry {
  _id: string
  _creationTime: number
  author_name: string
  message: string
  likes: number
}

interface GuestbookEntryProps {
  entry: GuestbookEntry
  onLike: (entryId: string) => void
  index?: number
}

// Generate consistent gradient from username
const generateGradient = (name: string): string => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  const gradients = [
    'from-violet-600 to-indigo-600',
    'from-purple-600 to-violet-600',
    'from-indigo-600 to-purple-600',
    'from-fuchsia-600 to-purple-600',
    'from-violet-500 to-purple-700',
    'from-purple-500 to-indigo-700',
    'from-indigo-500 to-fuchsia-700',
    'from-fuchsia-500 to-violet-700',
  ]

  return gradients[Math.abs(hash) % gradients.length]
}

// Get initials from name
const getInitials = (name: string): string => {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

// Utility function to format relative time
const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now()
  const diffInMs = now - timestamp
  const diffInSeconds = Math.floor(diffInMs / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInWeeks = Math.floor(diffInDays / 7)
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInDays / 365)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`
  } else if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`
  } else {
    return `${diffInYears}y ago`
  }
}

// Format full date for tooltip
const formatFullDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function GuestbookEntryComponent({ entry, onLike, index = 0 }: GuestbookEntryProps) {
  const [isLiking, setIsLiking] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)
  const [relativeTime, setRelativeTime] = useState('')
  const [showBurst, setShowBurst] = useState(false)

  const gradient = generateGradient(entry.author_name)
  const initials = getInitials(entry.author_name)

  useEffect(() => {
    const likedEntries = JSON.parse(sessionStorage.getItem('guestbook_liked') || '[]')
    setHasLiked(likedEntries.includes(entry._id))
  }, [entry._id])

  useEffect(() => {
    const updateTime = () => {
      setRelativeTime(formatRelativeTime(entry._creationTime))
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [entry._creationTime])

  const handleLike = async () => {
    if (hasLiked || isLiking) return

    setIsLiking(true)
    setShowBurst(true)

    try {
      await onLike(entry._id)

      const likedEntries = JSON.parse(sessionStorage.getItem('guestbook_liked') || '[]')
      const updatedLikedEntries = [...likedEntries, entry._id]
      sessionStorage.setItem('guestbook_liked', JSON.stringify(updatedLikedEntries))

      setHasLiked(true)
    } catch (error) {
      console.error('Error liking entry:', error)
    } finally {
      setIsLiking(false)
      setTimeout(() => setShowBurst(false), 600)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="group relative"
    >
      <div
        className="relative p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 
                   transition-all duration-300 ease-out
                   hover:border-[#8A2BE2]/30 hover:shadow-[0_0_20px_rgba(138,43,226,0.15)]
                   hover:bg-card/80"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Gradient Avatar */}
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} 
                         flex items-center justify-center shrink-0
                         ring-2 ring-white/10 transition-transform duration-300
                         group-hover:scale-105`}
            >
              <span className="text-white text-sm font-semibold">
                {initials}
              </span>
            </div>

            <div className="min-w-0">
              <h4 className="font-medium text-sm text-foreground truncate">
                {entry.author_name}
              </h4>
              <time
                className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors cursor-help"
                title={formatFullDate(entry._creationTime)}
              >
                {relativeTime}
              </time>
            </div>
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={isLiking || hasLiked}
            className={`relative flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium
                       transition-all duration-200 outline-none
                       ${hasLiked
                ? 'bg-red-500/10 text-red-500 cursor-default'
                : 'bg-muted/50 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 cursor-pointer'
              }`}
            aria-label={hasLiked ? 'Liked' : 'Like this message'}
          >
            {/* Heart Icon with Animation */}
            <motion.div
              animate={hasLiked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-all duration-200
                           ${hasLiked ? 'fill-red-500 text-red-500' : ''}
                           ${isLiking ? 'animate-pulse' : ''}`}
              />
            </motion.div>

            {/* Like Count */}
            <AnimatePresence mode="wait">
              <motion.span
                key={entry.likes}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
              >
                {entry.likes}
              </motion.span>
            </AnimatePresence>

            {/* Burst Animation */}
            <AnimatePresence>
              {showBurst && (
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 rounded-full bg-red-500/30 pointer-events-none"
                />
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Message */}
        <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
          <div
            dangerouslySetInnerHTML={{ __html: entry.message }}
            className="prose prose-sm prose-invert max-w-none
                       prose-p:my-1 prose-p:leading-relaxed"
          />
        </div>
      </div>
    </motion.div>
  )
}

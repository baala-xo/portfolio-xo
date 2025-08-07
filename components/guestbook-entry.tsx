"use client"

import { useState, useEffect } from 'react'
import { Heart, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

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
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
  } else if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`
  } else if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`
  } else {
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`
  }
}

export default function GuestbookEntryComponent({ entry, onLike }: GuestbookEntryProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)
  const [relativeTime, setRelativeTime] = useState('')

  useEffect(() => {
    // Check if user has already liked this entry in current session
    const likedEntries = JSON.parse(sessionStorage.getItem('guestbook_liked') || '[]')
    setHasLiked(likedEntries.includes(entry._id))
  }, [entry._id])

  useEffect(() => {
    // Update relative time initially and then every minute
    const updateTime = () => {
      setRelativeTime(formatRelativeTime(entry._creationTime))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [entry._creationTime])

  const handleLike = async () => {
    if (hasLiked || isLiking) return // Prevent multiple likes or clicking while processing
    
    setIsLiking(true)
    try {
      await onLike(entry._id)
      
      // Mark this entry as liked in session storage
      const likedEntries = JSON.parse(sessionStorage.getItem('guestbook_liked') || '[]')
      const updatedLikedEntries = [...likedEntries, entry._id]
      sessionStorage.setItem('guestbook_liked', JSON.stringify(updatedLikedEntries))
      
      setHasLiked(true)
    } catch (error) {
      console.error('Error liking entry:', error)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <Card 
      className="p-4 border-2 border-transparent transition-all duration-300 ease-out"
      style={{
        borderColor: isHovered ? 'rgba(138, 43, 226, 0.3)' : 'transparent',
        boxShadow: isHovered 
          ? '0 0 15px rgba(138, 43, 226, 0.2)' 
          : 'none',
        transition: 'all 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <h4 className="font-medium text-sm">{entry.author_name}</h4>
            <div className="text-xs text-muted-foreground">
              {relativeTime}
            </div>
          </div>
        </div>

        {/* Like Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isLiking || hasLiked}
          className={`flex items-center gap-1 transition-all duration-200 ${
            hasLiked 
              ? 'text-red-500 cursor-default' 
              : 'text-muted-foreground hover:text-red-500 cursor-pointer'
          }`}
          title={hasLiked ? 'You liked this message' : 'Like this message'}
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-200 ${
              hasLiked ? 'fill-red-500 text-red-500' : ''
            } ${isLiking ? 'animate-pulse' : ''}`} 
          />
          <span className="text-xs">{entry.likes}</span>
        </Button>
      </div>

      {/* Message */}
      <div className="text-sm text-muted-foreground leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: entry.message }} />
      </div>
    </Card>
  )
}

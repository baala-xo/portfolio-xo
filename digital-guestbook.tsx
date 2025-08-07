"use client"

import { useState, useEffect } from 'react'
import { BookOpen, Users, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useQuery, useMutation } from "convex/react"
import { api } from "./convex/_generated/api"
import RichTextEditor from './components/rich-text-editor'
import GuestbookEntryComponent from './components/guestbook-entry'

// Updated interface to match your database structure
interface GuestbookEntry {
  _id: string
  _creationTime: number
  author_name: string
  message: string
  likes: number
}

export default function DigitalGuestbook() {
  const [showEditor, setShowEditor] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hasPostedInSession, setHasPostedInSession] = useState(false)
    
  // Convex queries and mutations
  const entries = useQuery(api.guestbook.getEntries) ?? []
  const stats = useQuery(api.guestbook.getStats) ?? { totalEntries: 0, totalLikes: 0 }
  const addEntry = useMutation(api.guestbook.addEntry)
  const likeEntry = useMutation(api.guestbook.likeEntry)
    
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  useEffect(() => {
    const hasPosted = sessionStorage.getItem('guestbook_posted')
    if (hasPosted === 'true') {
      setHasPostedInSession(true)
    }
  }, [])

  const handleSubmit = async (name: string, message: string) => {
    setIsSubmitting(true)
    try {
      await addEntry({ author_name: name, message })
      setShowEditor(false)
      // Mark as posted in this session
      sessionStorage.setItem('guestbook_posted', 'true')
      setHasPostedInSession(true)
    } catch (error) {
      console.error('Error submitting entry:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = async (entryId: string) => {
    try {
      await likeEntry({ id: entryId as any })
    } catch (error) {
      console.error('Error liking entry:', error)
    }
  }

  const isLoading = entries === undefined

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold">Guestbook</h2>
      
      <Card 
        className="w-full border-2 border-transparent transition-all duration-500 ease-out p-6 sm:p-8"
        style={{
          borderColor: isHovered ? 'rgba(138, 43, 226, 0.6)' : 'transparent',
          boxShadow: isHovered 
            ? '0 0 20px rgba(138, 43, 226, 0.4), 0 0 40px rgba(138, 43, 226, 0.2), 0 0 60px rgba(138, 43, 226, 0.1)' 
            : 'none',
          transition: 'all 0.5s ease-out, box-shadow 0.5s ease-out, border-color 0.5s ease-out'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          {/* Description */}
          <div className="mb-8">
            <p className="text-muted-foreground text-sm mb-4">
              Share your thoughts, feedback, or questions about my work. Your message will be visible to other visitors and helps me understand how my projects resonate with people. You can also just like existing messages if you agree with them.
            </p>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{stats.totalEntries} entries</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={14} />
                <span>{stats.totalLikes} likes</span>
              </div>
            </div>
          </div>

          {/* Main Action Button or Already Posted Message */}
          {!showEditor && (
            <div className="mb-8">
              {!hasPostedInSession ? (
                <Button
                  onClick={() => setShowEditor(true)}
                  variant="outline"
                  size="sm"
                  className="transition-all duration-300"
                >
                  <BookOpen className="mr-2" size={16} />
                  Leave a message
                </Button>
              ) : (
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    Thank you for your message! You can leave one message per session, but you can still like other messages. Refresh the page if you'd like to leave another message.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Rich Text Editor */}
          {showEditor && (
            <div className="mb-8 p-6 bg-muted/30 rounded-lg border border-border">
              <h3 className="text-lg font-medium mb-4">Leave a message</h3>
              <RichTextEditor onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                          
              <Button
                variant="ghost"
                onClick={() => setShowEditor(false)}
                className="mt-4 text-muted-foreground hover:text-foreground"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Entries List */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Messages</h3>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">Loading...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="mx-auto mb-4" size={48} />
                <p className="text-base">No messages yet</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {entries.map((entry) => (
                  <GuestbookEntryComponent
                    key={entry._id}
                    entry={entry}
                    onLike={handleLike}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

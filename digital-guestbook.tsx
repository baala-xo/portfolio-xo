"use client"

import { useState, useEffect } from 'react'
import { BookOpen, Users, Heart, ChevronDown, MessageSquare, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useQuery, useMutation } from "convex/react"
import { api } from "./convex/_generated/api"
import RichTextEditor from './components/rich-text-editor'
import GuestbookEntryComponent from './components/guestbook-entry'

interface GuestbookEntry {
  _id: string
  _creationTime: number
  author_name: string
  message: string
  likes: number
}

export default function DigitalGuestbook() {
  const [showEditor, setShowEditor] = useState(false)
  const [hasPostedInSession, setHasPostedInSession] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

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
    <section className="space-y-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Guestbook</h2>
            {/* Stats Pills */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50 text-xs text-muted-foreground">
                <MessageSquare className="w-3 h-3" />
                <span>{stats.totalEntries}</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50 text-xs text-muted-foreground">
                <Heart className="w-3 h-3" />
                <span>{stats.totalLikes}</span>
              </div>
            </div>
          </div>

          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0 hover:bg-muted/50">
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
              <span className="sr-only">Toggle Guestbook</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Glassmorphic Container */}
            <div className="relative rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 sm:p-8
                          shadow-[0_0_0_1px_rgba(138,43,226,0.05)]
                          hover:shadow-[0_0_30px_rgba(138,43,226,0.1)] transition-shadow duration-500">

              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#8A2BE2]/5 via-transparent to-transparent pointer-events-none" />

              <div className="relative space-y-6">
                {/* Description */}
                <p className="text-sm text-muted-foreground">
                  Drop a message, share feedback, or just say hi. Your words stick around for others to see.
                </p>

                {/* Mobile Stats */}
                <div className="flex sm:hidden items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{stats.totalEntries} entries</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{stats.totalLikes} likes</span>
                  </div>
                </div>

                {/* Action Button or Posted Message */}
                <AnimatePresence mode="wait">
                  {!showEditor && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {!hasPostedInSession ? (
                        <Button
                          onClick={() => setShowEditor(true)}
                          className="identity-card-glow group relative px-8 py-2 bg-background border-2 border-transparent 
                                   text-foreground hover:text-white transition-all duration-500"
                        >
                          <span className="relative z-10 font-medium">Leave a message</span>
                        </Button>
                      ) : (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <p className="text-sm text-emerald-600 dark:text-emerald-400">
                            Thanks for your message! You can still like others.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Editor */}
                <AnimatePresence>
                  {showEditor && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-5 rounded-xl bg-muted/30 border border-border/50"
                    >
                      <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#8A2BE2]" />
                        Sign the guestbook
                      </h3>
                      <RichTextEditor onSubmit={handleSubmit} isSubmitting={isSubmitting} />

                      <Button
                        variant="ghost"
                        onClick={() => setShowEditor(false)}
                        className="mt-4 text-muted-foreground hover:text-foreground text-sm"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                {/* Entries */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    Messages
                    <span className="text-xs text-muted-foreground font-normal">({entries.length})</span>
                  </h3>

                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-[#8A2BE2] border-t-transparent rounded-full animate-spin" />
                      <p className="text-muted-foreground text-sm mt-4">Loading messages...</p>
                    </div>
                  ) : entries.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <BookOpen className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-muted-foreground text-sm">No messages yet</p>
                      <p className="text-muted-foreground/70 text-xs mt-1">Be the first to leave one!</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      {entries.map((entry, index) => (
                        <GuestbookEntryComponent
                          key={entry._id}
                          entry={entry}
                          onLike={handleLike}
                          index={index}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  )
}

"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface RichTextEditorProps {
  onSubmit: (name: string, message: string) => Promise<void>
  isSubmitting: boolean
}

const MAX_MESSAGE_LENGTH = 500

export default function RichTextEditor({ onSubmit, isSubmitting }: RichTextEditorProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState<'name' | 'message' | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    await onSubmit(name.trim(), message.trim())
    setName('')
    setMessage('')
  }

  const isValid = name.trim().length > 0 && message.trim().length > 0 && message.length <= MAX_MESSAGE_LENGTH
  const charCount = message.length
  const isOverLimit = charCount > MAX_MESSAGE_LENGTH

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Name</label>
        <div className="relative">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setIsFocused('name')}
            onBlur={() => setIsFocused(null)}
            placeholder="Your name"
            required
            maxLength={50}
            className={`transition-all duration-300 bg-background/50 border-border/50
                       ${isFocused === 'name'
                ? 'border-[#8A2BE2]/50 ring-2 ring-[#8A2BE2]/20'
                : 'hover:border-border'}`}
          />
        </div>
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">Message</label>
          <span className={`text-xs transition-colors ${isOverLimit ? 'text-red-500' : 'text-muted-foreground/50'}`}>
            {charCount}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused('message')}
            onBlur={() => setIsFocused(null)}
            placeholder="Share your thoughts..."
            required
            rows={4}
            className={`transition-all duration-300 bg-background/50 border-border/50 resize-none
                       ${isFocused === 'message'
                ? 'border-[#8A2BE2]/50 ring-2 ring-[#8A2BE2]/20'
                : 'hover:border-border'}
                       ${isOverLimit ? 'border-red-500/50 ring-red-500/20' : ''}`}
          />
        </div>
      </div>

      {/* Submit Button */}
      <motion.div
        whileTap={{ scale: 0.98 }}
      >
        <Button
          type="submit"
          disabled={isSubmitting || !isValid}
          className={`w-full sm:w-auto min-h-[48px] sm:min-h-0 transition-all duration-300
                     ${isValid && !isSubmitting
              ? 'bg-gradient-to-r from-[#8A2BE2] to-[#9932CC] hover:from-[#7B27CC] hover:to-[#8A2BE2] text-white shadow-lg shadow-[#8A2BE2]/20'
              : 'bg-muted text-muted-foreground'}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send message
            </>
          )}
        </Button>
      </motion.div>
    </form>
  )
}

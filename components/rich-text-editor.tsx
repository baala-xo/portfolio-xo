"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Send, User } from 'lucide-react'

interface RichTextEditorProps {
  onSubmit: (name: string, message: string) => Promise<void>
  isSubmitting: boolean
}

export default function RichTextEditor({ onSubmit, isSubmitting }: RichTextEditorProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    
    await onSubmit(name.trim(), message.trim())
    setName('')
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          className="transition-all duration-200 focus:ring-2 focus:ring-[#8A2BE2]/20"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Message</label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message"
          required
          rows={4}
          className="transition-all duration-200 focus:ring-2 focus:ring-[#8A2BE2]/20 resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !name.trim() || !message.trim()}
        size="sm"
      >
        {isSubmitting ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          <Send className="w-4 h-4 mr-2" />
        )}
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}

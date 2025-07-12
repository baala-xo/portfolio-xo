"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterSection() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email)
    setEmail("")
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Stay Updated</h2>
        <p className="text-muted-foreground">Subscribe to my email list. I do not spam, ever.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 max-w-md">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-muted border-0"
          required
        />
        <Button type="submit" className="px-6">
          Subscribe
        </Button>
      </form>
    </section>
  )
}

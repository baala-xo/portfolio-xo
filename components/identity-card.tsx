"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { MapPin, Mail, FileText, Cake } from "lucide-react"
import Image from "next/image"
import { Github, Linkedin } from "lucide-react"
import { DiscordStatus } from "./Status"
import { FaXTwitter } from "react-icons/fa6"

export function IdentityCard() {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {

    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePosition({ x, y })

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    // The `isMobile` check is removed from here.
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)"
    }
  }

  return (
    <div className="relative">
      <Card
        ref={cardRef}
        className={`w-80 h-96 p-6 bg-gradient-to-br from-background via-background to-muted/50 border-2 backdrop-blur-sm transition-all duration-500 ease-out cursor-pointer relative ${
          isHovered ? "identity-card-glow" : "border-border/50"
        }`}
        onMouseMove={handleMouseMove}
        // The `isMobile` check is removed from here.
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Animated background gradient */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
          // This style logic is also simplified to only depend on `isHovered`.
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(138, 43, 226, 0.1) 0%, transparent 50%)`
              : "none",
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Card content remains the same */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
              <Image
                src="/aaron paul.jpeg"
                alt="Sanji 👩‍🦯‍➡️"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/baala-xo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/ba1a_xo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/bala-xo/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Name and title */}
          <div className="space-y-2 mb-6">
            <h3 className="text-xl font-bold">Bala 🧃</h3>
            <p className="text-sm text-muted-foreground">Software Developer</p>
          </div>

          {/* Contact info */}
          <div className="space-y-3 mb-6 flex-1">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">bala2003fd@gmail.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Erode, India</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Cake className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">22 years old</span>
            </div>
            <div className="flex items-center gap-2 pr-4">
              <DiscordStatus />
            </div>
          </div>

          {/* Status */}
        </div>
      </Card>
    </div>
  )
}

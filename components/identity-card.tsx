"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { MapPin, Mail, Globe, FileText, Cake } from "lucide-react" // Added Cake icon
import Image from "next/image"
import { Github, Twitter, Linkedin } from "lucide-react" // Import social icons

export function IdentityCard() {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileGlowActive, setMobileGlowActive] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isMobile) {
      interval = setInterval(() => {
        setMobileGlowActive(true)
        setTimeout(() => {
          setMobileGlowActive(false)
        }, 5000) // Glow for 5 seconds
      }, 10000) // Loop every 10 seconds
    } else if (interval) {
      clearInterval(interval)
      setMobileGlowActive(false)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isMobile])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return // Disable hover effect on mobile

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
    if (cardRef.current && !isMobile) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)"
    }
  }

  return (
    <div className="relative">
      <Card
        ref={cardRef}
        className={`w-80 h-96 p-6 bg-gradient-to-br from-background via-background to-muted/50 border-2 backdrop-blur-sm transition-all duration-500 ease-out cursor-pointer relative overflow-hidden ${
          (isHovered && !isMobile) || mobileGlowActive ? "identity-card-glow" : "border-border/50"
        } ${isMobile ? "mobile-id-card-animation" : ""}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Animated background gradient */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background:
              (isHovered && !isMobile) || mobileGlowActive
                ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(138, 43, 226, 0.1) 0%, transparent 50%)`
                : "none",
            opacity: (isHovered && !isMobile) || mobileGlowActive ? 1 : 0,
          }}
        />

        {/* Card content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
              <Image
                src="/bala.jpeg" // Placeholder: Add your profile photo here (e.g., /profile-photo.jpg)
                alt="Balachandar V"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Social Links in top right corner */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/baala-xo" // Placeholder: Add your GitHub link here
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" /> {/* Reduced size */}
              </a>
              <a
                href="https://x.com/ba1a_xo" // Placeholder: Add your Twitter link here
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" /> {/* Reduced size */}
              </a>
              <a
                href="https://www.linkedin.com/in/bala-xo/" // Placeholder: Add your LinkedIn link here
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" /> {/* Reduced size */}
              </a>
            </div>
          </div>

          {/* Name and title */}
          <div className="space-y-2 mb-6">
            <h3 className="text-xl font-bold">Balachandar V</h3>
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
            
            {/* Age */}
            <div className="flex items-center gap-3 text-sm">
              <Cake className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">22 years old</span>
            </div>
            {/* Resume Link */}
            <div className="flex items-center gap-3 text-sm">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <a
                href="https://drive.google.com/file/d/12860tAGwngghkNMEoOjVq3bf5joYHKSO/view?usp=drive_link" // Placeholder: Add your Google Drive link for resume
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Resume
              </a>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Available for opportunities</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

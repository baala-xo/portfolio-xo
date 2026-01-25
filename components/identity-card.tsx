"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { MapPin, Mail, FileText, Cake } from "lucide-react"
import Image from "next/image"
import { Github, Linkedin } from "lucide-react"
import { DiscordStatus } from "./Status"
import { FaXTwitter } from "react-icons/fa6"
import { FaInstagram } from 'react-icons/fa';


export function IdentityCard() {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable physics on mobile
    if (isMobile || !cardRef.current) return

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
    if (!isMobile && cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)"
    }
  }

  return (
    <div className="relative">
      <Card
        ref={cardRef}
        className={`w-[calc(100vw-3rem)] max-w-80 h-auto min-h-[24rem] p-5 md:p-6 bg-gradient-to-br from-background via-background to-muted/50 md:border-2 border border-border/50 backdrop-blur-sm transition-all duration-500 ease-out cursor-pointer relative ${isMobile || isHovered ? "identity-card-glow" : ""
          }`}
        onMouseMove={isMobile ? undefined : handleMouseMove}
        onMouseEnter={isMobile ? undefined : () => setIsHovered(true)}
        onMouseLeave={isMobile ? undefined : handleMouseLeave}
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
                src="/bala.jpeg"
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
              {/* <a
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
              </a> */}
              <a
                href="https://www.instagram.com/bala.abq/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Name and title */}
          <div className="space-y-2 mb-6">
            <h3 className="text-xl font-bold">Bala 🩵</h3>
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
            <DiscordStatus />
          </div>

          {/* Status */}
        </div>
      </Card>
    </div>
  )
}

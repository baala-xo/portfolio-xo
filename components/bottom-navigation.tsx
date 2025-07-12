"use client"

import { useState, useEffect } from "react"
import { Home, FolderOpen, GraduationCap, User, Github, Twitter, Linkedin } from "lucide-react" // Import Twitter icon

const navItems = [
  { href: "#home", label: "Home", icon: Home },
  { href: "#projects", label: "Projects", icon: FolderOpen },
  { href: "#education", label: "Education", icon: GraduationCap },
  { href: "#about", label: "About", icon: User },
]

const socialLinks = [
  { href: "https://github.com/baala-xo", icon: Github, label: "GitHub" },
  { href: "https://x.com/ba1a_xo", icon: Twitter, label: "Twitter" }, // Re-added Twitter
  { href: "https://www.linkedin.com/in/bala-xo/", icon: Linkedin, label: "LinkedIn" },
]

export function BottomNavigation() {
  const [activeSection, setActiveSection] = useState("home")
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.href.substring(1))
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`glassmorphic-nav rounded-full transition-all duration-500 ease-out overflow-hidden ${
          isHovered && !isMobile ? "navbar-expanded" : "navbar-collapsed"
        }`}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        <div className="flex items-center">
          {/* Main Navigation */}
          <div className="flex items-center space-x-8 px-6 py-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.href.substring(1)

              return (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className={`flex flex-col items-center space-y-1 transition-all duration-300 ${
                    isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                  {isActive && <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />}
                </button>
              )
            })}
          </div>

          {/* Separator and Social Links - Expandable section */}
          <div
            className={`flex items-center transition-all duration-500 ease-out ${
              isHovered && !isMobile ? "max-w-xs opacity-100" : "max-w-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="w-px h-8 bg-border mx-4 flex-shrink-0" />
            <div className="flex items-center space-x-4 px-2 whitespace-nowrap">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors p-2 flex-shrink-0"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { Home, FolderOpen, GraduationCap, User, Github, Twitter, Linkedin, Menu, X } from "lucide-react"

const navItems = [
  { href: "#home", label: "Home", icon: Home },
  { href: "#projects", label: "Projects", icon: FolderOpen },
  { href: "#education", label: "Education", icon: GraduationCap },
  { href: "#about", label: "About", icon: User },
]

const socialLinks = [
  { href: "https://github.com/baala-xo", icon: Github, label: "GitHub" },
  { href: "https://x.com/ba1a_xo", icon: Twitter, label: "Twitter" },
  { href: "https://www.linkedin.com/in/bala-xo/", icon: Linkedin, label: "LinkedIn" },
]

export function BottomNavigation() {
  const [activeSection, setActiveSection] = useState("home")
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Throttle scroll handler for better performance
  const handleScroll = useCallback(() => {
    let currentSection = "home"
    const scrollPosition = window.scrollY + 100

    for (const item of navItems) {
      const section = item.href.substring(1)
      const element = document.getElementById(section)
      if (element) {
        const { offsetTop, offsetHeight } = element
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          currentSection = section
          break
        }
      }
    }

    setActiveSection(currentSection)
  }, [])

  useEffect(() => {
    setMounted(true)
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    
    // Use passive scroll listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setMenuOpen(false)
    }
  }

  if (!mounted) {
    return null
  }

  // Mobile menu toggle
  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-max">
        <div
          className={`glassmorphic-nav rounded-full transition-all duration-500 ease-out overflow-hidden ${
            isHovered ? "navbar-expanded" : "navbar-collapsed"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center">
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
                    aria-label={item.label}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                    {isActive && <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />}
                  </button>
                )
              })}
            </div>

            {/* Social Links Section */}
            <div
              className={`flex items-center transition-all duration-500 ease-out ${
                isHovered ? "max-w-xs opacity-100" : "max-w-0 opacity-0 overflow-hidden"
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

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-t border-border">
        {/* Mobile Menu Button */}
        <div className="flex justify-center items-center p-2">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full bg-primary/10 text-primary"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Expanded Mobile Menu */}
        {menuOpen && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-2 gap-2 p-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.href.substring(1)
                return (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className={`flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors ${
                      isActive ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                )
              })}
            </div>
            
            {/* Mobile Social Links */}
            <div className="flex justify-center space-x-6 p-4 border-t border-border">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors p-2"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {/* Default Mobile Bottom Bar */}
        {!menuOpen && (
          <div className="flex justify-around items-center p-2">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.href.substring(1)
              return (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className={`p-2 rounded-full transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              )
            })}
          </div>
        )}
      </nav>
    </>
  )
}
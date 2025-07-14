"use client"

import { useState, useEffect, useCallback } from "react"
import { Home, FolderOpen, GraduationCap, User, Github, Twitter, Linkedin, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FaXTwitter } from "react-icons/fa6";

const navItems = [
  { href: "#home", label: "Home", icon: Home },
  { href: "#projects", label: "Projects", icon: FolderOpen },
  { href: "#education", label: "Education", icon: GraduationCap },
  { href: "#about", label: "About", icon: User },
]

const socialLinks = [
  { href: "https://github.com/baala-xo", icon: Github, label: "GitHub" },
  { href: "https://x.com/ba1a_xo", icon: FaXTwitter, label: "Twitter" },
  { href: "https://www.linkedin.com/in/bala-xo/", icon: Linkedin, label: "LinkedIn" },
]

export function BottomNavigation() {
  const [activeSection, setActiveSection] = useState("home")
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-max">
        <motion.div
          className={`relative bg-black/20 backdrop-blur-xl rounded-full border border-gray-800/50 shadow-xl transition-all duration-500 ease-out overflow-hidden ${
            isHovered ? "px-6" : "px-4"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 25,
            duration: 0.6,
          }}
        >
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/10 via-gray-700/20 to-gray-800/10 rounded-full" />

          <div className="relative flex items-center">
            <div className="flex items-center space-x-6 py-3">
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = activeSection === item.href.substring(1)
                return (
                  <motion.button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className={`relative flex flex-col items-center space-y-1 transition-all duration-300 group ${
                      isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
                    }`}
                    aria-label={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                    whileHover={{
                      scale: 1.05,
                      transition: { type: "spring", stiffness: 400, damping: 15 },
                    }}
                    whileTap={{
                      scale: 0.98,
                      transition: { type: "spring", stiffness: 400, damping: 15 },
                    }}
                  >
                    {/* Hover effect - only show when not active */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gray-800/20 backdrop-blur-lg rounded-xl border border-gray-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    )}

                    <div className="relative z-10 flex flex-col items-center space-y-1 px-2 py-1">
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          className="w-1 h-1 bg-white rounded-full"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                            delay: 0.1,
                          }}
                        />
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Social Links Section */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="flex items-center"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <div className="w-px h-6 bg-gray-700/50 mx-4 flex-shrink-0" />
                  <motion.div
                    className="flex items-center space-x-3 px-2"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -10, opacity: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon
                      return (
                        <motion.a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative text-gray-400 hover:text-gray-200 transition-colors duration-200 p-1.5 rounded-lg group"
                          aria-label={social.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.2 + index * 0.05,
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                          whileHover={{
                            scale: 1.1,
                            transition: { type: "spring", stiffness: 400, damping: 15 },
                          }}
                          whileTap={{
                            scale: 0.95,
                            transition: { type: "spring", stiffness: 400, damping: 15 },
                          }}
                        >
                          <div className="absolute inset-0 bg-gray-800/20 backdrop-blur-lg rounded-lg border border-gray-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          <Icon className="w-3.5 h-3.5 relative z-10" />
                        </motion.a>
                      )
                    })}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="relative bg-black/20 backdrop-blur-xl border-t border-gray-800/50 shadow-xl">
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 via-gray-800/20 to-gray-700/10" />

          {/* Mobile Menu Button */}
          <div className="relative flex justify-center items-center p-3">
            <motion.button
              onClick={toggleMenu}
              className="relative p-2.5 rounded-xl bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 text-gray-300 shadow-lg"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              whileTap={{
                scale: 0.95,
                transition: { type: "spring", stiffness: 400, damping: 15 },
              }}
              whileHover={{
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 15 },
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-gray-800/10 rounded-xl" />
              <motion.div
                animate={{ rotate: menuOpen ? 180 : 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
              >
                {menuOpen ? <X className="w-4 h-4 relative z-10" /> : <Menu className="w-4 h-4 relative z-10" />}
              </motion.div>
            </motion.button>
          </div>

          {/* Expanded Mobile Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-lg" />

                <div className="relative grid grid-cols-2 gap-2.5 p-4">
                  {navItems.map((item, index) => {
                    const Icon = item.icon
                    const isActive = activeSection === item.href.substring(1)
                    return (
                      <motion.button
                        key={item.href}
                        onClick={() => scrollToSection(item.href)}
                        className={`relative flex items-center justify-center space-x-2.5 p-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 text-white shadow-lg"
                            : "bg-gray-800/20 backdrop-blur-lg border border-gray-700/30 text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
                        }`}
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                        whileHover={{
                          scale: 1.01,
                          transition: { type: "spring", stiffness: 400, damping: 15 },
                        }}
                        whileTap={{
                          scale: 0.99,
                          transition: { type: "spring", stiffness: 400, damping: 15 },
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700/10 to-gray-800/5 rounded-xl" />
                        <Icon className="w-4 h-4 relative z-10" />
                        <span className="text-sm font-medium relative z-10">{item.label}</span>
                        {isActive && (
                          <motion.div
                            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full shadow-lg"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                              delay: 0.1,
                            }}
                          />
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Mobile Social Links */}
                <motion.div
                  className="relative flex justify-center space-x-4 p-4 border-t border-gray-800/50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <div className="absolute inset-0 bg-gray-900/5 backdrop-blur-lg" />
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative text-gray-400 hover:text-gray-200 transition-colors duration-200 p-2.5 rounded-xl bg-gray-800/20 backdrop-blur-lg border border-gray-700/30 hover:bg-gray-800/30"
                        aria-label={social.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.4 + index * 0.05,
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                        whileHover={{
                          y: -1,
                          scale: 1.05,
                          transition: { type: "spring", stiffness: 400, damping: 15 },
                        }}
                        whileTap={{
                          scale: 0.95,
                          transition: { type: "spring", stiffness: 400, damping: 15 },
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-gray-800/5 rounded-xl" />
                        <Icon className="w-4 h-4 relative z-10" />
                      </motion.a>
                    )
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Default Mobile Bottom Bar */}
          {!menuOpen && (
            <motion.div
              className="relative flex justify-around items-center p-2"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 120,
                damping: 25,
              }}
            >
              <div className="absolute inset-0 bg-gray-900/5 backdrop-blur-lg" />
              {navItems.slice(0, 4).map((item, index) => {
                const Icon = item.icon
                const isActive = activeSection === item.href.substring(1)
                return (
                  <motion.button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className={`relative p-3 rounded-xl transition-all duration-200 ${
                      isActive ? "text-white" : "text-gray-400"
                    }`}
                    aria-label={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                    whileTap={{
                      scale: 0.95,
                      transition: { type: "spring", stiffness: 400, damping: 15 },
                    }}
                  >
                    <Icon className="w-4 h-4 relative z-10" />
                    {isActive && (
                      <motion.div
                        className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-lg"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                          delay: 0.05,
                        }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </motion.div>
          )}
        </div>
      </nav>
    </>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { motion, useAnimationControls, animate, useMotionValue, PanInfo } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  SiJavascript, SiTypescript, SiPython,
  SiReact, SiNextdotjs, SiFastapi,
  SiSupabase, SiFigma, SiVercel, SiGithub,
  SiSanity, SiCloudflare
} from "react-icons/si"
import { Database, Layout, Globe, Server, Code, Lock } from "lucide-react"

// Custom Icon Components for those not in Simple Icons or needing specific styling
const ConvexIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M12 2L2 19h20L12 2zm0 3.5L18.5 17h-13L12 5.5z" />
  </svg>
)

const ShadcnIcon = () => (
  <svg viewBox="0 0 256 256" className="w-3.5 h-3.5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="208" y1="128" x2="128" y2="208" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="192" y1="40" x2="40" y2="192" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Categorized skills with their respective categories and icons
const skillsData = [
  // Languages
  { name: "JavaScript", category: "Languages", icon: SiJavascript },
  { name: "TypeScript", category: "Languages", icon: SiTypescript },
  { name: "Python", category: "Languages", icon: SiPython },

  // Frameworks
  { name: "React", category: "Frameworks", icon: SiReact },
  { name: "Next.js", category: "Frameworks", icon: SiNextdotjs },
  { name: "FastAPI", category: "Frameworks", icon: SiFastapi },

  // Tools & Services
  { name: "Supabase", category: "Tools & Services", icon: SiSupabase },
  { name: "Figma", category: "Tools & Services", icon: SiFigma },
  { name: "Vercel", category: "Tools & Services", icon: SiVercel },
  { name: "GitHub", category: "Tools & Services", icon: SiGithub },
  { name: "Convex", category: "Tools & Services", icon: ConvexIcon },
  { name: "Sanity", category: "Tools & Services", icon: SiSanity },
  { name: "ShadCN", category: "Tools & Services", icon: ShadcnIcon },
  { name: "Wasabi", category: "Tools & Services", icon: Database },
  { name: "Coolify", category: "Tools & Services", icon: Server },
  { name: "Claude Code", category: "Tools & Services", icon: Code },
  { name: "Resend", category: "Tools & Services", icon: Globe },
  { name: "Better Auth", category: "Tools & Services", icon: Lock },
  { name: "Cloudflare", category: "Tools & Services", icon: SiCloudflare },
]

interface SkillsSectionProps {
  isHonest?: boolean
}

interface MarqueeProps {
  items: typeof skillsData
  speed?: number
  direction?: "left" | "right"
}

function Marquee({ items, speed = 30, direction = "left" }: MarqueeProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const controls = useAnimationControls()
  const isDragging = useRef(false)

  // Create a quadruple set of items for absolutely seamless looping
  const duplicatedItems = [...items, ...items, ...items, ...items]

  useEffect(() => {
    startAnimation()
  }, [speed, direction])

  const startAnimation = () => {
    if (isDragging.current) return

    const contentWidth = (containerRef.current?.scrollWidth || 0) / 4
    if (!contentWidth) return

    controls.start({
      x: direction === "left" ? -contentWidth : 0,
      transition: {
        duration: contentWidth / speed,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        from: direction === "left" ? 0 : -contentWidth
      },
    })
  }

  const handleDragStart = () => {
    isDragging.current = true
    controls.stop()
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    isDragging.current = false
    startAnimation()
  }

  return (
    <div className="relative overflow-hidden py-2 w-full">
      {/* Gradient Masks for Fade Edge Effect */}
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <motion.div
        drag="x"
        dragConstraints={{ left: -1000, right: 1000 }}
        style={{ x }}
        animate={controls}
        ref={containerRef}
        className="flex gap-2.5 cursor-grab active:cursor-grabbing w-fit touch-pan-x"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {duplicatedItems.map((skill, index) => {
          const isHovered = hoveredSkill === `${skill.name}-${index}`
          const Icon = skill.icon

          return (
            <div
              key={`${skill.name}-${index}`}
              className={`
                relative group flex items-center gap-2 px-3.5 py-1.5 
                rounded-lg border border-neutral-800/50 bg-neutral-900/50 backdrop-blur-sm 
                transition-all duration-300
                hover:border-neutral-700 hover:bg-neutral-800/80
                ${isHovered ? 'shadow-[0_0_15px_rgba(255,255,255,0.03)]' : ''}
              `}
              onMouseEnter={() => setHoveredSkill(`${skill.name}-${index}`)}
              onMouseLeave={() => setHoveredSkill(null)}
              onTouchStart={() => setHoveredSkill(`${skill.name}-${index}`)}
              onTouchEnd={() => setTimeout(() => setHoveredSkill(null), 300)}
            >
              <div className="text-base text-neutral-400 group-hover:text-neutral-200 transition-colors">
                <Icon />
              </div>
              <span className={`text-xs font-medium tracking-wide text-neutral-400 group-hover:text-neutral-200 transition-colors whitespace-nowrap`}>
                {skill.name}
              </span>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}

export function SkillsSection({ isHonest = false }: SkillsSectionProps) {
  const isMobile = useIsMobile()
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  // Split skills into two rows for mobile
  const midPoint = Math.ceil(skillsData.length / 2)
  const row1 = skillsData.slice(0, midPoint)
  const row2 = skillsData.slice(midPoint)

  return (
    <section id="skills" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Skills & Stack</h2>
      </div>

      {isMobile ? (
        <div className="space-y-3 -mx-6">
          <Marquee items={row1} speed={25} direction="left" />
          <Marquee items={row2} speed={20} direction="right" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {skillsData.map((skill) => {
            const isHovered = hoveredSkill === skill.name
            const Icon = skill.icon

            return (
              <Badge
                key={skill.name}
                variant="outline"
                className={`
                   px-3 py-1.5 text-xs font-medium transition-all duration-300 ease-out cursor-default
                   border-neutral-800/50 bg-neutral-900/50 text-neutral-400
                   hover:border-neutral-700 hover:bg-neutral-800/80 hover:text-neutral-200
                   flex items-center gap-2 rounded-lg
                 `}
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{skill.name}</span>
              </Badge>
            )
          })}
        </div>
      )}
    </section>
  )
}

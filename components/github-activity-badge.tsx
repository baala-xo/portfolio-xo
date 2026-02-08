"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { FaGithub } from "react-icons/fa"

import { cn } from "@/lib/utils"

type ContributionDay = {
  date: string
  contributionCount: number
  color: string
}

type ActivityPayload = {
  username: string
  total: number
  currentStreak: number
  longestStreak: number
  bestDay: number
  days: ContributionDay[]
  weeks: { contributionDays: ContributionDay[] }[]
  updatedAt: string
}

export function GithubActivityBadge({ username }: { username: string }) {
  const [payload, setPayload] = useState<ActivityPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    setIsLoading(true)
    fetch(`/api/github-activity?username=${encodeURIComponent(username)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return
        if (data?.error) {
          setError(data.error)
          setPayload(null)
        } else {
          setPayload(data)
          setError(null)
        }
      })
      .catch(() => {
        if (!mounted) return
        setError("Failed to load GitHub activity")
        setPayload(null)
      })
      .finally(() => {
        if (!mounted) return
        setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [username])

  const [visibleWeeks, setVisibleWeeks] = useState(52)

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return
    const update = () => {
      const width = containerRef.current?.clientWidth ?? 0
      const cellSize = window.innerWidth < 640 ? 6 : 8
      const gap = 2
      const columnWidth = cellSize + gap
      const weeksThatFit = Math.max(20, Math.floor((width - 16) / columnWidth))
      setVisibleWeeks(weeksThatFit)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(containerRef.current)
    window.addEventListener("resize", update)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [])

  const weeks = useMemo(() => {
    const allWeeks = payload?.weeks ?? []
    if (allWeeks.length <= visibleWeeks) return allWeeks
    return allWeeks.slice(allWeeks.length - visibleWeeks)
  }, [payload, visibleWeeks])
  const maxCount = useMemo(() => {
    if (!payload?.days?.length) return 0
    return payload.days.reduce((max, day) => Math.max(max, day.contributionCount), 0)
  }, [payload])

  const getDarkColor = (count: number) => {
    if (count === 0) return "#161b22"
    if (!maxCount) return "#0e4429"
    const level = Math.ceil((count / maxCount) * 4)
    const palette = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"]
    return palette[Math.min(Math.max(level, 1), 4)]
  }

  return (
    <div
      ref={containerRef}
      className="rounded-2xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/50 p-4 text-foreground shadow-[0_0_25px_rgba(0,0,0,0.45)] overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FaGithub className="h-4 w-4 text-muted-foreground" />
          <div>
            <span className="block text-sm font-semibold text-muted-foreground">GitHub activity</span>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noreferrer"
              className="block text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              @{username}
            </a>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{payload?.total ?? "--"} contributions</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span>{payload?.currentStreak ?? "--"} current</span>
        <span>·</span>
        <span>{payload?.longestStreak ?? "--"} longest</span>
        <span>·</span>
        <span>{payload?.bestDay ?? "--"} best day</span>
      </div>

      <div className="mt-3">
        <div className="flex gap-[2px]">
          {weeks.map((week, weekIndex) => (
            <div key={`week-${weekIndex}`} className="flex flex-col gap-[2px]">
              {week.contributionDays.map((day) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="h-1.5 w-1.5 rounded-[2px] sm:h-2 sm:w-2"
                  title={`${day.date}: ${day.contributionCount} contributions`}
                  style={{
                    backgroundColor: getDarkColor(day.contributionCount),
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Each green square is a day with commits. Darker means busier.
      </p>

      {isLoading && (
        <p className="mt-2 text-xs text-[#8b949e]">Loading GitHub activity...</p>
      )}
      {!isLoading && error && (
        <p className="mt-2 text-xs text-[#ff7b72]">
          {error} — add `GITHUB_TOKEN` in `.env.local`.
        </p>
      )}
    </div>
  )
}

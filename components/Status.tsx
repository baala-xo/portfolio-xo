"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { FaSpotify } from "react-icons/fa"
import { Terminal, Activity, Zap } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// TypeScript interfaces for better type safety
interface SpotifyData {
  song: string
  artist: string
  album: string
  album_art_url: string
}

interface LanyardData {
  listening_to_spotify: boolean
  spotify?: SpotifyData
  discord_status: "online" | "idle" | "dnd" | "offline"
  discord_user: {
    username: string
    avatar: string
  }
}

interface LanyardResponse {
  success: boolean
  data: LanyardData
}

const fetcherWithDelay = async (url: string): Promise<LanyardResponse> => {
  // Simulate realistic network delay (1-3 seconds)
  const delay = Math.random() * 2000 + 1000
  await new Promise((resolve) => setTimeout(resolve, delay))

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  return response.json()
}

export function DiscordStatus() {
  const DISCORD_ID = process.env.NEXT_PUBLIC_DISCORD_ID || "572378005138046977"

  const [isVisible, setIsVisible] = useState(false)
  const [hasInitialLoad, setHasInitialLoad] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const [loadingStage, setLoadingStage] = useState<"connecting" | "discord" | "spotify" | "complete">("connecting")
  const [retryCount, setRetryCount] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data, error, isLoading, mutate } = useSWR<LanyardResponse>(
    DISCORD_ID ? `https://api.lanyard.rest/v1/users/${DISCORD_ID}` : null,
    fetcherWithDelay,
    {
      refreshInterval: 10000, // Changed to 10 seconds for faster updates
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onLoadingSlow: () => {
        console.log("[v0] Loading is taking longer than expected...")
      },
      onSuccess: (data) => {
        setLastRefresh(new Date())
        setRetryCount(0)
        setIsRefreshing(false)
        setLoadingStage("discord")
        setTimeout(() => {
          if (data.data.listening_to_spotify) {
            setLoadingStage("spotify")
            setTimeout(() => setLoadingStage("complete"), 800)
          } else {
            setLoadingStage("complete")
          }
        }, 600)
      },
      onError: (error) => {
        setRetryCount((prev) => prev + 1)
        setIsRefreshing(false)
        console.log("[v0] Error fetching Discord status:", error)
      },
    },
  )

  useEffect(() => {
    if (data && !hasInitialLoad) {
      setHasInitialLoad(true)
      setTimeout(() => setIsVisible(true), 200)
    }
  }, [data, hasInitialLoad])

  useEffect(() => {
    const interval = setInterval(() => {
      if (data && !isLoading) {
        setIsRefreshing(true)
        mutate()
      }
    }, 10000) // Changed to 10 seconds for faster updates

    return () => clearInterval(interval)
  }, [data, isLoading, mutate])

  // Don't render if no Discord ID is provided
  if (!DISCORD_ID) {
    console.warn("NEXT_PUBLIC_DISCORD_ID environment variable is not set")
    return null
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 text-sm opacity-60">
        <Terminal className="w-4 h-4 text-red-500/70" />
        <div className="font-mono text-[10px] tracking-tighter uppercase text-red-500/70">
          ERR: DISCONNECT_{retryCount}/3
        </div>
      </div>
    )
  }

  if ((isLoading && !data) || !hasInitialLoad || (loadingStage !== "complete" && !data)) {
    return (
      <div className="flex items-center gap-3 text-sm h-[32px]">
        <Terminal className="w-4 h-4 text-muted-foreground/40" />
        <div className="font-mono text-[10px] tracking-tighter uppercase text-muted-foreground/40">
          SYNCING<span className="animate-pulse">_</span>
        </div>
      </div>
    )
  }

  if (!data || !data.data) return null
  const statusData = data.data

  // Get status color based on Discord status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-emerald-400"
      case "idle":
        return "text-amber-400"
      case "dnd":
        return "text-rose-400"
      case "offline":
        return "text-muted-foreground/40"
      default:
        return "text-muted-foreground/40"
    }
  }

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-emerald-500"
      case "idle":
        return "bg-amber-500"
      case "dnd":
        return "bg-rose-500"
      case "offline":
        return "bg-muted-foreground/40"
      default:
        return "bg-muted-foreground/40"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online"
      case "idle":
        return "Idle"
      case "dnd":
        return "Do Not Disturb"
      case "offline":
        return "Offline"
      default:
        return "Unknown"
    }
  }

  const getRefreshTimeText = () => {
    if (!lastRefresh) return "Not refreshed yet"
    const now = new Date()
    const diffMs = now.getTime() - lastRefresh.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)

    if (diffSeconds < 60) return `${diffSeconds}s ago`
    const diffMinutes = Math.floor(diffSeconds / 60)
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    const diffHours = Math.floor(diffMinutes / 60)
    return `${diffHours}h ago`
  }

  const getTooltipContent = (isSpotify = false) => (
    <div className="font-mono text-[10px] space-y-1 p-1 uppercase tracking-tight">
      <div className="flex items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-emerald-500" />
        <span className="text-muted-foreground/60">SOURCE:</span>
        <span>LANYARD_API_V1</span>
      </div>
      <div className="flex items-center gap-2">
        <Activity className="w-3 h-3 text-muted-foreground/60" />
        <span className="text-muted-foreground/60">REFRESH_INT:</span>
        <span>10S</span>
      </div>
      <div className="text-muted-foreground/40 mt-2 pt-1 border-t border-border/10">
        LAST_SYNC: {getRefreshTimeText()}
      </div>
      {isRefreshing && (
        <div className="text-emerald-400/60 animate-pulse mt-1">
          {">> "}RE-SYNCING...
        </div>
      )}
    </div>
  )

  if (statusData.listening_to_spotify && statusData.spotify) {
    return (
      <TooltipProvider>
        <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "flex items-center gap-3 transition-all duration-700 ease-out cursor-help group",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
              )}
              onClick={() => setIsTooltipOpen(!isTooltipOpen)}
            >
              <Terminal className="w-4 h-4 text-muted-foreground shrink-0" />

              <div className="flex flex-col min-w-0 font-mono tracking-tighter">
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="text-muted-foreground/60 uppercase">STATUS:</span>
                  <span className="text-emerald-400/80 uppercase">LIVE</span>
                  <div className="relative flex h-1.5 w-1.5 ml-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] leading-none mt-0.5 w-full">
                  <span className="text-muted-foreground/40 uppercase shrink-0">PLAYING:</span>
                  <div className="flex items-center gap-1.5 truncate min-w-0 flex-1">
                    <FaSpotify className="w-3 h-3 text-emerald-500/60 shrink-0" />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors truncate">
                      {statusData.spotify.song}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={12}
            className="bg-background/95 border-border/50 backdrop-blur-md z-[9999]"
            avoidCollisions={true}
            collisionPadding={16}
            onClick={(e) => e.stopPropagation()}
          >
            {getTooltipContent(true)}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-3 transition-all duration-700 ease-out cursor-help group text-sm",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
            )}
            onClick={() => setIsTooltipOpen(!isTooltipOpen)}
          >
            <Terminal className="w-4 h-4 text-muted-foreground shrink-0" />

            <div className="flex flex-col font-mono tracking-tighter">
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-muted-foreground/60 uppercase">STATUS:</span>
                <span className={cn("uppercase", getStatusColor(statusData.discord_status))}>
                  {getStatusText(statusData.discord_status)}
                </span>
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full ml-0.5",
                  getStatusDotColor(statusData.discord_status),
                  statusData.discord_status === "online" && "animate-pulse"
                )} />
              </div>
              {statusData.discord_user.username && (
                <div className="text-[10px] text-muted-foreground/30 uppercase mt-0.5">
                  ID: {statusData.discord_user.username}
                </div>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={12}
          className="bg-background/95 border-border/50 backdrop-blur-md z-[9999]"
          avoidCollisions={true}
          collisionPadding={16}
          onClick={(e) => e.stopPropagation()}
        >
          {getTooltipContent(false)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

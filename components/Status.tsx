"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { FaSpotify } from "react-icons/fa"
import { Badge } from "@/components/ui/badge"
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
      errorRetryInterval: (retryCount) => Math.min(1000 * Math.pow(2, retryCount), 10000),
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
      <div className="flex items-center gap-2 opacity-60">
        <Badge variant="destructive" className="text-xs animate-pulse">
          {retryCount > 0 ? `Retrying... (${retryCount}/3)` : "Connection Failed"}
        </Badge>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors duration-300",
                i < retryCount ? "bg-red-400" : "bg-gray-300",
              )}
            />
          ))}
        </div>
      </div>
    )
  }

  if (isLoading || !data || !data.data || !hasInitialLoad || loadingStage !== "complete") {
    const getLoadingText = () => {
      switch (loadingStage) {
        case "connecting":
          return "Connecting to Discord..."
        case "discord":
          return "Loading Discord status..."
        case "spotify":
          return "Checking Spotify activity..."
        default:
          return "Fetching status..."
      }
    }

    return (
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            <span className="animate-pulse">{getLoadingText()}</span>
          </div>
        </Badge>

        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-500",
                loadingStage === "connecting"
                  ? "bg-blue-400 animate-bounce"
                  : loadingStage === "discord" && i <= 1
                    ? "bg-green-400 animate-pulse"
                    : loadingStage === "spotify" && i <= 2
                      ? "bg-green-400 animate-pulse"
                      : "bg-gray-300",
              )}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  const statusData = data.data

  // Get status color based on Discord status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "dnd":
        return "bg-red-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-400"
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
    <div className="text-xs space-y-1.5">
      <div className="font-medium">Data Source: Lanyard API</div>
      <div className="text-muted-foreground">Last updated: {getRefreshTimeText()}</div> 
      {isRefreshing && (
        <div className="text-blue-400 flex items-center gap-1">
          <div className="w-2 h-2 border border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          Refreshing...
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
                "flex items-center gap-3 transition-all duration-700 ease-out cursor-help",
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-95",
              )}
              onClick={() => setIsTooltipOpen(!isTooltipOpen)}
            >
              <Badge className="text-xs bg-green-500/10 text-green-600 border-green-500/20 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <div className="relative">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-green-500 animate-ping opacity-40" />
                  </div>
                  Live
                  {isRefreshing && (
                    <div className="w-2 h-2 border border-green-600/30 border-t-green-600 rounded-full animate-spin ml-1" />
                  )}
                </div>
              </Badge>

              <div className="flex items-center gap-2 group">
                <div className="relative">
                  <FaSpotify className="w-4 h-4 text-green-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <div className="absolute -inset-1 bg-green-500/20 rounded-full animate-ping opacity-75" />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-green-600 font-medium">Listening to Spotify</span>
                  <div className="text-xs text-muted-foreground truncate max-w-[200px] transition-all duration-300">
                    <span className="font-medium">{statusData.spotify.song}</span>
                    <span className="mx-1">•</span>
                    <span>{statusData.spotify.artist}</span>
                  </div>
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            sideOffset={8}
            className="max-w-xs z-[9999]"
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
              "flex items-center gap-3 transition-all duration-700 ease-out cursor-help",
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-95",
            )}
            onClick={() => setIsTooltipOpen(!isTooltipOpen)}
          >
            <Badge className="text-xs bg-slate-500/10 text-slate-600 border-slate-500/20 shadow-sm">
              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
                  <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse opacity-30" />
                </div>
                Status
                {isRefreshing && (
                  <div className="w-2 h-2 border border-slate-600/30 border-t-slate-600 rounded-full animate-spin ml-1" />
                )}
              </div>
            </Badge>

            <div className="flex items-center gap-2 group">
              <div className="relative">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-500",
                    getStatusColor(statusData.discord_status),
                    statusData.discord_status === "online" && "animate-pulse",
                  )}
                />
                {statusData.discord_status === "online" && (
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-30" />
                )}
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  {getStatusText(statusData.discord_status)}
                </span>
                {statusData.discord_user.username && (
                  <span className="text-xs text-muted-foreground/70 transition-colors duration-300 group-hover:text-muted-foreground">
                    @{statusData.discord_user.username}
                  </span>
                )}
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          sideOffset={8}
          className="max-w-xs z-[9999]"
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

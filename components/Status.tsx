"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { FaSpotify } from "react-icons/fa"
import { Badge } from "@/components/ui/badge"
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

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function DiscordStatus() {
  // Get Discord ID from environment variables
  const DISCORD_ID = process.env.NEXT_PUBLIC_DISCORD_ID

  const [isVisible, setIsVisible] = useState(false)
  const [hasInitialLoad, setHasInitialLoad] = useState(false)

  // Don't render if no Discord ID is provided
  if (!DISCORD_ID) {
    console.warn("NEXT_PUBLIC_DISCORD_ID environment variable is not set")
    return null
  }

  const { data, error, isLoading } = useSWR<LanyardResponse>(
    `https://api.lanyard.rest/v1/users/${DISCORD_ID}`,
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    },
  )

  // Handle initial load animation
  useEffect(() => {
    if (data && !hasInitialLoad) {
      setHasInitialLoad(true)
      // Small delay to ensure smooth transition
      setTimeout(() => setIsVisible(true), 100)
    }
  }, [data, hasInitialLoad])

  // Error state with retry option
  if (error) {
    return (
      <div className="flex items-center gap-2 opacity-60">
        <Badge variant="destructive" className="text-xs">
          Status Unavailable
        </Badge>
        <div className="w-2 h-2 rounded-full bg-gray-400" />
      </div>
    )
  }

  // Loading state with pulsing animation
  if (isLoading || !data || !hasInitialLoad) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20 animate-pulse">
          Fetching status from discord
        </Badge>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1 h-1 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1 h-1 rounded-full bg-blue-400 animate-bounce" />
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

  // Spotify listening state
  if (statusData.listening_to_spotify && statusData.spotify) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 transition-all duration-500 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        )}
      >
        <Badge className="text-xs bg-green-500/10 text-green-600 border-green-500/20 shadow-sm">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </div>
        </Badge>

        <div className="flex items-center gap-2 group">
          <div className="relative">
            <FaSpotify className="w-4 h-4 text-green-500 transition-transform group-hover:scale-110" />
            <div className="absolute -inset-1 bg-green-500/20 rounded-full animate-ping opacity-75" />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-xs text-green-600 font-medium">Listening to Spotify</span>
            <div className="text-xs text-muted-foreground truncate max-w-[200px] group-hover:max-w-none transition-all duration-300">
              <span className="font-medium">{statusData.spotify.song}</span>
              <span className="mx-1">•</span>
              <span>{statusData.spotify.artist}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default status state
  return (
    <div
      className={cn(
        "flex items-center gap-3 transition-all duration-500 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      )}
    >
      <Badge className="text-xs bg-slate-500/10 text-slate-600 border-slate-500/20 shadow-sm">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
          Status
        </div>
      </Badge>

      <div className="flex items-center gap-2 group">
        <div className="relative">
          <div
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              getStatusColor(statusData.discord_status),
              statusData.discord_status === "online" && "animate-pulse",
            )}
          />
          {statusData.discord_status === "online" && (
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-30" />
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">{getStatusText(statusData.discord_status)}</span>
          {statusData.discord_user.username && (
            <span className="text-xs text-muted-foreground/70">@{statusData.discord_user.username}</span>
          )}
        </div>
      </div>
    </div>
  )
}

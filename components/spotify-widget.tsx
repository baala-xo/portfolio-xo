"use client"

import { useEffect, useState } from "react"
import { Music, ExternalLink } from "lucide-react"

export function SpotifyWidget() {
    const [isPlaying, setIsPlaying] = useState(true) // Mock state

    // This would normally connect to a real API
    // For now, we mock a "Recently Played" or a default "Vibe"

    return (
        <div className="fixed bottom-24 right-6 z-40 hidden md:block">
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full pr-4 pl-2 py-2 shadow-xl hover:bg-black/60 transition-all duration-300 hover:scale-105 group cursor-pointer">
                <div className="relative w-10 h-10 flex items-center justify-center bg-[#1DB954] rounded-full shrink-0">
                    <Music size={20} className="text-black fill-black" />
                    {isPlaying && (
                        <div className="absolute inset-0 rounded-full animate-ping bg-[#1DB954] opacity-20" />
                    )}
                </div>

                <div className="flex flex-col max-w-[140px]">
                    <span className="text-[10px] uppercase font-bold text-[#1DB954] tracking-wider mb-0.5">
                        On Repeat
                    </span>
                    <div className="overflow-hidden">
                        <div className="flex animate-marquee whitespace-nowrap group-hover:paused">
                            <span className="text-xs font-medium text-white truncate">
                                Midnight City - M83
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

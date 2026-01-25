"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, VolumeX, Headphones, Music2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [showPrompt, setShowPrompt] = useState(true)
    const [isExpanded, setIsExpanded] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)

    // Start playing (muted) on mount to respect browser auto-play policies
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.4
            const playPromise = audioRef.current.play()
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true)
                    })
                    .catch((error) => {
                        console.log("Autoplay prevented:", error)
                        setIsPlaying(false)
                    })
            }
        }
    }, [])

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (audioRef.current) {
            audioRef.current.muted = !isMuted
            setIsMuted(!isMuted)
            if (isMuted && !isPlaying) {
                audioRef.current.play()
                setIsPlaying(true)
            }
        }
    }

    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex flex-col items-end gap-2 md:gap-3">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin-continuous {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-continuous 10s linear infinite;
                }
            `}} />

            {/* Headset Prompt */}
            <AnimatePresence>
                {showPrompt && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-2xl mb-1 md:mb-0"
                    >
                        <Headphones className="w-4 h-4 text-purple-400" />
                        <span className="text-[11px] font-medium text-white/90 tracking-wide whitespace-nowrap">
                            Wear headsets for better experience
                        </span>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowPrompt(false);
                            }}
                            className="ml-1 p-1 text-white/40 hover:text-white/100 transition-colors flex items-center justify-center cursor-pointer"
                        >
                            <span className="text-lg leading-none">×</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Invisible expanded hit area - hover for desktop, click for mobile */}
            <div
                className="group/music-trigger p-8 md:p-12 -m-8 md:-m-12 relative"
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
            >
                <motion.div
                    layout
                    transition={{
                        layout: {
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1]
                        },
                        width: {
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1]
                        }
                    }}
                    onClick={toggleExpand}
                    className={cn(
                        "flex items-center gap-2 md:gap-3 bg-black/60 md:bg-black/40 backdrop-blur-xl border border-white/10 md:border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.4)] md:shadow-2xl hover:bg-black/70 md:hover:bg-black/60 transition-all duration-700 cursor-pointer pointer-events-auto ring-1 ring-white/5",
                        isExpanded ? "rounded-full p-1.5 pr-3 md:p-2 md:pr-5" : "rounded-full p-1.5 md:p-2 md:pr-2"
                    )}
                >
                    {/* Spinning Cover Image */}
                    <div className="relative w-8 h-8 md:w-12 md:h-12 flex-shrink-0">
                        <div className="w-full h-full rounded-full overflow-hidden border border-white/10 shadow-inner animate-spin-slow">
                            <Image
                                src="/ -4.jpg"
                                alt="Timeless Cover"
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Record center hole aesthetic */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black rounded-full border border-white/20 shadow-lg" />
                        </div>
                    </div>

                    {/* Track Info & Mute Button - Only visible when expanded */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, width: 0, height: 0, x: -10 }}
                                animate={{ opacity: 1, width: "auto", height: "auto", x: 0 }}
                                exit={{ opacity: 0, width: 0, height: 0, x: -10 }}
                                transition={{
                                    duration: 0.8,
                                    ease: [0.22, 1, 0.36, 1],
                                    opacity: { duration: 0.4 }
                                }}
                                className="flex items-center gap-2 md:gap-4 overflow-hidden"
                            >
                                <div className="flex flex-col justify-center min-w-[80px] md:min-w-[120px] max-w-[100px] md:max-w-none">
                                    <span className="text-[8px] md:text-[9px] uppercase font-bold text-purple-400 tracking-[0.2em] mb-0 md:mb-0.5 opacity-80 leading-none">
                                        Playing Now
                                    </span>
                                    <div className="relative overflow-hidden h-3.5 md:h-4 w-full flex items-center">
                                        <span className="text-[10px] md:text-xs font-semibold text-white/90 truncate w-full block">
                                            Timeless (Instrumental) — The Weeknd
                                        </span>
                                    </div>
                                </div>

                                {/* Mute Button - Touch friendly */}
                                <button
                                    onClick={toggleMute}
                                    className="p-1.5 md:p-2.5 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 transition-colors border border-white/5 min-w-[28px] md:min-w-[44px] min-h-[28px] md:min-h-[44px] flex items-center justify-center"
                                >
                                    {isMuted ? (
                                        <VolumeX className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/60" />
                                    ) : (
                                        <Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-400 animate-pulse" />
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            <audio
                ref={audioRef}
                src="/Timeless (Instrumental).mp3"
                loop
                muted={isMuted}
            />
        </div >
    )
}


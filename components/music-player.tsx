"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, VolumeX, Headphones, Laptop2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [showNowPlayingNotice, setShowNowPlayingNotice] = useState(true)
    const [showMobileNotice, setShowMobileNotice] = useState(true)
    const [autoplayBlocked, setAutoplayBlocked] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [playerOffset, setPlayerOffset] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
    const convolverRef = useRef<ConvolverNode | null>(null)
    const dismissThreshold = 80
    const wheelDismissThreshold = 120
    const nowPlayingWheelRef = useRef(0)
    const mobileWheelRef = useRef(0)
    const noticeExitDelayMs = 280

    const createRoomImpulse = (ctx: AudioContext, duration = 0.7, decay = 2.2) => {
        const sampleRate = ctx.sampleRate
        const length = Math.floor(sampleRate * duration)
        const impulse = ctx.createBuffer(2, length, sampleRate)

        for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
            const data = impulse.getChannelData(channel)
            for (let i = 0; i < length; i += 1) {
                const fade = Math.pow(1 - i / length, decay)
                data[i] = (Math.random() * 2 - 1) * fade
            }
        }

        return impulse
    }

    const setupRoomReverb = () => {
        const audio = audioRef.current
        if (!audio) return

        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext()
        }

        if (sourceRef.current) return

        const ctx = audioContextRef.current
        const source = ctx.createMediaElementSource(audio)
        sourceRef.current = source

        const convolver = ctx.createConvolver()
        convolver.buffer = createRoomImpulse(ctx)
        convolverRef.current = convolver

        const wetGain = ctx.createGain()
        wetGain.gain.value = 0.22

        const dryGain = ctx.createGain()
        dryGain.gain.value = 0.9

        source.connect(dryGain)
        source.connect(convolver)
        convolver.connect(wetGain)

        dryGain.connect(ctx.destination)
        wetGain.connect(ctx.destination)
    }

    const attemptPlay = async () => {
        const audio = audioRef.current
        if (!audio) return

        setupRoomReverb()

        try {
            if (audioContextRef.current?.state === "suspended") {
                await audioContextRef.current.resume()
            }
        } catch {
            // Ignore resume errors; autoplay policies may block until user gesture.
        }

        try {
            audio.loop = true
            await audio.play()
            setIsPlaying(true)
            setAutoplayBlocked(false)
        } catch (error) {
            console.log("Autoplay prevented:", error)
            setIsPlaying(false)
            setAutoplayBlocked(true)
        }
    }

    // Try to start playing with echo on mount (may be blocked by browser policies).
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.4
            audioRef.current.muted = false
            audioRef.current.loop = true
            setIsMuted(false)
            attemptPlay()
        }
    }, [])

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const handleEnded = () => {
            if (audio.loop) return
            audio.currentTime = 0
            audio.play().catch(() => undefined)
        }

        audio.addEventListener("ended", handleEnded)
        return () => {
            audio.removeEventListener("ended", handleEnded)
        }
    }, [])

    // If autoplay is blocked, retry on first user interaction.
    useEffect(() => {
        if (!autoplayBlocked) return

        const unlock = () => {
            attemptPlay()
        }

        window.addEventListener("pointerdown", unlock, { once: true })
        window.addEventListener("keydown", unlock, { once: true })

        return () => {
            window.removeEventListener("pointerdown", unlock)
            window.removeEventListener("keydown", unlock)
        }
    }, [autoplayBlocked])

    useEffect(() => {
        const media = window.matchMedia("(max-width: 767px)")
        const update = () => setIsMobile(media.matches)
        update()
        if (media.addEventListener) {
            media.addEventListener("change", update)
            return () => media.removeEventListener("change", update)
        }
        media.addListener(update)
        return () => media.removeListener(update)
    }, [])

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (audioRef.current) {
            const nextMuted = !isMuted
            audioRef.current.muted = nextMuted
            setIsMuted(nextMuted)
            if (!nextMuted && !isPlaying) {
                attemptPlay()
            }
        }
    }

    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    const noticesVisible = showNowPlayingNotice || (showMobileNotice && isMobile)

    useEffect(() => {
        if (noticesVisible) {
            setPlayerOffset(96)
            return
        }
        const timer = window.setTimeout(() => {
            setPlayerOffset(0)
        }, noticeExitDelayMs)
        return () => window.clearTimeout(timer)
    }, [noticesVisible])

    const handleSwipeDismiss = (setVisible: (value: boolean) => void) => (_: unknown, info: { offset: { x: number }, velocity: { x: number } }) => {
        if (info.offset.x > dismissThreshold || info.velocity.x > 600) {
            setVisible(false)
        }
    }

    const handleWheelDismiss = (accumulator: React.MutableRefObject<number>, setVisible: (value: boolean) => void) => (event: React.WheelEvent) => {
        if (event.deltaX <= 0) return
        accumulator.current += event.deltaX
        if (accumulator.current > wheelDismissThreshold) {
            setVisible(false)
            accumulator.current = 0
        }
    }

    return (
        <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
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

            <div className="absolute top-0 right-0 flex flex-col items-end gap-2 md:gap-3 pointer-events-none">
                {/* Headset Notice */}
                <AnimatePresence>
                    {showNowPlayingNotice && (
                        <motion.div
                            initial={{ opacity: 0, x: 60, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 80, scale: 0.95 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 160 }}
                            dragElastic={0.2}
                            onDragEnd={handleSwipeDismiss(setShowNowPlayingNotice)}
                            onWheel={handleWheelDismiss(nowPlayingWheelRef, setShowNowPlayingNotice)}
                            onPointerDown={(event) => event.stopPropagation()}
                            className="relative z-20 bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-start gap-3 shadow-2xl w-[min(260px,calc(100vw-2rem))] pointer-events-auto"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 min-w-0">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <Headphones className="w-4 h-4 text-purple-400" />
                                            <span className="text-[11px] font-medium text-white/90 tracking-wide truncate">
                                                Wear headsets for better experience
                                            </span>
                                        </div>
                                        {autoplayBlocked && (
                                            <div className="text-[10px] text-white/60 mt-1">
                                                Tap anywhere to start sound
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setShowNowPlayingNotice(false)
                                        }}
                                        className="p-1 text-white/40 hover:text-white/90 transition-colors flex items-center justify-center cursor-pointer flex-shrink-0"
                                        aria-label="Dismiss now playing notice"
                                    >
                                        <span className="text-lg leading-none">×</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Notice */}
                <AnimatePresence>
                    {showMobileNotice && (
                        <motion.div
                            initial={{ opacity: 0, x: 60, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 80, scale: 0.95 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 160 }}
                            dragElastic={0.2}
                            onDragEnd={handleSwipeDismiss(setShowMobileNotice)}
                            onWheel={handleWheelDismiss(mobileWheelRef, setShowMobileNotice)}
                            onPointerDown={(event) => event.stopPropagation()}
                            className="relative z-20 md:hidden bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-2xl w-[min(260px,calc(100vw-2rem))] pointer-events-auto"
                        >
                            <Laptop2 className="w-4 h-4 text-purple-400" />
                            <span className="text-[11px] font-medium text-white/90 tracking-wide truncate">
                                This site looks cooler on laptops
                            </span>
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setShowMobileNotice(false)
                                }}
                                className="ml-1 p-1 text-white/40 hover:text-white/90 transition-colors flex items-center justify-center cursor-pointer flex-shrink-0"
                                aria-label="Dismiss mobile notice"
                            >
                                <span className="text-lg leading-none">×</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Invisible expanded hit area - hover for desktop, click for mobile */}
            <div
                style={{ transform: `translateY(${playerOffset}px)` }}
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

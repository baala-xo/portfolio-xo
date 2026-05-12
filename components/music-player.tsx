"use client"

import { useEffect, useRef, useState } from "react"
import { SongPlayer } from "@/components/atomixui/song-player"

type Track = {
  videoId: string
  title: string
  artist: string
  thumbnail: string
  /** Optional cold-start seconds for first-time listeners (returning visitors resume from saved). */
  defaultStart?: number
  /** Hex color that drives portfolio-wide accent theming while this track plays. */
  accent?: string
  /** Beat-synced moments. When playback crosses `at` (in seconds), a
   *  `music:moment` event fires with the given effect name. */
  moments?: { at: number; effect: string }[]
}

const TRACKS: Track[] = [
  {
    videoId: "vxiMTwG0vWI",
    title: "Timeless",
    artist: "The Weeknd",
    thumbnail: "/products/timeless-cover.jpg",
    defaultStart: 98, // drop into the hook
    accent: "#e11d48", // deep rose — Weeknd noir
  },
  {
    videoId: "TTAQt94pXZY",
    title: "10,000 Aura",
    artist: "Sai Abhyankkar",
    thumbnail: "/products/aura-cover.jpg",
    accent: "#f59e0b", // amber — Aura warmth
    moments: [{ at: 21, effect: "dude-hand" }],
  },
]

const DEFAULT_ACCENT = "#8a2be2"

const INTENT_KEY = "xo:music:intent"
const VOLUME_KEY = "xo:music:volume"
const TRACK_INDEX_KEY = "xo:music:track-index"
const positionKeyFor = (videoId: string) => `xo:music:position:${videoId}`

const readNumber = (key: string, fallback: number): number => {
  if (typeof window === "undefined") return fallback
  const raw = window.localStorage.getItem(key)
  if (raw === null) return fallback
  const n = parseFloat(raw)
  return Number.isFinite(n) ? n : fallback
}

const readString = (key: string): string | null => {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(key)
}

const writeStorage = (key: string, value: string) => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // ignore — private mode, quota exceeded, etc.
  }
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: (() => void) | undefined
  }
}

const resolveInitialIndex = (): number => {
  if (typeof window === "undefined") return 0
  const raw = window.localStorage.getItem(TRACK_INDEX_KEY)
  if (raw === null) return 0
  const n = parseInt(raw, 10)
  if (!Number.isFinite(n) || n < 0 || n >= TRACKS.length) return 0
  return n
}

export function MusicPlayer() {
  const playerRef = useRef<any>(null)
  const pendingPlayRef = useRef(false)
  const hostWrapperRef = useRef<HTMLDivElement | null>(null)
  const currentIndexRef = useRef<number>(resolveInitialIndex())
  // The very first time the track-switch effect runs after YT becomes ready,
  // skip — the YT constructor already loaded the right video at the right
  // resume-position. Only respond to subsequent index changes (explicit skips).
  const skipNextSwitchRef = useRef<boolean>(true)

  const [currentIndex, setCurrentIndex] = useState<number>(currentIndexRef.current)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(50)
  const [isReady, setIsReady] = useState(false)

  const track = TRACKS[currentIndex]

  // Keep the ref in sync so the YT onStateChange callback can read the latest
  // index without re-creating the player on every change.
  useEffect(() => {
    currentIndexRef.current = currentIndex
    writeStorage(TRACK_INDEX_KEY, String(currentIndex))
  }, [currentIndex])

  // Push the current track's accent color into the document root (so CSS
  // selectors can react via `var(--accent)`) and broadcast it as an event
  // so React components can opt in via the useMusicAccent hook.
  useEffect(() => {
    if (typeof window === "undefined") return
    const accent = track.accent ?? DEFAULT_ACCENT
    document.documentElement.style.setProperty("--accent", accent)
    window.dispatchEvent(
      new CustomEvent("music:accent-changed", { detail: { accent } }),
    )
  }, [track.accent])

  // Hydrate volume + current-time from localStorage on mount so the UI
  // doesn't flash defaults before the player reports its real state.
  useEffect(() => {
    const savedVol = readNumber(VOLUME_KEY, 50)
    setVolume(Math.max(0, Math.min(100, savedVol)))
    const savedPos = readNumber(
      positionKeyFor(track.videoId),
      track.defaultStart ?? 0,
    )
    if (savedPos > 0) setCurrentTime(savedPos)
    // run once on mount — track may be different on re-renders but we only
    // care about the initial hydrate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Bootstrap YouTube IFrame API once and create the player
  useEffect(() => {
    let mounted = true

    const initPlayer = () => {
      if (!mounted || !window.YT?.Player) return
      const wrapper = hostWrapperRef.current
      if (!wrapper) return

      // React-owned wrapper, transient host for YT to replace with its iframe.
      const host = document.createElement("div")
      wrapper.appendChild(host)

      const startTrack = TRACKS[currentIndexRef.current]
      const savedPos = readNumber(
        positionKeyFor(startTrack.videoId),
        startTrack.defaultStart ?? 0,
      )
      const savedVol = Math.max(0, Math.min(100, readNumber(VOLUME_KEY, 50)))
      const intent = readString(INTENT_KEY)

      try {
        playerRef.current = new window.YT.Player(host, {
          videoId: startTrack.videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
            disablekb: 1,
            iv_load_policy: 3,
            playsinline: 1,
            rel: 0,
            start: Math.max(0, Math.floor(savedPos)),
          },
          events: {
            onReady: (e: any) => {
              if (!mounted) return
              try {
                e.target.setVolume(savedVol)
                const dur = e.target.getDuration()
                if (dur > 0) setDuration(dur)
                setIsReady(true)
                if (intent === "play" || pendingPlayRef.current) {
                  pendingPlayRef.current = false
                  e.target.playVideo()
                }
              } catch {
                // ignore
              }
            },
            onStateChange: (e: any) => {
              if (!mounted) return
              const YT = window.YT
              const playing = e.data === YT.PlayerState.PLAYING
              setIsPlaying(playing)
              if (playing) {
                const dur = e.target.getDuration()
                if (dur > 0) setDuration(dur)
              }
              if (e.data === YT.PlayerState.ENDED) {
                const nextIndex = (currentIndexRef.current + 1) % TRACKS.length
                setCurrentIndex(nextIndex)
              }
            },
          },
        })
      } catch (err) {
        console.warn("YT player init failed:", err)
      }
    }

    if (typeof window === "undefined") return

    if (window.YT?.Player) {
      initPlayer()
    } else {
      const previousCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.()
        initPlayer()
      }
      if (!document.querySelector('script[data-yt-api="true"]')) {
        const tag = document.createElement("script")
        tag.src = "https://www.youtube.com/iframe_api"
        tag.dataset.ytApi = "true"
        document.head.appendChild(tag)
      }
    }

    return () => {
      mounted = false
      try {
        playerRef.current?.destroy?.()
      } catch {
        // ignore
      }
      const wrapper = hostWrapperRef.current
      if (wrapper) {
        while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild)
      }
    }
  }, [])

  // When the track index changes (auto-advance, next/prev, or pill tap), load
  // the new video. Explicit switches always start fresh from the track's
  // defaultStart (or 0) — they do NOT resume from a saved listen position.
  // Saved positions are only honored on full page reload, via the YT
  // constructor's playerVars.start above.
  useEffect(() => {
    if (!isReady) return
    if (skipNextSwitchRef.current) {
      skipNextSwitchRef.current = false
      return
    }
    const yt = playerRef.current
    if (!yt?.loadVideoById) return
    const next = TRACKS[currentIndex]
    const startAt = next.defaultStart ?? 0
    try {
      yt.loadVideoById({
        videoId: next.videoId,
        startSeconds: Math.max(0, Math.floor(startAt)),
      })
      setCurrentTime(startAt)
    } catch {
      // ignore
    }
  }, [currentIndex, isReady])

  // Listen for an explicit play signal from the intro popup ("play" button).
  useEffect(() => {
    const handler = () => {
      const yt = playerRef.current
      if (yt?.playVideo) {
        try {
          yt.playVideo()
        } catch {
          // ignore
        }
      } else {
        pendingPlayRef.current = true
      }
    }
    window.addEventListener("music:play", handler)
    return () => window.removeEventListener("music:play", handler)
  }, [])

  // Poll currentTime while playing for the progress bar
  useEffect(() => {
    if (!isPlaying) return
    const interval = window.setInterval(() => {
      const t = playerRef.current?.getCurrentTime?.()
      if (typeof t === "number") setCurrentTime(t)
    }, 250)
    return () => window.clearInterval(interval)
  }, [isPlaying])

  // Beat-synced moment detection — runs a rAF loop while playing so we can
  // fire effects within ~16ms of the target second instead of the 250ms grace
  // of the progress poller. Tracks fired moments per loop and resets when the
  // video loops back to the start.
  useEffect(() => {
    if (!isPlaying) return
    const moments = TRACKS[currentIndex].moments
    if (!moments?.length) return

    const fired = new Set<number>()
    let prevTime = 0
    let raf = 0

    const loop = () => {
      const yt = playerRef.current
      if (yt?.getCurrentTime) {
        const t = yt.getCurrentTime()
        // Detect loop wrap (time jumped backwards by more than 1s)
        if (t < prevTime - 1) fired.clear()
        prevTime = t

        moments.forEach((m, idx) => {
          if (!fired.has(idx) && t >= m.at && t < m.at + 1) {
            fired.add(idx)
            window.dispatchEvent(
              new CustomEvent("music:moment", { detail: { effect: m.effect } }),
            )
          }
        })
      }
      raf = window.requestAnimationFrame(loop)
    }
    raf = window.requestAnimationFrame(loop)

    return () => window.cancelAnimationFrame(raf)
  }, [isPlaying, currentIndex])

  // Persist playback position every 3s while playing, and on page hide/unload.
  // The key is namespaced to whichever video is currently loaded.
  useEffect(() => {
    const savePosition = () => {
      const t = playerRef.current?.getCurrentTime?.()
      if (typeof t === "number" && t > 0) {
        const activeTrack = TRACKS[currentIndexRef.current]
        writeStorage(
          positionKeyFor(activeTrack.videoId),
          String(Math.floor(t)),
        )
      }
    }

    const interval = isPlaying ? window.setInterval(savePosition, 3000) : null
    const onHide = () => savePosition()

    window.addEventListener("beforeunload", onHide)
    document.addEventListener("visibilitychange", onHide)

    return () => {
      if (interval) window.clearInterval(interval)
      window.removeEventListener("beforeunload", onHide)
      document.removeEventListener("visibilitychange", onHide)
    }
  }, [isPlaying])

  // Persist volume whenever it changes
  useEffect(() => {
    writeStorage(VOLUME_KEY, String(volume))
  }, [volume])

  const togglePlay = () => {
    if (!playerRef.current) return
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
    } catch {
      // ignore
    }
  }

  const seekTo = (time: number) => {
    const safeTime = Math.max(0, time)
    try {
      playerRef.current?.seekTo?.(safeTime, true)
      setCurrentTime(safeTime)
    } catch {
      // ignore
    }
  }

  // Track skip — wrap around at the edges so the queue feels infinite.
  const nextTrack = () => {
    setCurrentIndex((idx) => (idx + 1) % TRACKS.length)
  }
  const prevTrack = () => {
    setCurrentIndex((idx) => (idx - 1 + TRACKS.length) % TRACKS.length)
  }
  const selectTrack = (index: number) => {
    if (index < 0 || index >= TRACKS.length) return
    setCurrentIndex(index)
  }

  const handleVolume = (v: number) => {
    setVolume(v)
    try {
      playerRef.current?.setVolume?.(v)
    } catch {
      // ignore
    }
  }

  return (
    <>
      {/* Hidden audio source — React owns the wrapper, YT injects an iframe inside */}
      <div
        ref={hostWrapperRef}
        aria-hidden="true"
        className="fixed pointer-events-none opacity-0"
        style={{ width: 1, height: 1, top: -10, left: -10 }}
      />

      {/* Top-center notch — pinned to viewport */}
      <div
        className="fixed top-0 left-0 right-0 z-[100]"
        style={{ height: 0 }}
      >
        <SongPlayer
          title={track.title}
          artist={track.artist}
          thumbnail={track.thumbnail}
          isPlaying={isPlaying}
          videoId={isReady ? track.videoId : null}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          togglePlay={togglePlay}
          seekForward={nextTrack}
          seekBackward={prevTrack}
          seekTo={seekTo}
          setVolume={handleVolume}
          tracks={TRACKS.map((t) => ({
            videoId: t.videoId,
            title: t.title,
            thumbnail: t.thumbnail,
          }))}
          currentTrackIndex={currentIndex}
          onSelectTrack={selectTrack}
        />
      </div>
    </>
  )
}

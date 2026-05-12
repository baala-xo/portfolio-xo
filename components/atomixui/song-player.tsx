'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

type TrackPill = {
    videoId: string;
    title: string;
    thumbnail: string;
};

interface NotchProps {
    title: string;
    artist: string;
    thumbnail: string;
    isPlaying: boolean;
    videoId: string | null;
    currentTime: number;
    duration: number;
    volume: number;
    togglePlay: () => void;
    seekForward: () => void;
    seekBackward: () => void;
    seekTo: (time: number) => void;
    setVolume: (volume: number) => void;
    /** When provided, render a column of track pills to the right of the notch
     *  while expanded. seekForward / seekBackward become next-/prev-track. */
    tracks?: TrackPill[];
    currentTrackIndex?: number;
    onSelectTrack?: (index: number) => void;
}

const Wave = ({ color, isPlaying, onClick }: { color: string; isPlaying: boolean; onClick: () => void }) => (
    <div
        className="flex items-center gap-[2px] h-5 shrink-0"
        onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        role="button"
    >
        {[0, 1, 2, 3].map((i) => (
            <div
                key={i}
                className="rounded-sm"
                style={{
                    backgroundColor: color,
                    // Width forced via inline style — Tailwind's default scale
                    // does not include 0.75, so `w-0.75` silently emitted no CSS
                    // and the bars rendered at zero width.
                    width: 3,
                    // Paused bars need a visible idle height; the animation
                    // overrides this when running.
                    height: isPlaying ? undefined : 10,
                    animation: isPlaying ? `waveAnim${i} 1s ease-in-out infinite` : 'none',
                    animationDelay: `${i * 0.2}s`,
                }}
            />
        ))}
        <style>{`
            @keyframes waveAnim0 {
                0%, 100% { height: 6px; }
                25% { height: 18px; }
                50% { height: 10px; }
                75% { height: 14px; }
            }
            @keyframes waveAnim1 {
                0%, 100% { height: 16px; }
                25% { height: 10px; }
                50% { height: 14px; }
                75% { height: 6px; }
            }
            @keyframes waveAnim2 {
                0%, 100% { height: 10px; }
                25% { height: 14px; }
                50% { height: 6px; }
                75% { height: 18px; }
            }
            @keyframes waveAnim3 {
                0%, 100% { height: 14px; }
                25% { height: 6px; }
                50% { height: 18px; }
                75% { height: 10px; }
            }
        `}</style>
    </div>
);

const SongPlayer = ({
    title,
    artist,
    thumbnail,
    isPlaying,
    videoId,
    currentTime,
    duration,
    volume,
    togglePlay,
    seekForward,
    seekBackward,
    seekTo,
    setVolume,
    tracks,
    currentTrackIndex,
    onSelectTrack,
}: NotchProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDraggingVolume, setIsDraggingVolume] = useState(false);
    const notchRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (notchRef.current && !notchRef.current.contains(e.target as Node)) {
                setIsExpanded(false);
            }
        };
        if (isExpanded) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isExpanded]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingVolume) return;
            const slider = document.getElementById('volume-slider');
            if (slider) {
                const rect = slider.getBoundingClientRect();
                const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                setVolume(percentage * 100);
            }
        };
        const handleMouseUp = () => setIsDraggingVolume(false);
        if (isDraggingVolume) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingVolume, setVolume]);

    const hasVideo = !!videoId;
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    const remainingTime = Math.max(0, duration - currentTime);

    return (
        <div
            ref={notchRef}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-[9999] -translate-y-12 lg:-translate-y-10 overflow-visible"
        >
            <div className="relative">
                <svg
                    className="absolute -top-12 left-1/2 -translate-x-1/2 w-160 pointer-events-none"
                    style={{ filter: 'blur(0.5px)' }}
                >
                    <defs>
                        <filter id="gooey" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                            <feColorMatrix
                                in="blur"
                                mode="matrix"
                                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
                                result="goo"
                            />
                            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                        </filter>
                    </defs>
                </svg>

                <div className="relative" style={{ filter: 'url(#gooey)' }}>
                    <motion.div
                        className="relative bg-black"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        animate={{
                            width: isHovered && !isExpanded ? 250 : isExpanded ? 380 : 150,
                            height: isExpanded ? 220 : 80,
                        }}
                        onHoverStart={() => setIsHovered(true)}
                        onHoverEnd={() => setIsHovered(false)}
                        style={{ borderRadius: '0 0 10px 10px' }}
                    >
                        <div
                            className="absolute -left-6 -top-8 w-12 h-20 bg-black"
                            style={{ borderRadius: '0 24px 0 0' }}
                        />
                        <div
                            className="absolute -right-6 -top-8 w-12 h-20 bg-black"
                            style={{ borderRadius: '24px 0 0 0' }}
                        />
                        <div
                            className="absolute -top-10 left-1/2 -translate-x-1/2 w-[90%] h-16 bg-black"
                            style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}
                        />
                        <div className="absolute -left-2 -top-6 w-8 h-12 bg-black" style={{ borderRadius: '50%' }} />
                        <div className="absolute -right-2 -top-6 w-8 h-12 bg-black" style={{ borderRadius: '50%' }} />

                        <div
                            onClick={() => setIsExpanded(true)}
                            className={cn('relative z-10 h-full px-3 py-2 flex items-center gap-3 select-none group', {
                                'cursor-pointer': !isExpanded,
                            })}
                        >
                            {isExpanded ? (
                                <div className="flex-1 min-w-0 flex flex-col justify-center mt-10">
                                    <div className="flex gap-4 mb-3">
                                        <motion.div
                                            layoutId="imagecover"
                                            className="shrink-0 bg-cover bg-center"
                                            style={{
                                                width: 100,
                                                height: 100,
                                                borderRadius: 8,
                                                backgroundImage: `url(${thumbnail})`,
                                                willChange: 'transform',
                                            }}
                                            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.2 } }}
                                            exit={{ opacity: 0 }}
                                            className="flex-1 flex flex-col justify-center min-w-0"
                                        >
                                            <div className="text-white text-base font-semibold mb-1 flex items-center gap-2 truncate">
                                                {title}
                                                {isPlaying && (
                                                    <div className="flex gap-0.5 items-center shrink-0">
                                                        <div className="wave-bar w-0.5 h-2 bg-white rounded-sm" />
                                                        <div className="wave-bar w-0.5 h-3 bg-white rounded-sm" />
                                                        <div className="wave-bar w-0.5 h-2 bg-white rounded-sm" />
                                                        <div className="wave-bar w-0.5 h-2.5 bg-white rounded-sm" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-gray-400 text-sm mb-2 truncate">{artist}</div>
                                            <div className="mb-1">
                                                <div
                                                    className="w-full h-1 bg-white/15 rounded-full mb-1 relative overflow-hidden cursor-pointer"
                                                    onClick={(e) => {
                                                        if (!duration) return;
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const clickX = e.clientX - rect.left;
                                                        const percentage = clickX / rect.width;
                                                        const newTime = percentage * duration;
                                                        seekTo(newTime);
                                                    }}
                                                >
                                                    <div
                                                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300 ease-out"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-gray-400 text-[10px] font-medium font-mono">
                                                    <span>{formatTime(currentTime)}</span>
                                                    <span>-{formatTime(remainingTime)}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                    <div className="grid gap-2 grid-cols-4">
                                        <div />
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.2 } }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center justify-center gap-5 col-span-2"
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    seekBackward();
                                                }}
                                                disabled={!hasVideo}
                                                className="text-white/60 hover:text-white cursor-pointer transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                                                aria-label="Previous track"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    togglePlay();
                                                }}
                                                disabled={!hasVideo}
                                                className="w-10 h-10 rounded-full cursor-pointer bg-white text-black flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                                                aria-label={isPlaying ? 'Pause' : 'Play'}
                                            >
                                                {isPlaying ? (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                                    </svg>
                                                ) : (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                )}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    seekForward();
                                                }}
                                                disabled={!hasVideo}
                                                className="text-white/60 hover:text-white cursor-pointer transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                                                aria-label="Next track"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                                                </svg>
                                            </button>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.3 } }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setVolume(volume === 0 ? 50 : 0);
                                                }}
                                                disabled={!hasVideo}
                                                className="text-white/60 hover:text-white cursor-pointer transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                                                aria-label={volume === 0 ? 'Unmute' : 'Mute'}
                                            >
                                                {volume === 0 ? (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                                    </svg>
                                                ) : volume < 50 ? (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M5 9v6h4l5 5V4L9 9H5zm11.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                                                    </svg>
                                                ) : (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                                    </svg>
                                                )}
                                            </button>
                                            <div
                                                id="volume-slider"
                                                className="w-20 h-1 bg-white/15 rounded-full relative overflow-hidden cursor-pointer"
                                                onMouseDown={() => {
                                                    if (!hasVideo) return;
                                                    setIsDraggingVolume(true);
                                                }}
                                                onClick={(e) => {
                                                    if (!hasVideo) return;
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const clickX = e.clientX - rect.left;
                                                    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                                                    setVolume(percentage * 100);
                                                }}
                                            >
                                                <div
                                                    className="h-full bg-white rounded-full"
                                                    style={{ width: `${volume}%` }}
                                                />
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center w-full justify-between gap-2 mt-12 px-1">
                                    <motion.div
                                        layoutId="imagecover"
                                        className="shrink-0 bg-cover bg-center"
                                        style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: 24,
                                            backgroundImage: `url(${thumbnail})`,
                                            willChange: 'transform',
                                        }}
                                        transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                                    />
                                    <AnimatePresence>
                                        {isHovered && (
                                            <motion.div
                                                key="hover-meta"
                                                initial={{ opacity: 0, x: -4 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -4 }}
                                                transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
                                                className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden"
                                            >
                                                <span className="text-white text-[11px] font-semibold leading-tight truncate">
                                                    {title}
                                                </span>
                                                <span className="text-gray-400 text-[9px] leading-tight truncate">
                                                    {artist}
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <Wave color="#22c55e" isPlaying={isPlaying} onClick={togglePlay} />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Track pills — column of square thumbnails to the right of the
                 *  expanded notch. Lives outside the gooey filter so the squares
                 *  stay crisp instead of blending into blobs. */}
                <AnimatePresence>
                    {isExpanded && tracks && tracks.length > 1 && (
                        <motion.div
                            key="track-pills"
                            initial={{ opacity: 0, x: -8, scale: 0.92 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -8, scale: 0.92, transition: { duration: 0.15 } }}
                            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                            className="absolute left-full top-16 lg:top-14 ml-5 flex flex-col gap-2 pointer-events-auto"
                        >
                            {tracks.map((t, i) => {
                                const isActive = i === currentTrackIndex;
                                return (
                                    <motion.button
                                        key={t.videoId}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelectTrack?.(i);
                                        }}
                                        initial={{ opacity: 0, x: -6, scale: 0.9 }}
                                        animate={{
                                            opacity: isActive ? 1 : 0.4,
                                            x: 0,
                                            scale: 1,
                                        }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 320,
                                            damping: 22,
                                            delay: 0.04 * i,
                                        }}
                                        whileHover={{ scale: 1.08, opacity: 1 }}
                                        whileTap={{ scale: 0.92 }}
                                        className={cn(
                                            'relative w-9 h-9 rounded-md overflow-hidden bg-black/60 cursor-pointer',
                                        )}
                                        style={{
                                            backgroundImage: `url(${t.thumbnail})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                        aria-label={`Play ${t.title}`}
                                        aria-current={isActive ? 'true' : undefined}
                                    />
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export { SongPlayer };

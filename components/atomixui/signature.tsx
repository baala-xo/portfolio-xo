'use client';

import { Check, Loader2, RotateCw, SquarePen, PenLine, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SignatureProps {
    onComplete?: (dataUrl: string) => void | Promise<void>;
    onReset?: () => void;
    isSubmitting?: boolean;
    submittedLabel?: string;
    startLabel?: string;
    finishLabel?: string;
}

const Signature = ({
    onComplete,
    onReset,
    isSubmitting = false,
    submittedLabel = 'Signed',
    startLabel = 'Start Signing',
    finishLabel = 'Finish Signing',
}: SignatureProps) => {
    const [isSigned, setIsSigned] = useState(false);
    const [isSigning, setIsSigning] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [savedSignature, setSavedSignature] = useState<string | null>(null);
    const [hasInk, setHasInk] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && isSigning) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (savedSignature) {
                    const img = new Image();
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0);
                        setHasInk(true);
                    };
                    img.src = savedSignature;
                }
            }
        }
    }, [savedSignature, isSigning]);

    const getPoint = (
        e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
        rect: DOMRect,
    ) => {
        if ('touches' in e) {
            const t = e.touches[0];
            return { x: t.clientX - rect.left, y: t.clientY - rect.top };
        }
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        ctx.beginPath();
        const { x, y } = getPoint(e, canvas.getBoundingClientRect());
        ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { x, y } = getPoint(e, canvas.getBoundingClientRect());
        ctx.lineTo(x, y);
        ctx.stroke();
        if (!hasInk) setHasInk(true);
    };

    const stopDrawing = () => setIsDrawing(false);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsSigned(false);
        setSavedSignature(null);
        setHasInk(false);
    };

    const handleFinish = async () => {
        const canvas = canvasRef.current;
        if (!canvas || !hasInk) return;
        const dataUrl = canvas.toDataURL('image/png');
        setSavedSignature(dataUrl);
        setIsSigning(false);
        setIsSigned(true);
        if (onComplete) await onComplete(dataUrl);
    };

    const handleResetAll = () => {
        clearCanvas();
        onReset?.();
    };

    return (
        <>
            {isSigning ? (
                <motion.div
                    transition={{ type: 'spring' }}
                    className="p-3 rounded-2xl border border-dashed border-border/60 bg-background/40 backdrop-blur flex flex-col gap-3"
                >
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={clearCanvas}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Clear"
                        >
                            <RotateCw size={14} />
                        </button>
                        <span className="text-xs text-muted-foreground">
                            Draw your signature
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsSigning(false)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Cancel"
                        >
                            <X size={14} />
                        </button>
                    </div>
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '140px' }}
                        transition={{ type: 'spring' }}
                        className="rounded-xl bg-muted/40 border border-border/40 overflow-hidden"
                    >
                        <canvas
                            ref={canvasRef}
                            width={280}
                            height={140}
                            className="cursor-crosshair touch-none w-full h-full"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                    </motion.div>
                    <motion.button
                        type="button"
                        layoutId="signature-button"
                        disabled={!hasInk || isSubmitting}
                        onClick={handleFinish}
                        className={cn(
                            'rounded-full flex items-center gap-2 justify-center py-2.5 px-6 transition-opacity text-sm font-semibold',
                            hasInk && !isSubmitting
                                ? 'bg-foreground text-background cursor-pointer hover:opacity-90'
                                : 'bg-foreground/30 text-background/50 cursor-not-allowed',
                        )}
                    >
                        {isSubmitting ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <PenLine size={14} />
                        )}
                        <motion.span
                            initial={{ opacity: 0, filter: 'blur(2px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 0.2, delay: 0.1, ease: 'easeIn' }}
                        >
                            {isSubmitting ? 'Posting...' : finishLabel}
                        </motion.span>
                    </motion.button>
                </motion.div>
            ) : (
                <div className="flex items-center gap-2">
                    <motion.button
                        type="button"
                        layoutId="signature-button"
                        onClick={() => {
                            if (!isSigned) setIsSigning(true);
                        }}
                        disabled={isSigned}
                        className={cn(
                            'rounded-full flex items-center gap-2 py-2.5 px-4 transition-colors text-sm font-semibold',
                            isSigned
                                ? 'bg-[#8A2BE2]/15 text-[#a78bfa] border border-[#8A2BE2]/30 cursor-default'
                                : 'bg-foreground text-background cursor-pointer hover:opacity-90',
                        )}
                    >
                        {isSigned ? (
                            <span className="bg-[#8A2BE2] rounded-full p-0.5">
                                <Check size={12} className="text-background" strokeWidth={4} />
                            </span>
                        ) : (
                            <PenLine size={14} />
                        )}
                        <motion.span
                            initial={{ opacity: 0, filter: 'blur(2px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 0.2, delay: 0.1, ease: 'easeIn' }}
                        >
                            {isSigned ? submittedLabel : startLabel}
                        </motion.span>
                    </motion.button>
                    {isSigned && (
                        <motion.button
                            type="button"
                            initial={{ opacity: 0, filter: 'blur(4px)', y: 10, x: -10 }}
                            animate={{ opacity: 1, filter: 'blur(0px)', y: 0, x: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="rounded-full p-2.5 bg-muted border border-border/50 hover:bg-muted/70 transition-colors"
                            onClick={handleResetAll}
                            aria-label="Sign again"
                        >
                            <SquarePen size={14} className="text-foreground" />
                        </motion.button>
                    )}
                </div>
            )}
        </>
    );
};

export { Signature };

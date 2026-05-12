'use client';
import gsap from 'gsap';
import type React from 'react';
import { useEffect, useRef } from 'react';

interface MagneticWrapperProps {
    children: React.ReactElement;
    animationDuration?: number;
    elasticity?: number;
}

interface MagneticElement extends HTMLElement {
    getBoundingClientRect(): DOMRect;
}

export default function MagneticWrapper({ children, animationDuration = 1, elasticity = 0.3 }: MagneticWrapperProps) {
    const magneticElementRef = useRef<MagneticElement | null>(null);

    useEffect(() => {
        const targetElement = magneticElementRef.current;
        if (!targetElement) {
            console.warn('MagneticWrapper: No target element found');
            return;
        }

        const animateXPosition = gsap.quickTo(targetElement, 'x', {
            duration: animationDuration,
            ease: `elastic.out(1, ${elasticity})`,
        });

        const animateYPosition = gsap.quickTo(targetElement, 'y', {
            duration: animationDuration,
            ease: `elastic.out(1, ${elasticity})`,
        });

        const resetPosition = () => {
            try {
                animateXPosition(0);
                animateYPosition(0);
            } catch (error) {
                console.error('MagneticWrapper: Error resetting position', error);
            }
        };

        const handleMouseMove = (event: MouseEvent) => {
            try {
                const { clientX, clientY } = event;
                const elementBounds = targetElement.getBoundingClientRect();
                const elementCenterX = elementBounds.left + elementBounds.width / 2;
                const elementCenterY = elementBounds.top + elementBounds.height / 2;

                animateXPosition(clientX - elementCenterX);
                animateYPosition(clientY - elementCenterY);
            } catch (error) {
                console.error('MagneticWrapper: Error during mouse move animation', error);
                resetPosition();
            }
        };

        const handleTouchMove = (event: TouchEvent) => {
            try {
                const touch = event.touches[0];
                const { clientX, clientY } = touch;
                const elementBounds = targetElement.getBoundingClientRect();
                const elementCenterX = elementBounds.left + elementBounds.width / 2;
                const elementCenterY = elementBounds.top + elementBounds.height / 2;

                animateXPosition(clientX - elementCenterX);
                animateYPosition(clientY - elementCenterY);
            } catch (error) {
                console.error('MagneticWrapper: Error during touch move animation', error);
                resetPosition();
            }
        };

        targetElement.addEventListener('mousemove', handleMouseMove);
        targetElement.addEventListener('mouseleave', resetPosition);
        targetElement.addEventListener('touchmove', handleTouchMove, { passive: true });
        targetElement.addEventListener('touchend', resetPosition);

        return () => {
            targetElement.removeEventListener('mousemove', handleMouseMove);
            targetElement.removeEventListener('mouseleave', resetPosition);
            targetElement.removeEventListener('touchmove', handleTouchMove);
            targetElement.removeEventListener('touchend', resetPosition);
        };
    }, [animationDuration, elasticity]);

    return (
        <div ref={magneticElementRef as React.RefObject<HTMLDivElement>} className="flex items-center justify-center">
            {children}
        </div>
    );
}

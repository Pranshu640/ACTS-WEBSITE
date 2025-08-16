"use client"

/**
 * LogoTs Component
 * 
 * This component renders an animated ACTS logo with triangular elements that
 * expand and reposition during animation. It uses Framer Motion for animations
 * and includes responsive behavior based on screen size.
 */

import type React from "react"
import DotGrid from "./Reactbits-background/DotGrid"

import { useEffect, useState } from "react"
import { motion, type Variants } from "framer-motion"

// Type assertion for motion.img to work with React's img element props
const MotionImg = motion.img as React.ComponentType<React.ImgHTMLAttributes<HTMLImageElement>>

/**
 * Animation variants for the container element
 * 
 * Defines how the logo container transforms from a small box (initial)
 * to a full-screen container (animate) during the animation sequence.
 */
const containerVariants: Variants = {
    initial: {
        width: "250px",
        height: "250px",
        borderRadius: "20px",
        backgroundColor: "#000000",
    },
    animate: {
        width: "100vw",
        height: "100vh",
        borderRadius: "0px",
        backgroundColor: "#000000",
        transition: { duration: 1.5, ease: "easeInOut" },
    },
}
/**
 * Calculates dynamic animation properties based on screen width
 *
 * This function adjusts scale and visibility of triangle elements based on the window width:
 * - Hides elements on mobile screens (< 768px)
 * - Applies different maximum scale limits based on screen resolution to prevent pixelation
 * - Preserves the position (x, y) values from baseAnimateProps
 *
 * @param windowWidth - Current window width in pixels
 * @param baseScale - The desired base scale factor
 * @param baseAnimateProps - The base x/y position values
 * @returns Animation properties object with opacity, scale, x, and y values
 */
function getDynamicProperties(windowWidth: number, baseScale: number, baseAnimateProps: { x?: number|string; y?: number|string}) {
    if (windowWidth < 768) {
        return { opacity: 0, scale: 0 }
    }

    // More aggressive scale limiting to prevent pixelation on 1080p+ displays
    let maxScale = baseScale;
    if (windowWidth >= 1920) {
        // 1080p+ screens: cap at 2.5x scale to prevent grain
        maxScale = Math.min(baseScale, 2.5);
    } else if (windowWidth >= 1440) {
        // Medium screens: cap at 3x scale
        maxScale = Math.min(baseScale, 3);
    } else if (windowWidth >= 1080) {
        // Smaller screens: cap at 3.5x scale
        maxScale = Math.min(baseScale, 3.5);
    }

    return {
        opacity: 1,
        scale: maxScale,
        x: baseAnimateProps.x || 0,
        y: baseAnimateProps.y || 0,
    }
}
/**
 * Animation variants for the ACTS text logo
 * 
 * Controls how the central ACTS logo text moves to the top-left corner
 * and scales down during the animation sequence.
 */
function createTextVariants(windowWidth: number): Variants {
    // Define the base properties that the animation will move to.
    // These are the same values from the original 'textVariants' object.
    const baseTextProps = {
        x: "-42vw",
        y: "-42vh",
        scale: 0.7,
    };

    // Use getDynamicProperties to calculate the final 'animate' state
    // based on the window width and the desired base properties.
    const animateState = getDynamicProperties(
        windowWidth,
        baseTextProps.scale,
        baseTextProps
    );

    return {
        initial: { opacity: 1, scale: 1, x: 0, y: 0 },
        animate: {
            ...animateState,
            transition: { duration: 1.5, ease: "easeInOut" },
        },
    };
}



/**
 * Creates animation variants for triangle elements
 * 
 * Generates Framer Motion variants that define how triangle elements
 * should animate based on the current window width and desired scale/position.
 * 
 * @param windowWidth - Current window width in pixels
 * @param baseScale - The desired base scale factor for the triangle
 * @param baseAnimateProps - The target x/y position values for animation
 * @returns Framer Motion variants object with initial and animate states
 */
function createTriangleVariants(windowWidth: number, baseScale: number, baseAnimateProps: { x?: number; y?: number }): Variants {
    const animateState = getDynamicProperties(windowWidth, baseScale, baseAnimateProps)
    return {
        initial: { scale: 1, x: 0, y: 0, opacity: 1 },
        animate: animateState,
    }
}

/**
 * Creates common motion properties for animated elements
 * 
 * This utility function generates the standard props needed for Framer Motion elements,
 * controlling whether the animation is active based on the isAnimating flag.
 * 
 * @param variants - The animation variants to apply
 * @param isAnimating - Boolean flag to control if animation should run
 * @returns Object with common Framer Motion props
 */
const motionProps = (variants: Variants, isAnimating: boolean) => ({
    variants,
    initial: "initial",
    animate: isAnimating ? "animate" : "initial",
    transition: { duration: 1.5, ease: "easeInOut" },
})

/**
 * Props interface for the LogoTs component
 * 
 * @property isAnimating - Controls whether the logo animation is active
 * @property onAnimationComplete - Callback function triggered when animation finishes
 */
interface LogoProps {
    isAnimating: boolean
    onAnimationComplete: () => void
}

/**
 * LogoTs Component
 * 
 * Renders an animated ACTS logo with triangular elements that expand and
 * reposition during animation. The component handles:
 * - Responsive behavior based on screen size
 * - Animation of the logo container from small to full-screen
 * - Animation of the ACTS text logo to the top-left corner
 * - Animation of triangle elements to their final positions
 * - Showing a dot grid background after animation completes
 * 
 * @param props - Component props (see LogoProps interface)
 * @returns React component
 */
export default function LogoTs({ isAnimating, onAnimationComplete }: LogoProps) {
    // Track window width for responsive animations
    const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024)
    // Control visibility of the background dot grid
    const [showBackground, setShowBackground] = useState(false)

    // Set up window resize listener to update animations on screen size changes
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    /**
     * Handles animation completion
     * 
     * Shows the background dot grid with a slight delay for smooth transition
     * and calls the parent's onAnimationComplete callback
     */
    const handleAnimationComplete = () => {
        // Delay showing background slightly to ensure smooth transition
        setTimeout(() => {
            setShowBackground(true)
        }, 200)
        onAnimationComplete()
    }

    return (
        <motion.div
            className="relative w-[250px] h-[250px] bg-black rounded-[20px] flex justify-center items-center overflow-hidden"
            variants={containerVariants}
            initial="initial"
            animate={isAnimating ? "animate" : "initial"}
            onAnimationComplete={handleAnimationComplete}
        >
            {/* 
              * Dot background - only shows after animation completes
              * Fades in with a slight delay for a smooth transition effect
              */}
            {showBackground && (
                <motion.div
                    style={{ width: '100%', height: '100vh', position: 'absolute', zIndex: 1 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <DotGrid
                        dotSize={4}
                        gap={40}
                        baseColor="#2b2b2b"
                        activeColor="#5227FF"
                        proximity={120}
                        shockRadius={0}
                        shockStrength={0}
                        resistance={1000}
                        returnDuration={1.5}
                        style={{}}
                    />
                </motion.div>
            )}

            {/* 
              * ACTS Logo Text - Central element that moves to top-left corner
              * Uses higher z-index (10) to stay above the background
              */}
            <MotionImg
                src="/Logo/image 3.svg"
                alt="ACTS"
                className="w-[150px] z-10"
                {...motionProps(createTextVariants(windowWidth), isAnimating)}

                />

            {/* Triangle elements with crisp rendering to prevent pixelation */}
            <MotionImg
                src="/Logo/Toprightbig.svg"
                alt=""
                className="absolute top-0 right-0 z-10 max-w-[200px] max-h-[200px]"
                style={{ imageRendering: 'crisp-edges' }}
                {...motionProps(createTriangleVariants(windowWidth, 5, { x: -200 }), isAnimating)}
            />

            <MotionImg
                src="/Logo/toprightsmall.svg"
                alt=""
                className="absolute top-4 right-[7.06rem] z-10 max-w-[150px] max-h-[150px]"
                style={{ imageRendering: 'crisp-edges' }}
                {...motionProps(createTriangleVariants(windowWidth, 4, { x: -250, y: 100 }), isAnimating)}
            />

            <MotionImg
                src="/Logo/bottomleftbig.svg"
                alt=""
                className="absolute bottom-0 left-0 z-10 max-w-[200px] max-h-[200px]"
                style={{ imageRendering: 'crisp-edges' }}
                {...motionProps(createTriangleVariants(windowWidth, 4, { x: 100, y: -50 }), isAnimating)}
            />

            <MotionImg
                src="/Logo/bottomleftsmall.svg"
                alt=""
                className="absolute bottom-[0.81rem] left-[7rem] z-10 max-w-[150px] max-h-[150px]"
                style={{ imageRendering: 'crisp-edges' }}
                {...motionProps(createTriangleVariants(windowWidth, 4, { x: 300, y: -80 }), isAnimating)}
            />

            <MotionImg
                src="/Logo/bottomrightbig.svg"
                alt=""
                className="absolute bottom-0 right-0 z-10 max-w-[200px] max-h-[200px]"
                style={{ imageRendering: 'crisp-edges' }}
                {...motionProps(createTriangleVariants(windowWidth, 5, { x: -80, y: -50 }), isAnimating)}
            />

            <MotionImg
                src="/Logo/bottomrightsmall.svg"
                alt=""
                className="absolute bottom-[2.5rem] right-[1.44rem] z-10 max-w-[150px] max-h-[150px]"
                style={{ imageRendering: 'crisp-edges' }}
                {...motionProps(createTriangleVariants(windowWidth, 4, { x: -100, y: -100 }), isAnimating)}
            />

            <MotionImg
                src="/Logo/leftbottombig.svg"
                alt=""
                className="absolute bottom-4 left-0 z-10 max-w-[200px] max-h-[200px]"
                style={{ imageRendering: 'crisp-edges' }}
                {...motionProps(createTriangleVariants(windowWidth, 4, { x: 0, y: -300 }), isAnimating)}
            />

            <MotionImg
                src="/Logo/lefttopbig.svg"
                alt=""
                className="absolute top-0 right-0 z-10 max-w-[200px] max-h-[200px]"
                style={{ imageRendering: 'crisp-edges' }}
                {...motionProps(createTriangleVariants(windowWidth, 4, { x: -30, y: 100 }), isAnimating)}
            />
        </motion.div>
    )
}

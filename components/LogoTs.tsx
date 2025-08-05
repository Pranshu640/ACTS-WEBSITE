"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, type Variants } from "framer-motion"

const MotionImg = motion.img as React.ComponentType<React.ImgHTMLAttributes<HTMLImageElement>>

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

const textVariants: Variants = {
    initial: { opacity: 1, scale: 1, x: 0, y: 0 },
    animate: {
        x: "-42vw",
        y: "-42vh",
        scale: 0.7,
        transition: { duration: 1.5, ease: "easeInOut" },
    },
    hover: {
        scale: 0.75,
        filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.7))",
    },
}

function getDynamicProperties(windowWidth: number, baseScale: number, baseAnimateProps: any) {
    if (windowWidth < 768) {
        return { opacity: 0, scale: 0 }
    }
    return {
        opacity: 1,
        scale: baseScale,
        x: baseAnimateProps.x || 0,
        y: baseAnimateProps.y || 0,
    }
}

function createTriangleVariants(windowWidth: number, baseScale: number, baseAnimateProps: any): Variants {
    const animateState = getDynamicProperties(windowWidth, baseScale, baseAnimateProps)
    return {
        initial: { scale: 1, x: 0, y: 0, opacity: 1 },
        animate: animateState,
        hover: {
            scale: animateState.scale ? animateState.scale * 1.05 : 0,
            filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))",
        },
    }
}

const motionProps = (variants: Variants, isAnimating: boolean, isHoverEnabled: boolean) => ({
    variants,
    initial: "initial",
    animate: isAnimating ? "animate" : "initial",
    whileHover: isHoverEnabled ? "hover" : undefined,
    transition: { duration: 1.5, ease: "easeInOut" },
})

interface LogoProps {
    isAnimating: boolean
    onAnimationComplete: () => void
}

export default function LogoTs({ isAnimating, onAnimationComplete }: LogoProps) {
    const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024)
    const [isHoverEnabled, setIsHoverEnabled] = useState(false)

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <motion.div
            className="relative w-[250px] h-[250px] bg-black rounded-[20px] flex justify-center items-center overflow-hidden"
            variants={containerVariants}
            initial="initial"
            animate={isAnimating ? "animate" : "initial"}
            onAnimationComplete={() => {
                onAnimationComplete()
                setIsHoverEnabled(true)
            }}
        >
            <MotionImg
                src="/landingPage/image 3.svg"
                alt="ACTS"
                className="w-[150px]"
                {...motionProps(textVariants, isAnimating, isHoverEnabled)}
            />

            <MotionImg
                src="/landingPage/Toprightbig.svg"
                alt=""
                className="absolute top-0 right-0"
                {...motionProps(createTriangleVariants(windowWidth, 5, { x: -200 }), isAnimating, isHoverEnabled)}
            />

            <MotionImg
                src="/landingPage/toprightsmall.svg"
                alt=""
                className="absolute top-4 right-[7.06rem]"
                {...motionProps(createTriangleVariants(windowWidth, 4, { x: -250, y: 100 }), isAnimating, isHoverEnabled)}
            />

            <MotionImg
                src="/landingPage/bottomleftbig.svg"
                alt=""
                className="absolute bottom-0 left-0"
                {...motionProps(createTriangleVariants(windowWidth, 4, { x: 100, y: -50 }), isAnimating, isHoverEnabled)}
            />

            <MotionImg
                src="/landingPage/bottomleftsmall.svg"
                alt=""
                className="absolute bottom-[0.81rem] left-[7rem]"
                {...motionProps(createTriangleVariants(windowWidth, 4, { x: 300, y: -80 }), isAnimating, isHoverEnabled)}
            />

            <MotionImg
                src="/landingPage/bottomrightbig.svg"
                alt=""
                className="absolute bottom-0 right-0"
                {...motionProps(createTriangleVariants(windowWidth, 5, { x: -200, y: -100 }), isAnimating, isHoverEnabled)}
            />

            <MotionImg
                src="/landingPage/bottomrightsmall.svg"
                alt=""
                className="absolute bottom-[2.5rem] right-[1.44rem]"
                {...motionProps(createTriangleVariants(windowWidth, 4, { x: -200, y: -100 }), isAnimating, isHoverEnabled)}
            />

            <MotionImg
                src="/landingPage/leftbottombig.svg"
                alt=""
                className="absolute bottom-4 left-0"
                {...motionProps(createTriangleVariants(windowWidth, 4, { x: 0, y: -300 }), isAnimating, isHoverEnabled)}
            />

            <MotionImg
                src="/landingPage/lefttopbig.svg"
                alt=""
                className="absolute top-0 right-0"
                {...motionProps(createTriangleVariants(windowWidth, 4, { x: -30, y: 100 }), isAnimating, isHoverEnabled)}
            />
        </motion.div>
    )
}

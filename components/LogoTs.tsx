"use client"

import type React from "react"
import DotGrid from "./Reactbits-background/DotGrid"

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
}

function getDynamicProperties(windowWidth: number, baseScale: number, baseAnimateProps: { x?: number; y?: number }) {
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

function createTriangleVariants(windowWidth: number, baseScale: number, baseAnimateProps: { x?: number; y?: number }): Variants {
    const animateState = getDynamicProperties(windowWidth, baseScale, baseAnimateProps)
    return {
        initial: { scale: 1, x: 0, y: 0, opacity: 1 },
        animate: animateState,
    }
}

const motionProps = (variants: Variants, isAnimating: boolean) => ({
    variants,
    initial: "initial",
    animate: isAnimating ? "animate" : "initial",
    transition: { duration: 1.5, ease: "easeInOut" },
})

interface LogoProps {
    isAnimating: boolean
    onAnimationComplete: () => void
}

export default function LogoTs({ isAnimating, onAnimationComplete }: LogoProps) {
    const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024)

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
            onAnimationComplete={onAnimationComplete}
        >
            <div style={{ width: '100%', height: '100vh', position: 'absolute' }}>
                <DotGrid
                    dotSize={3}
                    gap={30}
                    baseColor="#2b2b2b"
                    activeColor="#5227FF"
                    proximity={120}
                    shockRadius={250}
                    shockStrength={5}
                    resistance={750}
                    returnDuration={1.5}
                    style={{}}
                />
            </div>
            <MotionImg
                src="/Logo/image 3.svg"
                alt="ACTS"
                className="w-[150px]"
                {...motionProps(textVariants, isAnimating)}
            />

            <MotionImg
                src="/Logo/Toprightbig.svg"
                alt=""
                className="absolute top-0 right-0"
                {...motionProps(createTriangleVariants(windowWidth, 5, { x: -200 }), isAnimating)}
            />

            <MotionImg
                src="/Logo/toprightsmall.svg"
                alt=""
                className="absolute top-4 right-[7.06rem]"
                {...motionProps(createTriangleVariants(windowWidth, 4, { x: -250, y: 100 }), isAnimating)}
            />

            <MotionImg
                src="/Logo/bottomleftbig.svg"
                alt=""
                className="absolute bottom-0 left-0"
                {...motionProps(createTriangleVariants(windowWidth, 4, { x: 100, y: -50 }), isAnimating)}
            />

            <MotionImg
                src="/Logo/bottomleftsmall.svg"
                alt=""
                className="absolute bottom-[0.81rem] left-[7rem]"
                {...motionProps(createTriangleVariants(windowWidth, 4, { x: 300, y: -80 }), isAnimating)}
            />

            <MotionImg
                src="/Logo/bottomrightbig.svg"
                alt=""
                className="absolute bottom-0 right-0"
                {...motionProps(createTriangleVariants(windowWidth, 5, { x: -200, y: -100 }), isAnimating)}
            />

            <MotionImg
                src="/Logo/bottomrightsmall.svg"
                alt=""
                className="absolute bottom-[2.5rem] right-[1.44rem]"
                {...motionProps(createTriangleVariants(windowWidth, 4, { x: -200, y: -100 }), isAnimating)}
            />

            <MotionImg
                src="/Logo/leftbottombig.svg"
                alt=""
                className="absolute bottom-4 left-0"
                {...motionProps(createTriangleVariants(windowWidth, 4, { x: 0, y: -300 }), isAnimating)}
            />

            <MotionImg
                src="/Logo/lefttopbig.svg"
                alt=""
                className="absolute top-0 right-0"
                {...motionProps(createTriangleVariants(windowWidth, 4, { x: -30, y: 100 }), isAnimating)}
            />
        </motion.div>
    )
}

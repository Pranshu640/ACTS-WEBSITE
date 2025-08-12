"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, Code } from "lucide-react"
import Squares from "@/components/ui/Squares";

const useCounter = (end: number, duration = 2000) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let startTime: number
        let animationFrame: number

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)

            setCount(Math.floor(progress * end))

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate)
            }
        }

        animationFrame = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationFrame)
    }, [end, duration])

    return count
}

// Stat card component
const StatCard = ({
                      icon: Icon,
                      value,
                      label,
                      delay = 0,
                  }: {
    icon: React.ComponentType<{ className?: string }>
    value: number
    label: string
    delay?: number
}) => {
    const animatedValue = useCounter(value, 2000)

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay }}
            className="relative"
        >
            <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-sm h-full relative overflow-hidden">
                <CardContent className="p-3 sm:p-4 lg:p-6 text-center flex flex-col items-center justify-center h-full">
                    <div className="inline-block mb-2 sm:mb-3 lg:mb-4">
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-blue-400" />
                    </div>
                    <motion.div
                        className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2"
                        key={animatedValue}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {animatedValue}+
                    </motion.div>
                    <p className="text-gray-300 text-xs sm:text-sm lg:text-base font-medium">{label}</p>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default function AboutPage() {
    return (
        <section id="about" className="relative min-h-screen flex items-center overflow-hidden">
            {/* Main Background */}
            <div className="absolute inset-0 bg-black">
                <Squares
                    speed={0.25}
                    squareSize={40}
                    direction="diagonal"
                    borderColor="#575757"
                    hoverFillColor="rgba(0,0,0,0.8)"
                />
            </div>

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]" />

            {/* Main Content */}
            <div className="relative z-20 w-full text-white px-4 py-8 lg:py-12">
                {/* Header - Centered */}
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl font-bold text-center mb-8 lg:mb-12"
                >
                    ABOUT US
                </motion.h1>

                {/* Main Content Area - Responsive Layout */}
                <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12 max-w-7xl mx-auto">
                    {/* Left Side - Cards and Text */}
                    <div className="flex-1 flex flex-col justify-between min-h-0">
                        {/* Stats Cards - Top */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="grid grid-cols-3 gap-3 sm:gap-4 mb-8"
                        >
                            <StatCard icon={Code} value={50} label="Projects" delay={0.8} />
                            <StatCard icon={Calendar} value={8} label="Events" delay={1.0} />
                            <StatCard icon={Users} value={50} label="Members" delay={1.2} />
                        </motion.div>

                        {/* Description Text - Bottom */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 1.4 }}
                        >
                            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700">
                                <p className="text-sm lg:text-base font-medium leading-relaxed text-gray-200">
                                    ACTS is a technical club at Guru Gobind Singh Indraprastha University (East Delhi Campus) that promotes a collaborative environment for learning and innovation. The club, guided by Dr. Neeta Singh and Dr. Amar Arora, organizes workshops, hackathons, and events in AI, ML, Automation, and Robotics. It also hosts career development sessions on resume building and interview preparation, helping students grow both technically and professionally.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side - Image with Better Spacing */}
                    <div className="w-full lg:w-2/5 xl:w-1/2 flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: 50, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="w-full max-w-2xl"
                        >
                            <Image
                                src="/EveryOne.png"
                                alt="ACTS community members group photo"
                                width={800}
                                height={496}
                                className="w-auto h-[31rem] object-cover rounded-lg shadow-2xl border border-gray-700"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { HeroSlide } from "@/types/hero"
import DarkVeil from "@/components/ui/darkVeil";

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const response = await fetch("/api/hero?active=true")
            if (response.ok) {
                const heroSlides: HeroSlide[] = await response.json()
                setHeroSlides(heroSlides)
            }
        } catch (error) {
            console.error("Failed to fetch hero slides:", error)
        } finally {
            setLoading(false)
        }
    }

    // Auto-slide - only if we have slides
    useEffect(() => {
        if (heroSlides.length === 0) return

        const interval = setInterval(() => {
            if (!isPaused && !isTransitioning) {
                setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
            }
        }, 4000)
        return () => clearInterval(interval)
    }, [isPaused, isTransitioning, heroSlides.length])

    const handleSlideChange = (index: number) => {
        if (index === currentSlide || isTransitioning || heroSlides.length === 0) return
        setIsTransitioning(true)
        setCurrentSlide(index)
        setTimeout(() => setIsTransitioning(false), 600)
    }

    const goToPrevious = () => {
        if (heroSlides.length === 0) return
        const prevIndex = (currentSlide - 1 + heroSlides.length) % heroSlides.length
        handleSlideChange(prevIndex)
    }

    const goToNext = () => {
        if (heroSlides.length === 0) return
        const nextIndex = (currentSlide + 1) % heroSlides.length
        handleSlideChange(nextIndex)
    }

    return (
        <section className="relative min-h-screen bg-black overflow-hidden">
            <div className="absolute inset-0 z-0">
                <DarkVeil />
            </div>

            <div
                className="relative z-10 flex items-center justify-center p-4 md:p-8"
                style={{ minHeight: "100vh", paddingTop: "5rem" }}
            >
                <div className="w-full max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
                        {/* Left Content */}
                        <div className="flex flex-col justify-center space-y-6 lg:space-y-8 text-white lg:pr-8">
                            <div className="space-y-4 lg:space-y-6">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                                    <span className="block">Association of</span>
                                    <span className="block bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
                    Computing Technology{" "}
                  </span>
                                    <span className="block">and Science</span>
                                </h1>

                                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                                    Empowering students through innovation, collaboration, and technical excellence in AI, ML, Automation,
                                    and Robotics.
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4">
                                <Link href="/ourJourney">
                                    <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                        Know More
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>

                                <Link href="/#footer">
                                    <Button className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-5 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                        Join Us
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Content - Image Carousel or Empty State */}
                        <div className="flex flex-col items-center lg:items-end w-full">
                            <div className="flex flex-col items-center w-full">
                                {loading ? (
                                    // Loading State
                                    <Card className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-gray-800/30 shadow-2xl bg-gray-900/20 backdrop-blur-sm w-full max-w-lg lg:max-w-xl">
                                        <CardContent className="p-0">
                                            <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] min-h-[300px] max-h-[500px] flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                                                    <p className="text-white font-light">Loading...</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : heroSlides.length === 0 ? (
                                    // Empty State - No Images
                                    <Card className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-gray-800/30 shadow-2xl bg-gray-900/20 backdrop-blur-sm w-full max-w-lg lg:max-w-xl">
                                        <CardContent className="p-0">
                                            <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] min-h-[300px] max-h-[500px] flex items-center justify-center">
                                                <div className="text-center p-8">
                                                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <span className="text-white font-bold text-2xl">A</span>
                                                    </div>
                                                    <h3 className="text-white text-xl font-semibold mb-2">ACTS</h3>
                                                    <p className="text-gray-300 text-sm">Association of Computing Technology and Science</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    // Image Carousel
                                    <Card className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-gray-800/30 shadow-2xl bg-gray-900/20 backdrop-blur-sm w-full max-w-lg lg:max-w-xl">
                                        <CardContent className="p-0">
                                            <div
                                                className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] min-h-[300px] max-h-[500px] group"
                                                onMouseEnter={() => setIsPaused(true)}
                                                onMouseLeave={() => setIsPaused(false)}
                                            >
                                                {/* Gradients */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 z-10"></div>
                                                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 z-10"></div>

                                                {/* Image */}
                                                <div className="absolute inset-0">
                                                    <Image
                                                        src={heroSlides[currentSlide]?.image || "/placeholder.svg"}
                                                        alt={heroSlides[currentSlide]?.title}
                                                        fill
                                                        className={`object-cover object-center transition-all duration-600 ease-out ${
                                                            isTransitioning ? "scale-105" : "scale-100"
                                                        }`}
                                                        priority={currentSlide === 0}
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement
                                                            // Hide the image on error
                                                            target.style.display = "none"
                                                        }}
                                                        unoptimized
                                                    />
                                                </div>

                                                {/* Navigation Arrows - Only show if more than 1 slide */}
                                                {heroSlides.length > 1 && (
                                                    <div className="absolute inset-0 flex items-center justify-between px-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <button
                                                            onClick={goToPrevious}
                                                            className="bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-all duration-300 hover:scale-110"
                                                            aria-label="Previous"
                                                        >
                                                            <ChevronLeft className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={goToNext}
                                                            className="bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-all duration-300 hover:scale-110"
                                                            aria-label="Next"
                                                        >
                                                            <ChevronRight className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Slide Title */}
                                                <div className="absolute bottom-4 left-4 right-4 z-20">
                                                    <h3 className="text-white text-lg md:text-xl font-semibold bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg">
                                                        {heroSlides[currentSlide]?.title}
                                                    </h3>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Dot Navigation - Only show if more than 1 slide */}
                                {heroSlides.length > 1 && (
                                    <div className="flex justify-center mt-6 space-x-3">
                                        {heroSlides.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSlideChange(index)}
                                                className={`transition-all duration-500 ${
                                                    index === currentSlide ? "w-8 h-2" : "w-2 h-2 hover:scale-125"
                                                }`}
                                                aria-label={`Slide ${index + 1}`}
                                            >
                                                <div
                                                    className={`w-full h-full rounded-full transition-all duration-500 ${
                                                        index === currentSlide ? "bg-blue-400" : "bg-white/40 hover:bg-white/60"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link"
import LogoTs from './LogoTs';
import { useHighlights } from '@/contexts/HighlightsContext';

interface HeroSlide {
    id: string;
    title: string;
    image: string;
    active: boolean;
}

interface DriveImage {
    id: string;
    name: string;
    thumbnailLink?: string;
    webContentLink?: string;
    webViewLink?: string;
    mimeType?: string;
}




// Logo Animation Component contained within hero section
function LogoBackground({ onComplete, preloadProgress, isPreloadComplete }: { 
    onComplete: () => void; 
    preloadProgress: number;
    isPreloadComplete: boolean;
}) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(0);

    const coolMessages = [
        "Initializing quantum processors...",
        "Calibrating neural networks...",
        "Loading AI algorithms...",
        "Synchronizing data matrices...",
        "Optimizing machine learning models...",
        "Preparing robotic systems...",
        "Activating automation protocols...",
        "Establishing secure connections...",
        "Compiling innovative solutions...",
        "Finalizing technical excellence...",
        "Ready to launch!"
    ];

    // Cycle through messages during loading
    useEffect(() => {
        if (!isPreloadComplete && preloadProgress < 100) {
            const messageInterval = setInterval(() => {
                setCurrentMessage((prev) => (prev + 1) % (coolMessages.length - 1));
            }, 800);
            return () => clearInterval(messageInterval);
        } else if (preloadProgress === 100) {
            setCurrentMessage(coolMessages.length - 1); // "Ready to launch!"
        }
    }, [isPreloadComplete, preloadProgress, coolMessages.length]);

    // Start animation only when preloading is complete
    useEffect(() => {
        if (isPreloadComplete && preloadProgress === 100) {
            const timer = setTimeout(() => {
                setIsAnimating(true);
            }, 500); // Small delay after reaching 100%
            return () => clearTimeout(timer);
        }
    }, [isPreloadComplete, preloadProgress]);

    const handleAnimationComplete = () => {
        setAnimationComplete(true);
        onComplete();
    };

    return (
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
            animationComplete ? 'z-0 bg-transparent pointer-events-none' : 'z-50 bg-black'
        }`}>
            {/* LogoTs Animation - Always visible */}
            <LogoTs
                isAnimating={isAnimating}
                onAnimationComplete={handleAnimationComplete}
            />
            
            {/* Small Loading Indicator at Bottom - Only show until animation starts */}
            {!isAnimating && (
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                    <div className="text-center space-y-3">
                        {/* Cool Loading Message */}
                        <div className="text-cyan-400 text-sm font-medium animate-pulse font-mono">
                            {coolMessages[currentMessage]}
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-64 h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 rounded-full transition-all duration-300 ease-out relative"
                                style={{ width: `${preloadProgress}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                            </div>
                        </div>
                        
                        {/* Percentage */}
                        <div className="text-white/60 text-xs font-mono">
                            {preloadProgress}%
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Main Hero Section Component
export default function HeroSection() {
    const [showHeroContent, setShowHeroContent] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [highlightsPreloaded, setHighlightsPreloaded] = useState(false);
    const [preloadProgress, setPreloadProgress] = useState(0);
    
    const { setPreloadedImages, setIsPreloaded } = useHighlights();

    // Preload highlights images during animation
    const preloadHighlightsImages = useCallback(async () => {
        const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY;
        const FOLDER_ID = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID;

        if (!API_KEY || !FOLDER_ID) {
            setHighlightsPreloaded(true);
            setIsPreloaded(true);
            return;
        }

        try {
            // Fetch image list from Google Drive
            const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+trashed=false&key=${API_KEY}&fields=files(id,name,mimeType)&pageSize=20`;
            
            const response = await fetch(url);
            if (!response.ok) {
                setHighlightsPreloaded(true);
                setIsPreloaded(true);
                return;
            }

            const data = await response.json();
            const imageFiles: DriveImage[] = data.files?.filter((file: DriveImage) => 
                file && file.mimeType && file.mimeType.startsWith("image/")
            ) || [];

            if (imageFiles.length === 0) {
                setHighlightsPreloaded(true);
                setIsPreloaded(true);
                return;
            }

            console.log('Found images for preloading:', imageFiles.length);
            
            // Store all images in context for HighLights component
            setPreloadedImages(imageFiles);

            // Preload first 15 images to avoid overwhelming
            const imagesToPreload = imageFiles.slice(0, 15);
            let loadedCount = 0;
            
            console.log('Starting to preload', imagesToPreload.length, 'images');

            const preloadPromises = imagesToPreload.map((file: DriveImage) => {
                return new Promise<void>((resolve) => {
                    const img = document.createElement('img');
                    const imageUrl = `https://drive.google.com/uc?export=view&id=${file.id}`;
                    
                    img.onload = () => {
                        loadedCount++;
                        setPreloadProgress(Math.round((loadedCount / imagesToPreload.length) * 100));
                        resolve();
                    };
                    
                    img.onerror = () => {
                        loadedCount++;
                        setPreloadProgress(Math.round((loadedCount / imagesToPreload.length) * 100));
                        resolve();
                    };
                    
                    img.src = imageUrl;
                });
            });

            await Promise.all(preloadPromises);
            setHighlightsPreloaded(true);
            setIsPreloaded(true);
        } catch (error) {
            console.error("Failed to preload highlights images:", error);
            setHighlightsPreloaded(true);
            setIsPreloaded(true);
        }
    }, [setPreloadedImages, setIsPreloaded]);

    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Fetch hero slides and start preloading highlights
        fetchEvents();
        preloadHighlightsImages();

        return () => {
            // Cleanup
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
        };
    }, [preloadHighlightsImages]);

    const fetchEvents = async () => {
        try {
            const response = await fetch("/api/hero?active=true");
            if (response.ok) {
                const slides: HeroSlide[] = await response.json();
                setHeroSlides(slides);
            }
        } catch (error) {
            console.error("Failed to fetch hero slides:", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-slide functionality
    useEffect(() => {
        if (heroSlides.length === 0) return;
        const interval = setInterval(() => {
            if (!isPaused && !isTransitioning) {
                setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [isPaused, isTransitioning, heroSlides.length]);

    const handleSlideChange = (index: number) => {
        if (index === currentSlide || isTransitioning || heroSlides.length === 0) return;
        setIsTransitioning(true);
        setCurrentSlide(index);
        setTimeout(() => setIsTransitioning(false), 600);
    };

    const goToPrevious = () => {
        if (heroSlides.length === 0) return;
        const prevIndex = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
        handleSlideChange(prevIndex);
    };

    const goToNext = () => {
        if (heroSlides.length === 0) return;
        const nextIndex = (currentSlide + 1) % heroSlides.length;
        handleSlideChange(nextIndex);
    };



    const handleAnimationComplete = () => {
        // Only show content when both animation is complete AND images are preloaded
        if (highlightsPreloaded) {
            setShowHeroContent(true);
        } else {
            // If images aren't loaded yet, wait a bit more
            const checkInterval = setInterval(() => {
                if (highlightsPreloaded) {
                    setShowHeroContent(true);
                    clearInterval(checkInterval);
                }
            }, 100);
            
            // Fallback: show content after 3 seconds regardless
            setTimeout(() => {
                setShowHeroContent(true);
                clearInterval(checkInterval);
            }, 3000);
        }
    };

    return (
        <section className="relative h-screen bg-black overflow-hidden">
            {/* Logo Animation Background - Contained within this section */}
            <LogoBackground 
                onComplete={handleAnimationComplete} 
                preloadProgress={preloadProgress}
                isPreloadComplete={highlightsPreloaded}
            />

            {/* Hero Content - Shows after animation */}
            {showHeroContent && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="relative z-20 h-full"
                >
                    <div className="relative z-20 h-full flex items-center pt-8">
                        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                                {/* Left Content - Text */}
                                <div className="max-w-2xl">
                                    <motion.h1
                                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                    >
                                        <span className="text-white">Association of </span>
                                        <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                                            Computing Technology
                                        </span>
                                        <span className="text-white"> and Science</span>
                                    </motion.h1>

                                    <motion.p
                                        className="text-base sm:text-lg md:text-xl text-white/90 max-w-xl leading-relaxed mb-6 font-mono"
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                    >
                                        Empowering students through innovation, collaboration, and technical excellence in AI, ML, Automation, and Robotics.
                                    </motion.p>

                                    <motion.div
                                        className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: 0.6 }}
                                    >
                                        <Link href="#about">
                                            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 text-base font-mono">
                                                Know More
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </Link>

                                        <Link href="https://forms.gle/rXRyFKsr6RUGd7ic9">
                                            <button className="px-6 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-semibold rounded-lg transition-all duration-300 text-base font-mono">
                                                Join Us
                                            </button>
                                        </Link>
                                    </motion.div>
                                </div>

                                {/* Right Content - Image Carousel */}
                                <motion.div
                                    className="flex flex-col items-center lg:items-end w-full"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                >
                                    <div className="flex flex-col items-center w-full">
                                        {loading ? (
                                            // Loading State
                                            <Card className="relative overflow-hidden rounded-2xl border border-gray-800/30 shadow-2xl bg-gray-900/20 backdrop-blur-sm w-full max-w-lg">
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
                                            <Card className="relative overflow-hidden rounded-2xl border border-gray-800/30 shadow-2xl bg-gray-900/20 backdrop-blur-sm w-full max-w-lg">
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
                                            <Card className="relative overflow-hidden rounded-2xl border border-gray-800/30 shadow-2xl bg-gray-900/20 backdrop-blur-sm w-full max-w-lg">
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
                                                                alt={heroSlides[currentSlide]?.title || "ACTS Event"}
                                                                fill
                                                                className={`object-cover object-center transition-all duration-600 ease-out ${
                                                                    isTransitioning ? "scale-105" : "scale-100"
                                                                }`}
                                                                priority={currentSlide === 0}
                                                                sizes="(max-width: 768px) 100vw, 50vw"
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
                                                                {heroSlides[currentSlide]?.title || "ACTS Event"}
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
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </section>
    );
}
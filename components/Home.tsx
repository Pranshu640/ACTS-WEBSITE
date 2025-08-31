import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link"
import LogoTs from './LogoTs';
import SplineViewer from './SplineViewer';
import { useHighlights } from '@/contexts/HighlightsContext';
import ResultsAnnouncementStrip from "@/components/ResultsStrip";


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
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${animationComplete ? 'z-0 bg-transparent pointer-events-none' : 'z-50 bg-black'
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
        // Start preloading highlights immediately
        preloadHighlightsImages();
    }, [preloadHighlightsImages]);





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
            <ResultsAnnouncementStrip />


            {/* Hero Content - Shows after animation */}
            {showHeroContent && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="relative z-20 h-full"
                >
                    <div className="relative z-20 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">

                        {/* Mobile Layout: Robot First (Top Half) */}
                        <div className="block lg:hidden w-full h-full py-20">
                            {/* ACTS Logo - Left Corner */}
                            <motion.div
                                className="absolute top-6 left-6 z-10 py-8"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <h2 className="text-white text-xl font-bold tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                    ACTS
                                </h2>
                            </motion.div>
                            {/* Robot Section - Upper portion */}
                            <motion.div
                                className="flex-1 w-full flex items-center justify-center pt-16 pb-4"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <div className="w-72 h-72 max-w-full max-h-full">
                                    <SplineViewer
                                        url="https://prod.spline.design/Di2bazmAJY3O2fAw/scene.splinecode"
                                        className="w-full h-full rounded-2xl"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            background: 'transparent'
                                        }}

                                    />
                                </div>
                            </motion.div>

                            {/* Text Section - Lower portion */}
                            <div className="flex-1 w-full flex flex-col items-center justify-start text-center pt-4">
                                <motion.h1
                                    className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4 max-w-xs sm:max-w-md"
                                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                >
                                    <span className="text-white">Association of </span>
                                    <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                                    Computing Technology
                                </span>
                                    <span className="text-white"> and Science</span>
                                </motion.h1>

                                <motion.div
                                    className="flex flex-col gap-4 w-full max-w-xs"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                >
                                    <Link href="#about">
                                        <button className="w-full px-6 py-3 bg-white hover:bg-blue-700 text-black font-semibold rounded-full transition-all duration-300 text-sm shadow-2xl hover:scale-105 transform font-mono">
                                            Know More
                                        </button>
                                    </Link>

                                    <Link href="https://forms.gle/rXRyFKsr6RUGd7ic9">
                                        <button className="w-full px-6 py-3 bg-black/30 backdrop-blur-md border-2 border-white/20 text-white hover:text-white hover:bg-white/10 hover:border-white/30 font-semibold rounded-full transition-all duration-300 text-sm shadow-2xl hover:scale-105 transform font-mono">
                                            Join Us
                                        </button>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>

                        {/* Desktop Layout: Side by side */}
                        <div className="hidden lg:flex w-full h-full min-h-screen">
                            {/* Left Content - Text */}
                            <div className="flex-1 flex items-center justify-center lg:justify-end lg:pr-0 px-4 sm:px-6 lg:px-8 py-8 lg:py-0">
                                <div className="max-w-2xl w-full">
                                    <motion.h1
                                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
                                        style={{ fontFamily: 'Montserrat, sans-serif' }}
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

                                    <motion.div
                                        className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-12"
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: 0.6 }}
                                    >
                                        <Link href="#about">
                                            <button className="px-8 py-4 bg-white hover:bg-blue-700 text-black font-semibold rounded-full transition-all duration-300 text-base shadow-2xl hover:scale-105 transform font-mono">
                                                Know More
                                            </button>
                                        </Link>

                                        <Link href="https://forms.gle/rXRyFKsr6RUGd7ic9">
                                            <button className="px-8 py-4 bg-black/30 backdrop-blur-md border-2 border-white/20 text-white hover:text-white hover:bg-white/10 hover:border-white/30 font-semibold rounded-full transition-all duration-300 text-base shadow-2xl hover:scale-105 transform font-mono">
                                                Join Us
                                            </button>
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Right Content - 3D Robot Viewer (Full Right Side) */}
                            <motion.div
                                className="flex-1 relative h-full min-h-screen lg:-ml-8"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                            >
                                {/* Full-height robot viewer container - Edge to Edge */}
                                <div className="absolute inset-0">
                                    <Card className="relative overflow-hidden rounded-none border-0 lg:border-l lg:border-gray-800/30 shadow-2xl bg-transparent w-full h-full">
                                        <CardContent className="p-0 h-full">
                                            <div className="relative w-full h-full min-h-screen">
                                                {/* Spline 3D Robot Viewer - Full Size */}
                                                <SplineViewer
                                                    url="https://prod.spline.design/Di2bazmAJY3O2fAw/scene.splinecode"
                                                    className="w-full h-full"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        background: 'transparent'
                                                    }}

                                                />

                                                {/* Subtle gradient overlay for better text readability */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none lg:hidden"></div>

                                                {/* Tech Label - Positioned in corner */}
                                                <motion.div
                                                    className="absolute bottom-8 right-8 z-10"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.6, delay: 1.2 }}
                                                >
                                                </motion.div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Scroll to Explore Indicator - Properly centered outside the main content */}
            {showHeroContent && (
                <motion.div
                    className="absolute bottom-4 left-0 right-0 z-30 flex justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                >
                    <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 shadow-2xl">
                        <div className="flex items-center justify-center gap-2 text-white/90 text-xs sm:text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            <span className="font-medium">Scroll to explore</span>
                            <motion.div
                                animate={{ y: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </section>
    );
}

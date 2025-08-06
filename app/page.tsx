'use client'
import React from 'react'
import DemoHome from "@/components/Home";
import Squares from '@/components/ui/Squares';
import Link from "next/link"
import VisualsPage from "@/components/HighLights"
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useEffect, useState } from "react"
import FAQSection from "@/components/FAQ";
import LeadershipSection from "@/components/team";
import AskQuestionsSection from "@/components/askQuestion";
import SponsorsSection from "@/components/sponserSection";
import MentorSection from '@/components/mentors';

export default function Page() {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false });

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen">
            {/* Hero section */}
            <section className="z-20" id="home" >
                <DemoHome/>
            </section>

            <section id="about" className="relative flex h-screen items-center overflow-hidden bg-black">
                {/* Background */}
                <Squares
                    speed={0.25}
                    squareSize={40}
                    direction='diagonal'
                    borderColor='#575757'
                    hoverFillColor='black'
                />

                {/* Main Content - Enhanced Responsive */}
                <div className="absolute z-20 inset-0 flex flex-col items-center justify-center text-white px-4 sm:px-6 md:px-8 lg:px-12">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10"
                    >
                        ABOUT ACTS
                    </motion.h1>
                    
                    <motion.img
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        src="/EveryOne.png"
                        alt="ACTS community members"
                        className="h-20 xs:h-24 sm:h-32 md:h-40 lg:h-48 xl:h-64 w-auto object-contain mb-4 sm:mb-6 md:mb-8 lg:mb-10"
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col items-center justify-center max-w-full"
                    >
                        <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-medium text-center leading-relaxed max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl px-2 sm:px-4 md:px-6 lg:px-8">
                            ACTS USAR is a vibrant technical club of the Guru Gobind Singh Indraprastha University (East Delhi Campus). It fosters a collaborative community focused on learning,
                            innovation, and mentorship. The chapter organizes events in AI, ML, Automation, and Robotics, 
                            along with hands-on workshops, hackathons, and career development sessions like resume building 
                            and interview prep. Guided by Dr. Neeta Singh and Dr. Amar Arora, and driven by a dedicated 
                            student team, ACTS Usar empowers students to grow technically and professionally.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Other Sections */}
            <section>
                <VisualsPage />
            </section>

            <section id="team">
                <MentorSection />
                <LeadershipSection />
            </section>
            
            <section>
                <SponsorsSection />
            </section>
            
            <section>
                <FAQSection />
            </section>
            
            <section id='contact'>
                <AskQuestionsSection />
            </section>
        </div>
    )
}
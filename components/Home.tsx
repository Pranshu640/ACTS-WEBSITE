import React, { useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import AnimatedBackground from "@/components/ui/animation";
import WordListSwap from "@/components/ui/ACTS_text";
import { LayoutGroup, motion } from 'framer-motion';
import FancyButton from "@/components/ui/Button_gay";
import Link from "next/link"

export default function HeroSection() {
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        return () => {
            // Cleanup
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
        };
    }, []);

    return (
        <section className="relative min-h-screen bg-gradient-to-l from-purple-900 via-black to-black overflow-hidden">
            <div className="absolute inset-0 z-0">
                <AnimatedBackground>
                    <div className="flex flex-col lg:flex-row items-center justify-between h-screen px-4 sm:px-6 lg:px-16 py-8 lg:py-0">
                        {/* Text Content - Mobile First, Desktop Left */}
                        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center order-2 lg:order-1 mt-4 lg:mt-0">
                            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-4xl font-normal text-center mb-2 sm:mb-4">
                                Step into
                            </h1>

                            <h1
                                className="bg-gradient-to-r from-indigo-700 to-blue-500 bg-clip-text text-transparent text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[10rem] font-bold text-center text-shadow-lg mb-4 sm:mb-6 lg:mb-8"
                                style={{
                                    fontFamily: '"Orbitron", cursive, monospace',
                                    fontWeight: '900',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                ACTS
                            </h1>

                            <LayoutGroup>
                                <motion.p className="flex flex-wrap items-center justify-center text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-8 sm:mb-10 lg:mb-12" layout={true}>
                                    <motion.span
                                        className="text-white/80 mr-2"
                                        layout={true}
                                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                    >
                                        Empowering students through
                                    </motion.span>
                                    <WordListSwap
                                        texts={[
                                            "innovation",
                                            "collaboration",
                                            "AI & ML",
                                            "Automation",
                                            "Robotics"
                                        ]}
                                        mainClassName="text-white px-2 sm:px-3 md:px-4 bg-violet-600 overflow-hidden py-1 sm:py-1.5 md:py-2 justify-center rounded-lg"
                                        staggerFrom={"last"}
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        exit={{ y: "-120%" }}
                                        staggerDuration={0.025}
                                        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                        rotationInterval={2000}
                                    />
                                </motion.p>
                            </LayoutGroup>

                            {/* Buttons with proper spacing */}
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
                                <Link href="https://forms.gle/rXRyFKsr6RUGd7ic9">
                                    <FancyButton>
                                        <span>Become member</span>
                                    </FancyButton>
                                </Link>

                                <Link href="https://forms.gle/rXRyFKsr6RUGd7ic9">
                                    <FancyButton>
                                        <span>Partner with us</span>
                                    </FancyButton>
                                </Link>
                            </div>
                        </div>

                        {/* Lottie Animation - Mobile First, Desktop Right */}
                        <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
                            <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-[28rem] md:h-[28rem] lg:w-[30rem] lg:h-[30rem] xl:w-[35rem] xl:h-[35rem]">
                                <DotLottieReact
                                    src="https://lottie.host/5e19e70f-294d-4b4d-8be0-689fcb98f7bb/Pc5OWo9Nqt.lottie"
                                    loop
                                    autoplay
                                />
                            </div>
                        </div>
                    </div>
                </AnimatedBackground>
            </div>

            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-900/10 to-transparent pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000" />
        </section>
    );
}
'use client'
import { useState, useEffect } from "react"
import LogoTs from "@/components/LogoTs"

function AppSequence() {
    const [isAnimating, setIsAnimating] = useState(false)
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimating(true)
        }, 500)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="relative h-screen overflow-hidden bg-black">
            {/* Logo animation - always present, becomes background after animation */}
            <div className="absolute inset-0 flex items-center justify-center">
                <LogoTs isAnimating={isAnimating} onAnimationComplete={() => setShowContent(true)} />
            </div>

            {/* Overlay content after animation completes */}
            {showContent && (
                <div className="relative z-10 h-full">
                    {/* Header */}
                    <div className="flex px-56 py-7 items-center gap-10 transition-all duration-800 ease-out">
                        <nav className="py-2 border border-gray-400 bg-gray-700 rounded-lg text-white">
                            <a href="#" className="px-5 py-2 text-white text-lg">Home</a>
                            <a href="#" className="px-5 py-2 text-white">About</a>
                            <a href="#" className="px-5 py-2 text-white">Teams</a>
                            <a href="#" className="px-5 py-2 text-white">Events</a>
                            <a href="#" className="px-5 py-2 text-white">Contacts</a>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="py-24 px-32">
                        <h2 className="text-white text-4xl font-bold">ASSOCIATION OF</h2>
                        <h2 className="text-white text-4xl font-bold">COMPUTING TECHNOLOGY</h2>
                        <h2 className="text-white text-4xl font-bold">AND SCIENCE</h2>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AppSequence
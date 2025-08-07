"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useEffect, useState } from "react"

const mentors = [
    {
        name: "Dr. Neeta Singh",
        image: "/Team/neetamaam.webp",
        position: "Assistant Proffesor",
    },
    {
        name: "Dr. Amar Arora",
        image: "/Team/amarsir.webp",
        position: "Assistant Proffesor",
    },
]

export default function MentorSection() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <section className="py-24 px-4 bg-black">
            <div className="max-w-7xl mx-auto">
                <div
                    className={`text-center mb-20 transition-all duration-800 ease-out ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                >
                    <h2 className="text-5xl font-light text-white mb-4 tracking-wide">Our <span className="text-[#4e00ce]">Mentors</span></h2>
                    <div className="w-16 h-0.5 bg-white mx-auto mb-8"></div>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
                        Guiding our journey with wisdom, experience, and invaluable insights from industry leaders
                        who shape our vision and growth.
                    </p>
                </div>

                {/* Mentors Row - 2 members centered */}
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl">
                        {mentors.map((mentor, index) => (
                            <div
                                key={index}
                                className={`transition-all duration-600 ease-out ${
                                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
                                style={{ transitionDelay: `${index * 150}ms` }}
                            >
                                <Card className="bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 ease-out group border border-gray-800/50 shadow-xl rounded-2xl overflow-clip">
                                    <CardContent className="p-0">
                                        <div className="relative w-full h-96 overflow-hidden">
                                            <Image
                                                src={mentor.image || "/placeholder.svg"}
                                                alt={mentor.name}
                                                fill
                                                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                                        </div>

                                        <div className="p-8 text-center">
                                            <h3 className="text-3xl font-medium text-white mb-3 tracking-wide">{mentor.name}</h3>
                                            <p className="text-gray-400 font-light text-sm uppercase tracking-widest mb-4">{mentor.position}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
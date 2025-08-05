"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useEffect, useState } from "react"

const chairMembers = [
    {
        name: "Md Salik Inam",
        position: "Chair",
        image: "/Team/Salik-Inam.jpg",
    },
    {
        name: "Mridul Makkar",
        position: "Vice Chair",
        image: "/Team/Mridul-Makkar.jpg",
    },
    {
        name: "Harsh Kumar",
        position: "Genaral Secretary",
        image: "/Team/Harsh-Kumar.jpg",
    },
    {
        name: "Satyam Kumar",
        position: "Joint Treasurer",
        image: "/Team/Satyam-Kumar.jpg",
    },
    {
        name: "Samarth Saxena",
        position: "Treasurer",
        image: "/Team/Samarth-Saxena.jpg",
    },
    {
        name: "Kumar Nalin",
        position: "Web Chair",
        image: "/Team/Kumar-Nalin.jpeg",
    },
    {
        name: "Nistha Jha",
        position: "Media Head",
        image: "/Team/Nistha-Jha.jpeg",
    },
]

export default function LeadershipSection() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])
    const topRow = chairMembers.slice(0, 3)
    const bottomRow = chairMembers.slice(3, 7)

    return (
        <section className="py-24 px-4 bg-gradient-to-b from-black via-black to-[#4e00ce]">
            <div className="max-w-7xl mx-auto">
                <div
                    className={`text-center mb-20 transition-all duration-800 ease-out ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                >
                    <h2 className="text-5xl font-light text-white mb-4 tracking-wide">Leadership </h2>
                    <h2 className="text-5xl font-light text-white mb-4 tracking-wide text-#4e00ce">Team</h2>
                    <div className="w-16 h-0.5 bg-white mx-auto mb-8"></div>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light ">
                        Our distinguished leadership team brings decades of combined experience and expertise to guide our
                        organization forward.
                    </p>
                </div>

                {/* Top Row - 3 members centered */}
                <div className="flex justify-center mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl">
                        {topRow.map((member, index) => (
                            <div
                                key={index}
                                className={`transition-all duration-600 ease-out ${
                                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <Card className="bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 ease-out group border border-gray-800/50 shadow-xl rounded-2xl overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="relative w-full h-80 overflow-hidden">
                                            <Image
                                                src={member.image || "/placeholder.svg"}
                                                alt={member.name}
                                                fill
                                                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 grayscale group-hover:grayscale-0"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                                        </div>

                                        <div className="p-8 text-center h-[120px] flex flex-col justify-center">
                                            {" "}
                                            {/* Added h-[120px] and flex properties */}
                                            <h3 className="text-2xl font-medium text-white mb-2 tracking-wide">{member.name}</h3>
                                            <p className="text-gray-400 font-light text-sm uppercase tracking-widest">{member.position}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Row - 4 members centered */}
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl">
                        {bottomRow.map((member, index) => (
                            <div
                                key={index + 3}
                                className={`transition-all duration-600 ease-out ${
                                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
                                style={{ transitionDelay: `${(index + 3) * 100}ms` }}
                            >
                                <Card className="bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 ease-out group border border-gray-800/50 shadow-xl rounded-2xl overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="relative w-full h-80 overflow-hidden">
                                            <Image
                                                src={member.image || "/placeholder.svg"}
                                                alt={member.name}
                                                fill
                                                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 grayscale group-hover:grayscale-0"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                                        </div>

                                        <div className="p-8 text-center h-[120px] flex flex-col justify-center">
                                            {" "}
                                            {/* Added h-[120px] and flex properties */}
                                            <h3 className="text-2xl font-medium text-white mb-2 tracking-wide">{member.name}</h3>
                                            <p className="text-gray-400 font-light text-sm uppercase tracking-widest">{member.position}</p>
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

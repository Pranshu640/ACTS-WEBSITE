"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useEffect, useState } from "react"

const chairMembers = [
    {
        name: "Md Salik Inam",
        position: "Chair",
        image: "/Team/Salik-Inam.jpg",
        linkedin: "google.com",
    },
    {
        name: "Mridul Makkar",
        position: "Vice Chair",
        image: "/Team/Mridul-Makkar.jpg",
        linkedin: "google.com",
    },
    {
        name: "Harsh Kumar",
        position: "Genaral Secretary",
        image: "/Team/Harsh-Kumar.jpg",
        linkedin: "google.com",
    },
    {
        name: "Satyam Kumar",
        position: "Joint Secretary",
        image: "/Team/Satyam-Kumar.jpg",
        linkedin: "google.com",
    },
    {
        name: "Samarth Saxena",
        position: "Treasurer",
        image: "/Team/Samarth-Saxena.jpg",
        linkedin: "google.com",
    },
    {
        name: "Kumar Nalin",
        position: "Web Chair",
        image: "/Team/Kumar-Nalin.jpeg",
        linkedin: "google.com",
    },
    {
        name: "Nistha Jha",
        position: "Media Head",
        image: "/Team/Nistha-Jha.jpeg",
        linkedin: "google.com",
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
                    <h2 className="text-5xl font-light text-[#4e00ce] mb-4 tracking-wide">Team</h2>
                    <div className="w-16 h-0.5 bg-white mx-auto mb-8"></div>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
                        Our distinguished leadership team brings expertise to guide our
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
                                <Card className="bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 ease-out group border border-gray-800/50 shadow-xl rounded-2xl overflow-clip cursor-pointer">
                                    <CardContent className="p-0">
                                        <div className="relative w-full h-80 overflow-hidden">
                                            <Image
                                                src={member.image || "/placeholder.svg"}
                                                alt={member.name}
                                                fill
                                                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                                        </div>

                                        <div className="p-7 text-center">
                                            <h3 className="text-2xl font-medium text-white mb-2 tracking-wide">{member.name}</h3>
                                            <p className="text-gray-400 font-light text-sm uppercase tracking-widest mb-4">{member.position}</p>
                                            <a
                                                href={member.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center px-4 py-2 bg-[#0077b5] hover:bg-[#005885] text-white text-sm font-medium rounded-md transition-all duration-300 hover:shadow-lg hover:scale-105"
                                            >
                                                <span className="mr-2">in Connect</span>

                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Row - 4 members */}
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl">
                        {bottomRow.map((member, index) => (
                            <div
                                key={index + 3}
                                className={`transition-all duration-600 ease-out ${
                                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
                                style={{ transitionDelay: `${(index + 3) * 100}ms` }}
                            >
                                <Card className="bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 ease-out group border border-gray-800/50 shadow-xl rounded-2xl overflow-clip cursor-pointer">
                                    <CardContent className="p-0">
                                        <div className="relative w-full h-80 overflow-hidden">
                                            <Image
                                                src={member.image || "/placeholder.svg"}
                                                alt={member.name}
                                                fill
                                                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                                        </div>

                                        <div className="p-4 text-center h-[140px]">
                                            <h3 className="text-2xl font-medium text-white mb-2 tracking-wide">{member.name}</h3>
                                            <p className="text-gray-400 font-light text-sm uppercase tracking-widest mb-4">{member.position}</p>
                                            <a
                                                href={member.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center px-4 py-2 bg-[#0077b5] hover:bg-[#005885] text-white text-sm font-medium rounded-md transition-all duration-300 hover:shadow-lg hover:scale-105"
                                            >
                                                <span className="mr-2">in Connect</span>

                                            </a>
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
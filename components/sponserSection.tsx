"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const sponsors = [
    {
        name: "AUITS",
        image: "/Sponsors/AUITS.png",
    },
    {
        name: "Balsamiq",
        image: "/Sponsors/balsamiq.png",
    },
    {
        name: "Bifrost",
        image: "/Sponsors/Bifrost.png",
    },
    {
        name: "Code Crafters",
        image: "/Sponsors/CodeCrafters.png",
    },
    {
        name: "Interview Buddy",
        image: "/Sponsors/InterviewBuddy.png",
    },
    {
        name: "Potpie AI",
        image: "/Sponsors/Potpie.ai.png",
    },
    {
        name: "Raga AI",
        image: "/Sponsors/RagaAI.png",
    },
    {
        name: "Sprint.dev",
        image: "/Sponsors/SprintDev.png",
    },
    {
        name: "Yocto",
        image: "/Sponsors/Yocto.png",
    }
]

export default function SponsorsSection() {
    const duplicatedSponsors = [...sponsors, ...sponsors]

    return (
        <section className="py-16 px-4 bg-black overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-light text-white mb-4 tracking-wide">Our Partners & Sponsors</h2>
                    <div className="w-16 h-0.5 bg-white mx-auto"></div>
                </div>

                <div className="relative">
                    <div className="flex animate-scroll space-x-6">
                        {duplicatedSponsors.map((sponsor, index) => (
                            <Card
                                key={index}
                                className="flex-shrink-0 w-56 h-32 bg-white/10 backdrop-blur-sm border border-gray-800/50 rounded-xl shadow-xl hover:bg-white/20 transition-all duration-300 group flex items-center justify-center"
                            >
                                <CardContent className="p-1 w-full h-full flex items-center justify-center">
                                    <div className="relative w-full h-full scale-[3]">
                                        <Image
                                            src={sponsor.image || "/placeholder.svg"}
                                            alt={sponsor.name}
                                            fill
                                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-scroll {
                    animation: scroll 20s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    )
}
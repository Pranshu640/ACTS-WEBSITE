"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, MapPin, Play, Pause, CheckCircle, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Event, EventStatus } from "@/types/event"

export default function TimelineSection() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
    const [scrollProgress, setScrollProgress] = useState(0)
    const [currentVisibleNode, setCurrentVisibleNode] = useState<number>(-1)
    const [isMobile, setIsMobile] = useState(false)
    const timelineRef = useRef<HTMLDivElement>(null)
    const itemRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        fetchEvents()
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
    }

    const fetchEvents = async () => {
        try {
            const response = await fetch("/api/events")
            if (response.ok) {
                const data = await response.json()
                const eventsWithSides = data.map((event: Event, index: number) => ({
                    ...event,
                    side: index % 2 === 0 ? "left" : "right",
                }))
                setEvents(eventsWithSides)
            }
        } catch (error) {
            console.error("Failed to fetch events:", error)
            setEvents([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            if (!timelineRef.current) return

            const timelineRect = timelineRef.current.getBoundingClientRect()
            const viewportHeight = window.innerHeight
            const newVisibleItems = new Set<number>()
            let highestVisibleIndex = -1

            itemRefs.current.forEach((ref, index) => {
                if (ref) {
                    const itemRect = ref.getBoundingClientRect()

                    if (itemRect.top < viewportHeight * 0.85 && itemRect.bottom > viewportHeight * 0.15) {
                        newVisibleItems.add(index)
                        highestVisibleIndex = Math.max(highestVisibleIndex, index)
                    }
                }
            })

            setVisibleItems(newVisibleItems)
            setCurrentVisibleNode(highestVisibleIndex)

            const timelineTop = timelineRect.top
            const timelineHeight = timelineRect.height
            const scrolled = Math.max(0, -timelineTop)
            const maxScroll = timelineHeight - viewportHeight

            if (maxScroll > 0) {
                const progress = Math.min(1, Math.max(0, scrolled / maxScroll))
                setScrollProgress(progress)
            } else {
                setScrollProgress(timelineTop <= 0 ? 1 : 0)
            }
        }

        const throttledScroll = () => {
            requestAnimationFrame(handleScroll)
        }

        window.addEventListener("scroll", throttledScroll, { passive: true })
        handleScroll()

        return () => window.removeEventListener("scroll", throttledScroll)
    }, [events])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const getStatusIcon = (status: EventStatus) => {
        switch (status) {
            case "upcoming":
                return <Clock className="w-3 h-3" />
            case "live":
                return <Play className="w-3 h-3" />
            case "ongoing":
                return <Pause className="w-3 h-3" />
            case "completed":
                return <CheckCircle className="w-3 h-3" />
        }
    }

    const getStatusColor = (status: EventStatus) => {
        switch (status) {
            case "upcoming":
                return "bg-blue-900/30 text-blue-300 border-blue-800/50"
            case "live":
                return "bg-red-900/30 text-red-300 border-red-800/50"
            case "ongoing":
                return "bg-yellow-900/30 text-yellow-300 border-yellow-800/50"
            case "completed":
                return "bg-green-900/30 text-green-300 border-green-800/50"
        }
    }

    const getStatusText = (status: EventStatus) => {
        return status.charAt(0).toUpperCase() + status.slice(1)
    }

    if (loading) {
        return (
            <section className="py-12 sm:py-16 lg:py-24 px-4 bg-black h-screen">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white font-light text-sm sm:text-base">Loading our journey...</p>
                </div>
            </section>
        )
    }

    return (
        <section className="relative py-12 sm:py-16 lg:py-24 px-4 bg-black overflow-hidden">
            {/* Gradient Background Orbs - Responsive sizing */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Purple/Pink Orb - Top Left */}
                <div
                    className="absolute -top-40 sm:-top-60 lg:-top-90 -left-20 sm:-left-40 lg:-left-60 w-48 h-48 sm:w-80 sm:h-80 lg:w-[32rem] lg:h-[32rem] rounded-full opacity-15 sm:opacity-20 lg:opacity-25 blur-2xl sm:blur-3xl animate-pulse"
                    style={{
                        background: "radial-gradient(circle, rgba(147, 51, 234, 0.8) 0%, rgba(236, 72, 153, 0.6) 35%, rgba(59, 7, 100, 0.3) 70%, transparent 100%)",
                        animationDuration: "8s"
                    }}
                ></div>

                {/* Blue/Cyan Orb - Top Right */}
                <div
                    className="absolute -top-20 sm:-top-40 -right-40 sm:-right-60 lg:-right-80 w-48 h-48 sm:w-80 sm:h-80 lg:w-[32rem] lg:h-[32rem] rounded-full opacity-10 sm:opacity-15 lg:opacity-20 blur-2xl sm:blur-3xl animate-pulse"
                    style={{
                        background: "radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(34, 211, 238, 0.6) 35%, rgba(30, 58, 138, 0.3) 70%, transparent 100%)",
                        animationDuration: "8s",
                        animationDelay: "2s"
                    }}
                ></div>

                {/* Emerald/Teal Orb - Middle Left */}
                <div
                    className="absolute top-1/4 -left-40 sm:-left-60 lg:-left-80 w-64 h-64 sm:w-96 sm:h-96 lg:w-[48rem] lg:h-[48rem] rounded-full opacity-13 sm:opacity-18 lg:opacity-23 blur-2xl sm:blur-3xl animate-pulse"
                    style={{
                        background: "radial-gradient(circle, rgba(16, 185, 129, 0.8) 0%, rgba(45, 212, 191, 0.6) 25%, rgba(6, 78, 59, 0.3) 70%, transparent 100%)",
                        animationDuration: "8s",
                        animationDelay: "4s"
                    }}
                ></div>

                {/* Orange/Red Orb - Middle Right */}
                <div
                    className="absolute top-1/2 -right-20 sm:-right-40 lg:-right-60 w-48 h-48 sm:w-80 sm:h-80 lg:w-[32rem] lg:h-[32rem] rounded-full opacity-11 sm:opacity-16 lg:opacity-21 blur-2xl sm:blur-3xl animate-pulse"
                    style={{
                        background: "radial-gradient(circle, rgba(249, 115, 22, 0.8) 0%, rgba(239, 68, 68, 0.6) 35%, rgba(153, 27, 27, 0.3) 70%, transparent 100%)",
                        animationDuration: "8s",
                        animationDelay: "1s"
                    }}
                ></div>

                {/* Yellow/Amber Orb - Bottom Left */}
                <div
                    className="absolute -bottom-30 sm:-bottom-40 lg:-bottom-60 -left-20 sm:-left-40 w-48 h-48 sm:w-80 sm:h-80 lg:w-[32rem] lg:h-[32rem] rounded-full opacity-9 sm:opacity-14 lg:opacity-19 blur-2xl sm:blur-3xl animate-pulse"
                    style={{
                        background: "radial-gradient(circle, rgba(234, 179, 8, 0.8) 0%, rgba(245, 158, 11, 0.6) 35%, rgba(146, 64, 14, 0.3) 70%, transparent 100%)",
                        animationDuration: "8s",
                        animationDelay: "5s"
                    }}
                ></div>

                {/* Violet/Fuchsia Orb - Bottom Right */}
                <div
                    className="absolute -bottom-40 sm:-bottom-60 lg:-bottom-80 -right-30 sm:-right-40 lg:-right-60 w-48 h-48 sm:w-80 sm:h-80 lg:w-[32rem] lg:h-[32rem] rounded-full opacity-12 sm:opacity-17 lg:opacity-22 blur-2xl sm:blur-3xl animate-pulse"
                    style={{
                        background: "radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, rgba(168, 85, 247, 0.6) 35%, rgba(67, 56, 202, 0.3) 70%, transparent 100%)",
                        animationDuration: "8s",
                        animationDelay: "3s"
                    }}
                ></div>
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10">
                <div className="max-w-6xl mx-auto mt-4">
                    {/* Header - Responsive typography */}
                    <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-3 sm:mb-4 tracking-wide">
                            Our Journey
                        </h2>
                        <div className="w-12 sm:w-16 h-0.5 bg-white mx-auto mb-6 sm:mb-8"></div>
                        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light px-4">
                            Discover the milestones that have shaped our professional community and driven our success.
                        </p>
                    </div>

                    {events.length === 0 ? (
                        <div className="text-center py-8 sm:py-12">
                            <p className="text-gray-400 text-base sm:text-lg font-light">No events available at the moment.</p>
                        </div>
                    ) : (
                        <div ref={timelineRef} className="relative">
                            {/* Timeline Line - Responsive positioning */}
                            <div className={`absolute ${isMobile ? 'left-6' : 'left-1/2 transform -translate-x-1/2'} w-0.5 bg-gray-800 h-full`}>
                                <div
                                    className="w-full bg-gradient-to-b from-white via-gray-300 to-gray-500 transition-all duration-700 ease-out"
                                    style={{
                                        height: `${scrollProgress * 100}%`,
                                        transformOrigin: "top",
                                    }}
                                />
                            </div>

                            <div className="space-y-8 sm:space-y-12 lg:space-y-16">
                                {events.map((event: Event, index: number) => (
                                    <div
                                        key={event.id}
                                        ref={(ref) => { itemRefs.current[index] = ref }}
                                        className={`relative flex items-center ${isMobile
                                                ? 'justify-start pl-16'
                                                : index % 2 === 0
                                                    ? "justify-start"
                                                    : "justify-end"
                                            }`}
                                    >
                                        {/* Timeline Node - Responsive positioning */}
                                        <div className={`absolute ${isMobile ? 'left-6' : 'left-1/2'} transform ${isMobile ? '' : '-translate-x-1/2'} z-10`}>
                                            <div
                                                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 sm:border-4 border-black transition-all duration-700 ease-out ${index <= currentVisibleNode
                                                        ? "bg-white scale-125 sm:scale-150 shadow-lg shadow-white/30"
                                                        : "bg-gray-600 scale-100"
                                                    }`}
                                                style={{
                                                    transitionDelay: `${index * 100}ms`,
                                                }}
                                            />
                                        </div>

                                        <div
                                            className={`${isMobile
                                                    ? 'w-full'
                                                    : 'w-full sm:w-5/12'
                                                } ${!isMobile && index % 2 === 0
                                                    ? "mr-auto pr-4 sm:pr-8 lg:pr-12"
                                                    : !isMobile && index % 2 !== 0
                                                        ? "ml-auto pl-4 sm:pl-8 lg:pl-12"
                                                        : ""
                                                }
                                          transform transition-all duration-800 ease-out ${visibleItems.has(index)
                                                    ? "translate-y-0 opacity-100 scale-100"
                                                    : isMobile
                                                        ? "translate-x-8 opacity-0 scale-95"
                                                        : `${index % 2 === 0 ? "-translate-x-8 sm:-translate-x-12" : "translate-x-8 sm:translate-x-12"} opacity-0 scale-95`
                                                }`}
                                            style={{
                                                transitionDelay: `${index * 150}ms`,
                                            }}
                                        >
                                            <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl sm:rounded-2xl shadow-xl hover:bg-gray-900/70 transition-all duration-500 group overflow-hidden">
                                                <CardContent className="p-0">
                                                    {/* Image - Responsive height */}
                                                    <div className="relative h-32 sm:h-40 lg:h-48 overflow-hidden">
                                                        <Image
                                                            src={event.image || "/placeholder.svg"}
                                                            alt={event.title}
                                                            fill
                                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                                                    </div>

                                                    {/* Content - Responsive padding */}
                                                    <div className="p-4 sm:p-5 lg:p-6">
                                                        {/* Meta information - Responsive layout */}
                                                        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
                                                            <div className="flex items-center text-gray-400 text-xs sm:text-sm">
                                                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                                                <span className="font-light">{formatDate(event.date)}</span>
                                                            </div>

                                                            {event.location && (
                                                                <div className="flex items-center text-gray-400 text-xs sm:text-sm">
                                                                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                                                    <span className="font-light break-words">{event.location}</span>
                                                                </div>
                                                            )}

                                                            {/* Status Badge - Responsive sizing */}
                                                            <div className={`px-2 py-1 rounded-full border text-xs font-light flex items-center space-x-1 ${getStatusColor(event.status)}`}>
                                                                {getStatusIcon(event.status)}
                                                                <span>{getStatusText(event.status)}</span>
                                                            </div>
                                                        </div>

                                                        {/* Title - Responsive typography */}
                                                        <h3 className="text-lg sm:text-xl lg:text-2xl font-light text-white mb-2 sm:mb-3 tracking-wide leading-tight">
                                                            {event.title}
                                                        </h3>

                                                        {/* Description - Responsive typography */}
                                                        <p className="text-gray-300 leading-relaxed font-light mb-4 sm:mb-5 lg:mb-6 text-sm sm:text-base">
                                                            {event.description}
                                                        </p>

                                                        {/* Button - Responsive sizing */}
                                                        <Link href={`/events/${event.slug}`}>
                                                            <Button className="bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl group text-sm sm:text-base w-full sm:w-auto">
                                                                <span className="font-light">Learn More</span>
                                                                <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
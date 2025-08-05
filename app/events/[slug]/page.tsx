"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, MapPin, Share2, Play, Pause, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Event, EventStatus } from "@/types/event"

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)
    const [eventSlug, setEventSlug] = useState<string>("")

    useEffect(() => {
        const getParams = async () => {
            const resolvedParams = await params
            setEventSlug(resolvedParams.slug)
        }
        getParams()
    }, [params])

    useEffect(() => {
        if (eventSlug) {
            fetchEvent()
        }
    }, [eventSlug])

    const fetchEvent = async () => {
        try {
            const response = await fetch("/api/events")
            if (response.ok) {
                const events = await response.json()
                const foundEvent = events.find((e: Event) => e.slug === eventSlug)
                setEvent(foundEvent || null)
            }
        } catch (error) {
            console.error("Failed to fetch event:", error)
        } finally {
            setLoading(false)
        }
    }

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
                return <Clock className="w-4 h-4" />
            case "live":
                return <Play className="w-4 h-4" />
            case "ongoing":
                return <Pause className="w-4 h-4" />
            case "completed":
                return <CheckCircle className="w-4 h-4" />
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

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: event?.title,
                    text: event?.description,
                    url: window.location.href,
                })
            } catch (error) {
                console.log("Error sharing:", error)
            }
        } else {
            navigator.clipboard.writeText(window.location.href)
            alert("Link copied to clipboard!")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center pt-16">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white">Loading event...</p>
                </div>
            </div>
        )
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center pt-16">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Event not found</h2>
                    <Link href="/ourJourney">
                        <Button className="bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Our Journey
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Header with proper spacing for main navbar */}
            <div className="relative pt-16">
                <div className="absolute top-20 left-0 right-0 z-10 p-6">
                    <div className="flex justify-between items-center max-w-6xl mx-auto">
                        <Link href="/ourJourney">
                            <Button
                                variant="outline"
                                className="bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70 hover:border-white/30 transition-all duration-300"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Journey
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            className="bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70 hover:border-white/30 transition-all duration-300"
                            onClick={handleShare}
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="relative h-[70vh] overflow-hidden">
                    <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

                    {/* Event Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="max-w-6xl mx-auto">
                            <h1 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-wide">{event.title}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-white/80">
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    <span className="font-light">{formatDate(event.date)}</span>
                                </div>
                                {event.location && (
                                    <div className="flex items-center">
                                        <MapPin className="w-5 h-5 mr-2" />
                                        <span className="font-light">{event.location}</span>
                                    </div>
                                )}
                                {event.featured && (
                                    <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm font-light">
                                        Featured Event
                                    </div>
                                )}
                                {/* Status Badge */}
                                <div
                                    className={`px-3 py-1 rounded-full border text-sm font-light flex items-center space-x-2 ${getStatusColor(event.status)}`}
                                >
                                    {getStatusIcon(event.status)}
                                    <span>{getStatusText(event.status)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 shadow-xl">
                            <CardContent className="p-8">
                                {/* Description */}
                                <div className="mb-8">
                                    <h2 className="text-2xl font-light text-white mb-6 tracking-wide">About This Event</h2>
                                    <p className="text-gray-300 text-lg leading-relaxed font-light">{event.description}</p>
                                </div>

                                {/* Full Content */}
                                {event.content && (
                                    <div className="border-t border-gray-800/50 pt-8">
                                        <h2 className="text-2xl font-light text-white mb-6 tracking-wide">Event Details</h2>
                                        <div className="text-gray-300 leading-relaxed font-light whitespace-pre-wrap">{event.content}</div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 shadow-xl sticky top-24">
                            <CardContent className="p-8">
                                <h3 className="text-xl font-light text-white mb-6 tracking-wide">Event Information</h3>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">Date</h4>
                                        <p className="text-white font-light">{formatDate(event.date)}</p>
                                    </div>

                                    {event.location && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">Location</h4>
                                            <p className="text-white font-light">{event.location}</p>
                                        </div>
                                    )}

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">Status</h4>
                                        <div className={`flex items-center px-3 py-2 rounded-lg border ${getStatusColor(event.status)}`}>
                                            {getStatusIcon(event.status)}
                                            <span className="ml-2 font-light">{getStatusText(event.status)}</span>
                                        </div>
                                    </div>

                                    {event.featured && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">Featured</h4>
                                            <div className="px-3 py-1 bg-blue-900/30 border border-blue-800/50 rounded-lg text-blue-300 text-sm font-light inline-block">
                                                Highlighted Event
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-gray-800/50 pt-6 mt-8">
                                    <Button
                                        onClick={handleShare}
                                        className="w-full bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                                    >
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share Event
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

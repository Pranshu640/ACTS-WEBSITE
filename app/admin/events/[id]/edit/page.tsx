"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import type { Event, UpdateEventData, EventStatus } from "@/types/event"
import AdminAuthWrapper from "@/components/admin-auth-wrapper"
import AdminNavbar from "@/components/admin-navbar"
import ImageUpload from "@/components/image-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function EditEventContent({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [event, setEvent] = useState<Event | null>(null)
    const [formData, setFormData] = useState<Partial<UpdateEventData>>({})
    const [eventId, setEventId] = useState<string>("")

    useEffect(() => {
        const getParams = async () => {
            const resolvedParams = await params
            setEventId(resolvedParams.id)
        }
        getParams()
    }, [params])

    const fetchEvent = useCallback(async () => {
        try {
            const response = await fetch(`/api/events/${eventId}`)
            if (response.ok) {
                const eventData = await response.json()
                setEvent(eventData)
                setFormData({
                    title: eventData.title,
                    date: eventData.date,
                    description: eventData.description,
                    image: eventData.image,
                    location: eventData.location || "",
                    content: eventData.content || "",
                    featured: eventData.featured || false,
                    status: eventData.status,
                })
            } else {
                console.error("Event not found")
                router.push("/admin")
            }
        } catch (error) {
            console.error("Failed to fetch event:", error)
            router.push("/admin")
        } finally {
            setFetching(false)
        }
    }, [eventId, router])

    useEffect(() => {
        if (eventId) {
            fetchEvent()
        }
    }, [eventId, fetchEvent])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Filter out undefined values and empty strings
            const cleanFormData = Object.entries(formData).reduce((acc, [key, value]) => {
                if (value !== undefined && value !== "") {
                    acc[key] = value
                }
                return acc
            }, {} as Record<string, unknown>)

            const response = await fetch(`/api/events/${eventId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cleanFormData),
            })

            if (response.ok) {
                router.push("/admin")
            } else {
                const errorData = await response.json()
                console.error("Failed to update event:", errorData)
                alert("Failed to update event. Please try again.")
            }
        } catch (error) {
            console.error("Failed to update event:", error)
            alert("Failed to update event. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: keyof UpdateEventData, value: string | boolean | EventStatus) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    if (fetching) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white">Loading event...</p>
                </div>
            </div>
        )
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Event not found</h2>
                    <Link href="/admin">
                        <Button className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700">
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black">
            <AdminNavbar />
            <div className="pt-16">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex items-center space-x-4 mb-8">
                        <Link href="/admin">
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Edit Event</h1>
                            <p className="text-gray-400 mt-2">Update event details</p>
                        </div>
                    </div>

                    {/* Form */}
                    <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50">
                        <CardHeader>
                            <CardTitle className="text-white">Event Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-gray-300 font-light">
                                            Event Title *
                                        </Label>
                                        <Input
                                            id="title"
                                            value={formData.title || ""}
                                            onChange={(e) => handleChange("title", e.target.value)}
                                            placeholder="Enter event title"
                                            className="bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date" className="text-gray-300 font-light">
                                            Event Date *
                                        </Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={formData.date || ""}
                                            onChange={(e) => handleChange("date", e.target.value)}
                                            className="bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-gray-300 font-light">
                                            Location
                                        </Label>
                                        <Input
                                            id="location"
                                            value={formData.location || ""}
                                            onChange={(e) => handleChange("location", e.target.value)}
                                            placeholder="Event location"
                                            className="bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status" className="text-gray-300 font-light">
                                            Status
                                        </Label>
                                        <Select
                                            value={formData.status || "upcoming"}
                                            onValueChange={(value: EventStatus) => handleChange("status", value)}
                                        >
                                            <SelectTrigger className="bg-gray-800/30 border-gray-700/50 text-white focus:border-gray-600">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-900 border-gray-800">
                                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                                <SelectItem value="live">Live</SelectItem>
                                                <SelectItem value="ongoing">Ongoing</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <ImageUpload
                                    value={formData.image || ""}
                                    onChange={(url) => handleChange("image", url)}
                                    disabled={loading}
                                />

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-gray-300 font-light">
                                        Short Description *
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description || ""}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                        placeholder="Brief description for timeline view"
                                        rows={3}
                                        className="bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 resize-none"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content" className="text-gray-300 font-light">
                                        Full Content
                                    </Label>
                                    <Textarea
                                        id="content"
                                        value={formData.content || ""}
                                        onChange={(e) => handleChange("content", e.target.value)}
                                        placeholder="Detailed content for event page"
                                        rows={6}
                                        className="bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 resize-none"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="featured"
                                        checked={formData.featured || false}
                                        onCheckedChange={(checked) => handleChange("featured", checked)}
                                    />
                                    <Label htmlFor="featured" className="text-gray-300 font-light">
                                        Featured Event
                                    </Label>
                                </div>

                                <div className="flex justify-end space-x-4 pt-6">
                                    <Link href="/admin">
                                        <Button
                                            variant="outline"
                                            type="button"
                                            className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                                        >
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Update Event
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <AdminAuthWrapper>
            <EditEventContent params={params} />
        </AdminAuthWrapper>
    )
}

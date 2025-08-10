"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save } from "lucide-react"
import type { CreateEventData, EventStatus } from "@/types/event"
import AdminAuthWrapper from "@/components/admin-auth-wrapper"
import AdminNavbar from "@/components/admin-navbar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUpload from "@/components/image-upload"

function NewEventContent() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<CreateEventData>({
        title: "",
        date: "",
        description: "",
        image: "",
        location: "",
        content: "",
        featured: false,
        status: "upcoming",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                router.push("/admin")
            } else {
                console.error("Failed to create event")
            }
        } catch (error) {
            console.error("Failed to create event:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: keyof CreateEventData, value: string | boolean | EventStatus) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    return (
        <div className="min-h-screen bg-black">
            <AdminNavbar />
            <div className="pt-16">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-light text-white tracking-wide">Create New Event</h1>
                        <p className="text-gray-400 mt-2 font-light">Add a new event to your timeline</p>
                    </div>

                    <Card className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/30">
                        <CardHeader>
                            <CardTitle className="text-white font-light tracking-wide">Event Details</CardTitle>
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
                                            value={formData.title}
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
                                            value={formData.date}
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
                                            value={formData.location}
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
                                            value={formData.status}
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

                                <ImageUpload value={formData.image} onChange={(url) => handleChange("image", url)} disabled={loading} />

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-gray-300 font-light">
                                        Short Description *
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
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
                                        value={formData.content}
                                        onChange={(e) => handleChange("content", e.target.value)}
                                        placeholder="Detailed content for event page"
                                        rows={6}
                                        className="bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 resize-none"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="featured"
                                        checked={formData.featured}
                                        onCheckedChange={(checked) => handleChange("featured", checked)}
                                    />
                                    <Label htmlFor="featured" className="text-gray-300 font-light">
                                        Featured Event
                                    </Label>
                                </div>

                                <div className="flex justify-end space-x-4 pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push("/admin")}
                                        className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Create Event
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

export default function NewEventPage() {
    return (
        <AdminAuthWrapper>
            <NewEventContent />
        </AdminAuthWrapper>
    )
}

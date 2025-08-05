"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Calendar, MapPin, Eye, Play, Pause, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Event, EventStatus } from "@/types/event"
import AdminAuthWrapper from "@/components/admin-auth-wrapper"
import AdminNavbar from "@/components/admin-navbar"
import { autoUpdateEventStatuses } from "@/lib/events"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function AdminDashboardContent() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [autoUpdate, setAutoUpdate] = useState(true)

    useEffect(() => {
        fetchEvents()

        // Auto-update statuses every minute if enabled
        const interval = setInterval(() => {
            if (autoUpdate) {
                autoUpdateEventStatuses()
                fetchEvents()
            }
        }, 60000)

        return () => clearInterval(interval)
    }, [autoUpdate])

    const fetchEvents = async () => {
        try {
            const response = await fetch("/api/events")
            if (response.ok) {
                const data = await response.json()
                setEvents(data)
            }
        } catch (error) {
            console.error("Failed to fetch events:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        setDeleting(id)
        try {
            const response = await fetch(`/api/events/${id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                setEvents(events.filter((event) => event.id !== id))
            } else {
                console.error("Failed to delete event")
            }
        } catch (error) {
            console.error("Failed to delete event:", error)
        } finally {
            setDeleting(null)
        }
    }

    const handleStatusChange = async (eventId: string, newStatus: EventStatus) => {
        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            })

            if (response.ok) {
                setEvents(events.map((event) => (event.id === eventId ? { ...event, status: newStatus } : event)))
            }
        } catch (error) {
            console.error("Failed to update status:", error)
        }
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black">
                <AdminNavbar />
                <div className="pt-16 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-white font-light">Loading events...</p>
                    </div>
                </div>
            </div>
        )
    }

    const statusCounts = {
        upcoming: events.filter((e) => e.status === "upcoming").length,
        live: events.filter((e) => e.status === "live").length,
        ongoing: events.filter((e) => e.status === "ongoing").length,
        completed: events.filter((e) => e.status === "completed").length,
    }

    return (
        <div className="min-h-screen bg-black">
            <AdminNavbar />
            <div className="pt-16">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-light text-white tracking-wide">Event Management</h1>
                            <p className="text-gray-400 mt-1 font-light">Manage your ACTS events and timeline</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400 font-light">Auto-update:</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAutoUpdate(!autoUpdate)}
                                    className={`${
                                        autoUpdate
                                            ? "bg-green-900/30 border-green-800/50 text-green-300"
                                            : "bg-gray-800/30 border-gray-700/50 text-gray-400"
                                    } transition-all duration-300`}
                                >
                                    {autoUpdate ? "ON" : "OFF"}
                                </Button>
                            </div>
                            <Link href="/admin/events/new">
                                <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-all duration-300">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Event
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/30">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-light text-gray-400 uppercase tracking-wide">Upcoming</p>
                                        <p className="text-2xl font-light text-blue-300">{statusCounts.upcoming}</p>
                                    </div>
                                    <Clock className="w-8 h-8 text-blue-400/50" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/30">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-light text-gray-400 uppercase tracking-wide">Live</p>
                                        <p className="text-2xl font-light text-red-300">{statusCounts.live}</p>
                                    </div>
                                    <Play className="w-8 h-8 text-red-400/50" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/30">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-light text-gray-400 uppercase tracking-wide">Ongoing</p>
                                        <p className="text-2xl font-light text-yellow-300">{statusCounts.ongoing}</p>
                                    </div>
                                    <Pause className="w-8 h-8 text-yellow-400/50" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/30">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-light text-gray-400 uppercase tracking-wide">Completed</p>
                                        <p className="text-2xl font-light text-green-300">{statusCounts.completed}</p>
                                    </div>
                                    <CheckCircle className="w-8 h-8 text-green-400/50" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Events List */}
                    <Card className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/30">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-white font-light tracking-wide">All Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {events.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-light text-white mb-2 tracking-wide">No events yet</h3>
                                    <p className="text-gray-400 mb-6 font-light">Get started by creating your first event</p>
                                    <Link href="/admin/events/new">
                                        <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Event
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {events.map((event) => (
                                        <div
                                            key={event.id}
                                            className="border border-gray-800/30 bg-gray-800/20 rounded-xl p-4 hover:bg-gray-800/30 transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4 flex-1">
                                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-700/30 flex-shrink-0">
                                                        <Image
                                                            src={event.image || "/placeholder.svg"}
                                                            alt={event.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <h3 className="text-lg font-light text-white truncate tracking-wide">{event.title}</h3>
                                                            {event.featured && (
                                                                <Badge className="bg-purple-900/30 text-purple-300 border border-purple-800/50 text-xs">
                                                                    Featured
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                                                            <div className="flex items-center">
                                                                <Calendar className="w-3 h-3 mr-1" />
                                                                <span className="font-light">{formatDate(event.date)}</span>
                                                            </div>
                                                            {event.location && (
                                                                <div className="flex items-center">
                                                                    <MapPin className="w-3 h-3 mr-1" />
                                                                    <span className="font-light">{event.location}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3">
                                                    {/* Status Badge and Selector */}
                                                    <Select
                                                        value={event.status}
                                                        onValueChange={(value: EventStatus) => handleStatusChange(event.id, value)}
                                                    >
                                                        <SelectTrigger
                                                            className={`w-32 h-8 ${getStatusColor(event.status)} border text-xs font-light`}
                                                        >
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-gray-900 border-gray-800">
                                                            <SelectItem value="upcoming" className="text-blue-300 focus:bg-blue-900/30">
                                                                <div className="flex items-center space-x-2">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span>Upcoming</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="live" className="text-red-300 focus:bg-red-900/30">
                                                                <div className="flex items-center space-x-2">
                                                                    <Play className="w-3 h-3" />
                                                                    <span>Live</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="ongoing" className="text-yellow-300 focus:bg-yellow-900/30">
                                                                <div className="flex items-center space-x-2">
                                                                    <Pause className="w-3 h-3" />
                                                                    <span>Ongoing</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="completed" className="text-green-300 focus:bg-green-900/30">
                                                                <div className="flex items-center space-x-2">
                                                                    <CheckCircle className="w-3 h-3" />
                                                                    <span>Completed</span>
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center space-x-1">
                                                        <Link href={`/events/${event.slug}`}>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800/50"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/admin/events/${event.id}/edit`}>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800/50"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                                                    disabled={deleting === event.id}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="bg-gray-900 border-gray-800">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="text-white font-light">Delete Event</AlertDialogTitle>
                                                                    <AlertDialogDescription className="text-gray-300 font-light">
                                                                        Are you sure you want to delete "{event.title}"? This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
                                                                        Cancel
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(event.id)}
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default function AdminDashboard() {
    return (
        <AdminAuthWrapper>
            <AdminDashboardContent />
        </AdminAuthWrapper>
    )
}
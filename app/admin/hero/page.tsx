"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff, Home, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { HeroSlide } from "@/types/hero"
import AdminAuthWrapper from "@/components/admin-auth-wrapper"
import AdminNavbar from "@/components/admin-navbar"
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

function HeroManagementContent() {
    const [slides, setSlides] = useState<HeroSlide[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => {
        fetchSlides()
    }, [])

    const fetchSlides = async () => {
        try {
            const response = await fetch("/api/hero")
            if (response.ok) {
                const data = await response.json()
                setSlides(data)
            }
        } catch (error) {
            console.error("Failed to fetch hero slides:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        setDeleting(id)
        try {
            const response = await fetch(`/api/hero/${id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                setSlides(slides.filter((slide) => slide.id !== id))
            } else {
                console.error("Failed to delete hero slide")
            }
        } catch (error) {
            console.error("Failed to delete hero slide:", error)
        } finally {
            setDeleting(null)
        }
    }

    const handleToggleActive = async (slideId: string, active: boolean) => {
        try {
            const response = await fetch(`/api/hero/${slideId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ active }),
            })

            if (response.ok) {
                setSlides(slides.map((slide) => (slide.id === slideId ? { ...slide, active } : slide)))
            }
        } catch (error) {
            console.error("Failed to update slide status:", error)
        }
    }

    const handleReorder = async (slideId: string, direction: "up" | "down") => {
        const currentIndex = slides.findIndex((slide) => slide.id === slideId)
        if (currentIndex === -1) return

        const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
        if (newIndex < 0 || newIndex >= slides.length) return

        const newSlides = [...slides]
        const [movedSlide] = newSlides.splice(currentIndex, 1)
        newSlides.splice(newIndex, 0, movedSlide)

        // Update order values
        const updatedSlides = newSlides.map((slide, index) => ({
            ...slide,
            order: index + 1,
        }))

        setSlides(updatedSlides)

        // Send reorder request
        try {
            await fetch("/api/hero/reorder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ slideIds: updatedSlides.map((s) => s.id) }),
            })
        } catch (error) {
            console.error("Failed to reorder slides:", error)
            // Revert on error
            fetchSlides()
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black">
                <AdminNavbar />
                <div className="pt-16 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-white font-light">Loading hero slides...</p>
                    </div>
                </div>
            </div>
        )
    }

    const activeSlides = slides.filter((slide) => slide.active)

    return (
        <div className="min-h-screen bg-black">
            <AdminNavbar />
            <div className="pt-16">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-light text-white tracking-wide flex items-center">
                                <Home className="w-8 h-8 mr-3" />
                                Hero Section Management
                            </h1>
                            <p className="text-gray-400 mt-1 font-light">Manage images and titles for the home page carousel</p>
                        </div>
                        <Link href="/admin/hero/new">
                            <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-all duration-300">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Slide
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <Card className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/30">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-light text-gray-400 uppercase tracking-wide">Total Slides</p>
                                        <p className="text-2xl font-light text-white">{slides.length}</p>
                                    </div>
                                    <GripVertical className="w-8 h-8 text-gray-400/50" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/30">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-light text-gray-400 uppercase tracking-wide">Active</p>
                                        <p className="text-2xl font-light text-green-300">{activeSlides.length}</p>
                                    </div>
                                    <Eye className="w-8 h-8 text-green-400/50" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/30">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-light text-gray-400 uppercase tracking-wide">Inactive</p>
                                        <p className="text-2xl font-light text-red-300">{slides.length - activeSlides.length}</p>
                                    </div>
                                    <EyeOff className="w-8 h-8 text-red-400/50" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Hero Slides List */}
                    <Card className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/30">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-white font-light tracking-wide">Hero Slides</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {slides.length === 0 ? (
                                <div className="text-center py-12">
                                    <Home className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-light text-white mb-2 tracking-wide">No hero slides yet</h3>
                                    <p className="text-gray-400 mb-6 font-light">Create your first hero slide for the home page</p>
                                    <Link href="/admin/hero/new">
                                        <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Slide
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {slides.map((slide, index) => (
                                        <div
                                            key={slide.id}
                                            className={`border rounded-xl p-4 transition-all duration-300 ${
                                                slide.active
                                                    ? "border-gray-800/30 bg-gray-800/20 hover:bg-gray-800/30"
                                                    : "border-gray-800/20 bg-gray-800/10 opacity-60"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4 flex-1">
                                                    {/* Order Badge */}
                                                    <div className="flex flex-col items-center space-y-1">
                                                        <Badge className="bg-blue-900/30 text-blue-300 border-blue-800/50 text-xs px-2 py-1">
                                                            #{slide.order}
                                                        </Badge>
                                                        <div className="flex flex-col space-y-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleReorder(slide.id, "up")}
                                                                disabled={index === 0}
                                                                className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-800/50 disabled:opacity-30"
                                                            >
                                                                <ArrowUp className="w-3 h-3" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleReorder(slide.id, "down")}
                                                                disabled={index === slides.length - 1}
                                                                className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-800/50 disabled:opacity-30"
                                                            >
                                                                <ArrowDown className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Image */}
                                                    <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-700/30 flex-shrink-0">
                                                        <Image
                                                            src={slide.image || "/placeholder.svg?height=100&width=120&text=No+Image"}
                                                            alt={slide.title}
                                                            fill
                                                            className="object-cover"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement
                                                                target.src = "/placeholder.svg?height=100&width=120&text=Error"
                                                            }}
                                                            unoptimized
                                                        />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <h3 className="text-lg font-light text-white truncate tracking-wide">{slide.title}</h3>
                                                            {slide.active ? (
                                                                <Badge className="bg-green-900/30 text-green-300 border border-green-800/50 text-xs">
                                                                    Active
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="bg-gray-700/30 text-gray-400 border border-gray-600/50 text-xs">
                                                                    Inactive
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                                                            <span className="font-light">Link: {slide.link}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Controls */}
                                                <div className="flex items-center space-x-3">
                                                    {/* Active Toggle */}
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-xs text-gray-400">Active</span>
                                                        <Switch
                                                            checked={slide.active}
                                                            onCheckedChange={(checked) => handleToggleActive(slide.id, checked)}
                                                        />
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center space-x-1">
                                                        <Link href={`/admin/hero/${slide.id}/edit`}>
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
                                                                    disabled={deleting === slide.id}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="bg-gray-900 border-gray-800">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="text-white font-light">
                                                                        Delete Hero Slide
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription className="text-gray-300 font-light">
                                                                        Are you sure you want to delete &quot;{slide.title}&quot;? This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
                                                                        Cancel
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(slide.id)}
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

export default function HeroManagement() {
    return (
        <AdminAuthWrapper>
            <HeroManagementContent />
        </AdminAuthWrapper>
    )
}

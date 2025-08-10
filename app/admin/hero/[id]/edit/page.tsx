"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Home } from "lucide-react"
import type { HeroSlide, UpdateHeroSlideData } from "@/types/hero"
import AdminAuthWrapper from "@/components/admin-auth-wrapper"
import AdminNavbar from "@/components/admin-navbar"
import ImageUpload from "@/components/image-upload"

function EditHeroSlideContent({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [slide, setSlide] = useState<HeroSlide | null>(null)
    const [formData, setFormData] = useState<Partial<UpdateHeroSlideData>>({})
    const [previousImage, setPreviousImage] = useState<string>("")

    useEffect(() => {
        fetchSlide()
    }, [params.id])

    const fetchSlide = async () => {
        try {
            const response = await fetch(`/api/hero/${params.id}`)
            if (response.ok) {
                const slideData = await response.json()
                setSlide(slideData)
                setPreviousImage(slideData.image || "")
                setFormData({
                    title: slideData.title,
                    image: slideData.image,
                    link: slideData.link,
                    order: slideData.order,
                    active: slideData.active,
                })
            } else {
                console.error("Hero slide not found")
                router.push("/admin/hero")
            }
        } catch (error) {
            console.error("Failed to fetch hero slide:", error)
            router.push("/admin/hero")
        } finally {
            setFetching(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // If image changed and previous was uploaded file, delete it
            if (previousImage !== formData.image && previousImage?.startsWith("/uploads/")) {
                const filename = previousImage.split("/").pop()
                if (filename) {
                    try {
                        await fetch(`/api/upload/delete?filename=${filename}`, {
                            method: "DELETE",
                        })
                    } catch (error) {
                        console.error("Failed to delete previous image:", error)
                    }
                }
            }

            const response = await fetch(`/api/hero/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                router.push("/admin/hero")
            } else {
                console.error("Failed to update hero slide")
            }
        } catch (error) {
            console.error("Failed to update hero slide:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: keyof UpdateHeroSlideData, value: string | boolean | number) => {
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
                    <p className="text-white">Loading hero slide...</p>
                </div>
            </div>
        )
    }

    if (!slide) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Hero slide not found</h2>
                    <Button
                        onClick={() => router.push("/admin/hero")}
                        className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                    >
                        Back to Hero Management
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black">
            <AdminNavbar />
            <div className="pt-16">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-light text-white tracking-wide flex items-center">
                            <Home className="w-8 h-8 mr-3" />
                            Edit Hero Slide
                        </h1>
                        <p className="text-gray-400 mt-2 font-light">Update hero slide details</p>
                    </div>

                    <Card className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/30">
                        <CardHeader>
                            <CardTitle className="text-white font-light tracking-wide">Hero Slide Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-gray-300 font-light">
                                            Slide Title *
                                        </Label>
                                        <Input
                                            id="title"
                                            value={formData.title || ""}
                                            onChange={(e) => handleChange("title", e.target.value)}
                                            placeholder="Enter slide title"
                                            className="bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="link" className="text-gray-300 font-light">
                                            Link URL
                                        </Label>
                                        <Input
                                            id="link"
                                            value={formData.link || ""}
                                            onChange={(e) => handleChange("link", e.target.value)}
                                            placeholder="/ourJourney"
                                            className="bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="order" className="text-gray-300 font-light">
                                            Display Order
                                        </Label>
                                        <Input
                                            id="order"
                                            type="number"
                                            min="1"
                                            value={formData.order || 1}
                                            onChange={(e) => handleChange("order", Number.parseInt(e.target.value) || 1)}
                                            className="bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2 pt-8">
                                        <Switch
                                            id="active"
                                            checked={formData.active || false}
                                            onCheckedChange={(checked) => handleChange("active", checked)}
                                        />
                                        <Label htmlFor="active" className="text-gray-300 font-light">
                                            Active (Show on homepage)
                                        </Label>
                                    </div>
                                </div>

                                {/* Advanced Image Upload */}
                                <ImageUpload
                                    value={formData.image || ""}
                                    onChange={(value) => handleChange("image", value)}
                                    label="Hero Image (Recommended: 1200×800px)"
                                />

                                <div className="flex justify-end space-x-4 pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push("/admin/hero")}
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
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Update Slide
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

export default function EditHeroSlidePage({ params }: { params: { id: string } }) {
    return (
        <AdminAuthWrapper>
            <EditHeroSlideContent params={params} />
        </AdminAuthWrapper>
    )
}

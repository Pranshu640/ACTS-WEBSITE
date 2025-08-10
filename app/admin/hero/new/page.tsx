"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Home } from "lucide-react"
import type { CreateHeroSlideData } from "@/types/hero"
import AdminAuthWrapper from "@/components/admin-auth-wrapper"
import AdminNavbar from "@/components/admin-navbar"
import ImageUpload from "@/components/image-upload"

function NewHeroSlideContent() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<CreateHeroSlideData>({
        title: "",
        image: "",
        link: "/ourJourney",
        order: 1,
        active: true,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("/api/hero", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                router.push("/admin/hero")
            } else {
                console.error("Failed to create hero slide")
            }
        } catch (error) {
            console.error("Failed to create hero slide:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: keyof CreateHeroSlideData, value: string | boolean | number) => {
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
                        <h1 className="text-3xl font-light text-white tracking-wide flex items-center">
                            <Home className="w-8 h-8 mr-3" />
                            Create New Hero Slide
                        </h1>
                        <p className="text-gray-400 mt-2 font-light">Add a new slide to the home page carousel</p>
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
                                            value={formData.title}
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
                                            value={formData.link}
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
                                            value={formData.order}
                                            onChange={(e) => handleChange("order", Number.parseInt(e.target.value) || 1)}
                                            className="bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2 pt-8">
                                        <Switch
                                            id="active"
                                            checked={formData.active}
                                            onCheckedChange={(checked) => handleChange("active", checked)}
                                        />
                                        <Label htmlFor="active" className="text-gray-300 font-light">
                                            Active (Show on homepage)
                                        </Label>
                                    </div>
                                </div>

                                {/* Advanced Image Upload */}
                                <ImageUpload
                                    value={formData.image}
                                    onChange={(value) => handleChange("image", value)}
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
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Create Slide
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

export default function NewHeroSlidePage() {
    return (
        <AdminAuthWrapper>
            <NewHeroSlideContent />
        </AdminAuthWrapper>
    )
}

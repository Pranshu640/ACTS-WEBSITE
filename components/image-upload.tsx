"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
    value?: string
    onChange: (url: string) => void
    disabled?: boolean
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = async (file: File) => {
        if (!file) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (response.ok) {
                const { imageUrl } = await response.json()
                onChange(imageUrl)
            } else {
                const { error } = await response.json()
                alert(error || "Failed to upload image")
            }
        } catch (error) {
            console.error("Upload error:", error)
            alert("Failed to upload image")
        } finally {
            setUploading(false)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFileUpload(file)
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const file = e.dataTransfer.files?.[0]
        if (file) {
            handleFileUpload(file)
        }
    }

    const removeImage = () => {
        onChange("")
    }

    return (
        <div className="space-y-4">
            <Label className="text-gray-300 font-light">Event Image</Label>

            {value ? (
                <div className="relative">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-800/30 border border-gray-700/50">
                        <Image
                            src={value || "/placeholder.svg"}
                            alt="Event image"
                            fill
                            className="object-cover"
                            unoptimized={value?.includes("placeholder.svg")}
                        />
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                        disabled={disabled || uploading}
                        className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white border-red-600"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive ? "border-gray-400 bg-gray-800/50" : "border-gray-700/50 bg-gray-800/30"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-600"}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={disabled || uploading}
                    />

                    {uploading ? (
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
                            <p className="text-gray-300 font-light">Uploading image...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <ImageIcon className="w-12 h-12 text-gray-500 mb-4" />
                            <p className="text-gray-300 font-light mb-2">Drag and drop an image here, or click to select</p>
                            <p className="text-gray-500 text-sm font-light">Supports JPEG, PNG, WebP (max 5MB)</p>
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-4 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                                disabled={disabled}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Choose File
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <div className="text-xs text-gray-500 font-light">
                You can also paste an image URL directly in the URL field below
            </div>

            <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-gray-300 font-light">
                    Or paste image URL
                </Label>
                <Input
                    id="imageUrl"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
                    disabled={disabled || uploading}
                />
            </div>
        </div>
    )
}

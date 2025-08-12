"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { ImageIcon, AlertCircle } from "lucide-react"

interface DriveImage {
    id: string
    name: string
    thumbnailLink?: string
    webContentLink?: string
    webViewLink?: string
    mimeType?: string
}

function ImageWithFallback({
                               image,
                               className,
                               onLoad,
                               allImagesLoaded,
                           }: {
    image: DriveImage
    className: string
    onLoad?: () => void
    allImagesLoaded: boolean
}) {
    const [currentAttempt, setCurrentAttempt] = useState(0)
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [hasError, setHasError] = useState(false)

    // Optimized image URLs with better fallbacks
    const imageUrls = useMemo(() => [
        `https://drive.google.com/uc?export=view&id=${image.id}`,
        `https://drive.google.com/thumbnail?id=${image.id}&sz=w800`,
        `https://lh3.googleusercontent.com/d/${image.id}=w800`,
    ], [image.id])

    useEffect(() => {
        if (image.id && !imageSrc) {
            setImageSrc(imageUrls[0])
            setCurrentAttempt(0)
        }
    }, [image.id, imageSrc, imageUrls])

    const handleError = useCallback(() => {
        const nextAttempt = currentAttempt + 1
        if (nextAttempt < imageUrls.length) {
            setImageSrc(imageUrls[nextAttempt])
            setCurrentAttempt(nextAttempt)
        } else {
            setHasError(true)
            onLoad?.() // Count failed images as "loaded" so we don't wait forever
        }
    }, [currentAttempt, onLoad, imageUrls])

    const handleLoad = useCallback(() => {
        setHasError(false)
        onLoad?.()
    }, [onLoad])

    if (!image.id) {
        return (
            <div className="w-full aspect-[4/3] bg-black flex items-center justify-center rounded-2xl">
                <div className="text-slate-500 text-xs flex flex-col items-center gap-2">
                    <ImageIcon className="w-6 h-6 opacity-50" />
                    <span>Invalid image</span>
                </div>
            </div>
        )
    }

    if (!allImagesLoaded) {
        return (
            <div className="w-full bg-black rounded-2xl relative overflow-hidden" style={{ height: "200px" }}>
                <div className="absolute inset-0 bg-black animate-pulse" />
                {imageSrc && (
                    <Image
                        src={imageSrc || "/placeholder.svg"}
                        alt={image.name}
                        width={400}
                        height={300}
                        className="opacity-0 absolute inset-0 w-full h-full object-cover"
                        style={{ aspectRatio: "auto" }}
                        unoptimized={false}
                        onError={handleError}
                        onLoad={handleLoad}
                    />
                )}
            </div>
        )
    }

    if (hasError) {
        return (
            <div
                className="w-full bg-black flex items-center justify-center rounded-2xl group hover:bg-slate-900/50 transition-all duration-500"
                style={{ height: "200px" }}
            >
                <div className="text-center p-3">
                    <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2 group-hover:text-slate-500 transition-colors duration-300" />
                    <div className="text-slate-500 text-xs mb-1">Unavailable</div>
                    <div className="text-slate-600 text-xs truncate max-w-24">{image.name}</div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative group overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-white/20">
            <Image
                src={imageSrc || "/placeholder.svg"}
                alt={image.name}
                width={400}
                height={300}
                className={`${className} transition-all duration-300 ease-out group-hover:scale-105 group-hover:brightness-110`}
                style={{ aspectRatio: "auto" }}
                unoptimized={false}
                onError={handleError}
                onLoad={handleLoad}
            />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none" />
        </div>
    )
}

export default function VisualsPage() {
    const [images, setImages] = useState<DriveImage[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [loadedCount, setLoadedCount] = useState(0)
    const [allImagesLoaded, setAllImagesLoaded] = useState(false)

    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY
    const FOLDER_ID = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID

    const fetchImages = useCallback(async () => {
        setLoading(true)
        setError(null)

        if (!API_KEY || !FOLDER_ID) {
            setError("Missing API key or folder ID. Please check your environment variables.")
            setLoading(false)
            return
        }

        try {
            const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+trashed=false&key=${API_KEY}&fields=files(id,name,thumbnailLink,webContentLink,webViewLink,mimeType)&pageSize=100`

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                const errorText = await response.text()
                let errorMessage = `HTTP ${response.status}: `
                switch (response.status) {
                    case 403:
                        errorMessage += "API key invalid, quota exceeded, or Drive API not enabled."
                        break
                    case 404:
                        errorMessage += "Folder not found. Check if the folder ID is correct."
                        break
                    case 400:
                        errorMessage += "Bad request. Check your folder ID format."
                        break
                    default:
                        errorMessage += errorText || "Unknown error"
                }
                throw new Error(errorMessage)
            }

            const data = await response.json()

            if (!data || typeof data !== "object") {
                throw new Error("Invalid response format from Google Drive API")
            }

            if (!data.hasOwnProperty("files")) {
                throw new Error(`API response missing 'files' property. Response: ${JSON.stringify(data)}`)
            }

            if (!Array.isArray(data.files)) {
                throw new Error(`'files' property is not an array. Got: ${typeof data.files}`)
            }

            const imageFiles =
                data.files.filter((file: DriveImage) => file && file.mimeType && file.mimeType.startsWith("image/")) || []

            setImages(imageFiles)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch images"
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [API_KEY, FOLDER_ID])

    useEffect(() => {
        fetchImages()
    }, [fetchImages])

    useEffect(() => {
        if (images.length > 0 && loadedCount >= images.length) {
            setAllImagesLoaded(true)
        }
    }, [loadedCount, images.length])

    const handleRetry = () => {
        setError(null)
        fetchImages()
    }

    const handleImageLoad = useCallback(() => {
        setLoadedCount((prev) => prev + 1)
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-slate-700 border-t-white rounded-full animate-spin mx-auto"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-white text-lg font-medium">Loading Gallery</div>
                        <div className="text-slate-400 text-sm">Fetching your images...</div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="text-center space-y-6 max-w-md">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <div className="space-y-2">
                        <div className="text-white text-lg font-medium">Failed to Load</div>
                        <div className="text-slate-400 text-sm">{error}</div>
                    </div>
                    <button
                        onClick={handleRetry}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (images.length === 0) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center space-y-4">
                    <ImageIcon className="w-16 h-16 text-slate-600 mx-auto" />
                    <div className="text-white text-lg">No images found</div>
                    <div className="text-slate-400 text-sm">The folder appears to be empty</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Highlights</h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">A curated collection of moments and memories</p>
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="h-[80vh] overflow-hidden">
                        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 md:gap-4 space-y-3 md:space-y-4">
                            {images.map((image) => (
                                <div key={image.id} className="break-inside-avoid mb-3 md:mb-4">
                                    <ImageWithFallback
                                        image={image}
                                        className="w-full h-auto object-cover"
                                        allImagesLoaded={allImagesLoaded}
                                        onLoad={handleImageLoad}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

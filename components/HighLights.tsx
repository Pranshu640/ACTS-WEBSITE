"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { Loader2, RefreshCw } from "lucide-react"

interface DriveImage {
    id: string
    name: string
    thumbnailLink?: string
    webContentLink?: string
    webViewLink?: string
    mimeType?: string
}

function ImageWithFallback({ image, className, onLoad }: {
    image: DriveImage;
    className: string;
    onLoad?: () => void;
}) {
    const [currentAttempt, setCurrentAttempt] = useState(0)
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [hasError, setHasError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const imgRef = useRef<HTMLDivElement>(null)

    // Reduced and optimized image URLs
    const imageUrls = [
        `https://drive.google.com/uc?export=view&id=${image.id}`,
        `https://drive.google.com/thumbnail?id=${image.id}&sz=w800`,
        `https://lh3.googleusercontent.com/d/${image.id}=w800`,
    ]

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (!imgRef.current) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        )

        observer.observe(imgRef.current)
        return () => observer.disconnect()
    }, [])

    // Only start loading when visible
    useEffect(() => {
        if (isVisible && image.id && !imageSrc) {
            setImageSrc(imageUrls[0])
            setCurrentAttempt(0)
            setHasError(false)
            setIsLoading(true)
        }
    }, [isVisible, image.id])

    const handleError = useCallback(() => {
        const nextAttempt = currentAttempt + 1
        if (nextAttempt < imageUrls.length) {
            setImageSrc(imageUrls[nextAttempt])
            setCurrentAttempt(nextAttempt)
        } else {
            setHasError(true)
            setIsLoading(false)
        }
    }, [currentAttempt, imageUrls])

    const handleLoad = useCallback(() => {
        setIsLoading(false)
        setHasError(false)
        onLoad?.()
    }, [onLoad])

    if (!image.id) {
        return (
            <div className="w-full aspect-[4/3] bg-slate-700/30 flex items-center justify-center rounded-xl">
                <div className="text-gray-500 text-xs">Invalid image</div>
            </div>
        )
    }

    if (hasError) {
        return (
            <div className="w-full aspect-[4/3] bg-slate-700/30 flex items-center justify-center rounded-xl">
                <div className="text-center p-2">
                    <div className="text-gray-500 text-xs mb-1">Unavailable</div>
                    <div className="text-gray-600 text-xs truncate max-w-20">{image.name}</div>
                </div>
            </div>
        )
    }

    return (
        <div ref={imgRef} className="relative">
            {/* Skeleton loading state */}
            {!isVisible && (
                <div className="w-full aspect-[4/3] bg-slate-700/20 rounded-xl animate-pulse" />
            )}

            {/* Loading overlay */}
            {isVisible && isLoading && (
                <div className="absolute inset-0 bg-slate-700/20 rounded-xl animate-pulse z-10" />
            )}

            {/* Actual image */}
            {isVisible && imageSrc && (
                <Image
                    src={imageSrc}
                    alt={image.name}
                    width={400}
                    height={300}
                    className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                    style={{ aspectRatio: "auto" }}
                    unoptimized={false} // Enable Next.js optimization
                    priority={false}
                    loading="lazy"
                    onError={handleError}
                    onLoad={handleLoad}
                />
            )}
        </div>
    )
}

export default function VisualsPage() {
    const [images, setImages] = useState<DriveImage[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [loadedCount, setLoadedCount] = useState(0)

    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY
    const FOLDER_ID = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID

    useEffect(() => {
        fetchImages()
    }, [])

    const fetchImages = async () => {
        setLoading(true)
        setError(null)
        setLoadedCount(0)

        if (!API_KEY || !FOLDER_ID) {
            setError("Missing API key or folder ID. Please check your environment variables.")
            setLoading(false)
            return
        }

        try {
            const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+trashed=false&key=${API_KEY}&fields=files(id,name,thumbnailLink,webContentLink,webViewLink,mimeType)&pageSize=100`

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
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

            if (!data || typeof data !== 'object') {
                throw new Error("Invalid response format from Google Drive API")
            }

            if (!data.hasOwnProperty('files')) {
                throw new Error(`API response missing 'files' property. Response: ${JSON.stringify(data)}`)
            }

            if (!Array.isArray(data.files)) {
                throw new Error(`'files' property is not an array. Got: ${typeof data.files}`)
            }

            const imageFiles = data.files.filter((file: { mimeType?: string }) =>
                file && file.mimeType && file.mimeType.startsWith("image/")
            ) || []

            setImages(imageFiles)

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch images"
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleRetry = () => {
        setError(null)
        setLoadedCount(0)
        fetchImages()
    }

    const handleImageLoad = useCallback(() => {
        setLoadedCount(prev => prev + 1)
    }, [])

    if (loading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
                    <p className="text-white text-lg">Loading visuals...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center max-w-2xl mx-auto p-6">
                    <div className="text-red-400 text-lg mb-4">Error loading images</div>
                    <p className="text-gray-300 mb-4">{error}</p>
                    <button
                        onClick={handleRetry}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <div className="relative pt-16 pb-8">

                <div className="container mx-auto px-6 ">
                    <div className="text-center mb-12">
                        <h2 className="text-5xl font-light text-white mb-4 tracking-wide">Past Highlights</h2>
                        <div className="w-16 h-0.5 bg-white mx-auto"></div>
                    </div>

                    {images.length > 0 && (
                        <p className="text-gray-600 text-sm">
                            {loadedCount} of {images.length} images loaded
                        </p>
                    )}
                </div>
            </div>

            {/* Scrollable Grid Container */}
            <div className="container mx-auto px-6 pb-16">
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50 h-[70vh]">
                    {images.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400 text-lg">No images found in the specified folder.</p>
                            <button
                                onClick={handleRetry}
                                className="mt-4 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Refresh
                            </button>
                        </div>
                    ) : (
                        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500 pr-2">
                            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4">
                                {images.map((image, index) => (
                                    <div
                                        key={image.id}
                                        className="break-inside-avoid mb-4 group cursor-pointer transform transition-all duration-200 hover:scale-[1.02]"
                                        style={{
                                            animationDelay: `${Math.min(index * 0.02, 1)}s`,
                                        }}
                                    >
                                        <div className="relative overflow-hidden rounded-xl bg-slate-700/30 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                                            <ImageWithFallback
                                                image={image}
                                                className="w-full h-auto object-cover"
                                                onLoad={handleImageLoad}
                                            />


                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
import { type NextRequest, NextResponse } from "next/server"
import { uploadEventImage } from "@/lib/events-supabase"

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." }, { status: 400 })
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 })
        }

        const imageUrl = await uploadEventImage(file)

        if (!imageUrl) {
            return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
        }

        return NextResponse.json({ imageUrl })
    } catch (error) {
        console.error("Upload Error:", error)
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }
}

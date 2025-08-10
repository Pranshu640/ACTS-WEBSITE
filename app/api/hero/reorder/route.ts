import { type NextRequest, NextResponse } from "next/server"
import { reorderHeroSlides } from "@/lib/hero"

export async function POST(request: NextRequest) {
    try {
        const { slideIds } = await request.json()

        if (!Array.isArray(slideIds)) {
            return NextResponse.json({ error: "Invalid slide IDs" }, { status: 400 })
        }

        const success = await reorderHeroSlides(slideIds)
        if (!success) {
            return NextResponse.json({ error: "Failed to reorder slides" }, { status: 500 })
        }

        return NextResponse.json({ message: "Slides reordered successfully" })
    } catch (error) {
        console.error("API Error:", error)
        return NextResponse.json({ error: "Failed to reorder slides" }, { status: 500 })
    }
}

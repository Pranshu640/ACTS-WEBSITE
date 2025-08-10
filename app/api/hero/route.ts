import { type NextRequest, NextResponse } from "next/server"
import { getAllHeroSlides, createHeroSlide, getActiveHeroSlides } from "@/lib/hero"
import type { CreateHeroSlideData } from "@/types/hero"

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"

    try {
        const slides = activeOnly ? await getActiveHeroSlides() : await getAllHeroSlides()
        return NextResponse.json(slides)
    } catch (error) {
        console.error("API Error:", error)
        return NextResponse.json({ error: "Failed to fetch hero slides" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const data: CreateHeroSlideData = await request.json()

        // Basic validation
        if (!data.title || !data.image) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const newSlide = await createHeroSlide(data)
        if (!newSlide) {
            return NextResponse.json({ error: "Failed to create hero slide" }, { status: 500 })
        }

        return NextResponse.json(newSlide, { status: 201 })
    } catch (error) {
        console.error("API Error:", error)
        return NextResponse.json({ error: "Failed to create hero slide" }, { status: 500 })
    }
}

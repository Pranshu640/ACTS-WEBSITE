import { type NextRequest, NextResponse } from "next/server"
import { getHeroSlideById, updateHeroSlide, deleteHeroSlide } from "@/lib/hero"
import type { UpdateHeroSlideData } from "@/types/hero"

interface RouteParams {
    params: Promise<{
        id: string
    }>
}

export async function GET(request: NextRequest, context: RouteParams) {
    try {
        const { id } = await context.params
        const slide = await getHeroSlideById(id)
        if (!slide) {
            return NextResponse.json({ error: "Hero slide not found" }, { status: 404 })
        }
        return NextResponse.json(slide)
    } catch (error) {
        console.error("API Error:", error)
        return NextResponse.json({ error: "Failed to fetch hero slide" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, context: RouteParams) {
    try {
        const { id } = await context.params
        const data: Partial<UpdateHeroSlideData> = await request.json()
        const updateData: UpdateHeroSlideData = { ...data, id }

        const updatedSlide = await updateHeroSlide(updateData)
        if (!updatedSlide) {
            return NextResponse.json({ error: "Hero slide not found" }, { status: 404 })
        }

        return NextResponse.json(updatedSlide)
    } catch (error) {
        console.error("API Error:", error)
        return NextResponse.json({ error: "Failed to update hero slide" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, context: RouteParams) {
    try {
        const { id } = await context.params
        const success = await deleteHeroSlide(id)
        if (!success) {
            return NextResponse.json({ error: "Hero slide not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Hero slide deleted successfully" })
    } catch (error) {
        console.error("API Error:", error)
        return NextResponse.json({ error: "Failed to delete hero slide" }, { status: 500 })
    }
}

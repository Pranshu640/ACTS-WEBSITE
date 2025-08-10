import { type NextRequest, NextResponse } from "next/server"
import { getAllEvents, createEvent } from "@/lib/events-supabase"
import type { CreateEventData } from "@/types/event"

export async function GET() {
    try {
        const events = await getAllEvents()
        return NextResponse.json(events)
    } catch (error) {
        console.error("API Error:", error)
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const data: CreateEventData = await request.json()

        // Basic validation
        if (!data.title || !data.date || !data.description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const newEvent = await createEvent(data)

        if (!newEvent) {
            return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
        }

        return NextResponse.json(newEvent, { status: 201 })
    } catch (error) {
        console.error("API Error:", error)
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
    }
}

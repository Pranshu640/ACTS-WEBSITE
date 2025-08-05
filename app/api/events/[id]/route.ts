import { type NextRequest, NextResponse } from "next/server"
import { getEventById, updateEvent, deleteEvent } from "@/lib/events-supabase"
import type { UpdateEventData } from "@/types/event"

interface RouteParams {
    params: {
        id: string
    }
}

export async function GET(request: NextRequest, context: RouteParams) {
    try {
        const eventId = context.params.id
        const event = await getEventById(eventId)

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 })
        }

        return NextResponse.json(event)
    } catch (error) {
        console.error("API Error:", error)
        return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, context: RouteParams) {
    try {
        const eventId = context.params.id
        const data: Partial<UpdateEventData> = await request.json()

        // Clean the data - remove undefined values
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined && value !== ""),
        )

        const updateData: UpdateEventData = { ...cleanData, id: eventId }

        console.log("Updating event with data:", updateData)

        const updatedEvent = await updateEvent(updateData)

        if (!updatedEvent) {
            return NextResponse.json({ error: "Event not found or update failed" }, { status: 404 })
        }

        return NextResponse.json(updatedEvent)
    } catch (error) {
        console.error("API Error:", error)
        return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, context: RouteParams) {
    try {
        const eventId = context.params.id
        const success = await deleteEvent(eventId)

        if (!success) {
            return NextResponse.json({ error: "Event not found or delete failed" }, { status: 404 })
        }

        return NextResponse.json({ message: "Event deleted successfully" })
    } catch (error) {
        console.error("API Error:", error)
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
    }
}

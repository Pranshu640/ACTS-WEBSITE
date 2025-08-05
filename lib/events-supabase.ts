import { supabase } from "./supabase"
import type { Event, CreateEventData, UpdateEventData } from "@/types/event"

export async function getAllEvents(): Promise<Event[]> {
    const { data, error } = await supabase.from("events").select("*").order("date", { ascending: false })

    if (error) {
        console.error("Error fetching events:", error)
        return []
    }

    return data.map((event) => ({
        ...event,
        createdAt: event.created_at,
        updatedAt: event.updated_at,
    }))
}

export async function getEventById(id: string): Promise<Event | null> {
    const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

    if (error) {
        console.error("Error fetching event:", error)
        return null
    }

    return {
        ...data,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    }
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
    const { data, error } = await supabase.from("events").select("*").eq("slug", slug).single()

    if (error) {
        console.error("Error fetching event:", error)
        return null
    }

    return {
        ...data,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    }
}

export async function createEvent(eventData: CreateEventData): Promise<Event | null> {
    const slug = eventData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    const { data, error } = await supabase
        .from("events")
        .insert({
            title: eventData.title,
            date: eventData.date,
            description: eventData.description,
            image: eventData.image,
            location: eventData.location,
            content: eventData.content,
            featured: eventData.featured,
            status: eventData.status,
            slug,
        })
        .select()
        .single()

    if (error) {
        console.error("Error creating event:", error)
        return null
    }

    return {
        ...data,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    }
}

export async function updateEvent(eventData: UpdateEventData): Promise<Event | null> {
    try {
        const { id, ...updateFields } = eventData

        // Create the update object with proper typing
        const updateData: any = { ...updateFields }

        // Generate new slug if title is being updated
        if (updateFields.title) {
            updateData.slug = updateFields.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")
        }

        console.log("Supabase update - ID:", id, "Fields:", updateData)

        const { data, error } = await supabase.from("events").update(updateData).eq("id", id).select().single()

        if (error) {
            console.error("Supabase update error:", error)
            return null
        }

        if (!data) {
            console.error("No data returned from update")
            return null
        }

        return {
            ...data,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        }
    } catch (error) {
        console.error("Update event error:", error)
        return null
    }
}

export async function deleteEvent(id: string): Promise<boolean> {
    const { error } = await supabase.from("events").delete().eq("id", id)

    if (error) {
        console.error("Error deleting event:", error)
        return false
    }

    return true
}

export async function uploadEventImage(file: File): Promise<string | null> {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `events/${fileName}`

    const { error: uploadError } = await supabase.storage.from("event-images").upload(filePath, file)

    if (uploadError) {
        console.error("Error uploading image:", uploadError)
        return null
    }

    const { data } = supabase.storage.from("event-images").getPublicUrl(filePath)

    return data.publicUrl
}

export async function deleteEventImage(imageUrl: string): Promise<boolean> {
    try {
        // Extract file path from URL
        const url = new URL(imageUrl)
        const pathParts = url.pathname.split("/")
        const filePath = pathParts.slice(-2).join("/") // Get 'events/filename.ext'

        const { error } = await supabase.storage.from("event-images").remove([filePath])

        if (error) {
            console.error("Error deleting image:", error)
            return false
        }

        return true
    } catch (error) {
        console.error("Error parsing image URL:", error)
        return false
    }
}

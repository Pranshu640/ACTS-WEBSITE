export type EventStatus = "upcoming" | "live" | "ongoing" | "completed"

export interface Event {
    id: string
    title: string
    date: string
    description: string
    image: string
    location?: string
    slug: string
    content?: string
    featured?: boolean
    status: EventStatus
    createdAt: string
    updatedAt: string
}

export interface CreateEventData {
    title: string
    date: string
    description: string
    image: string
    location?: string
    content?: string
    featured?: boolean
    status: EventStatus
}

export interface UpdateEventData extends Partial<CreateEventData> {
    id: string
    slug?: string
}

import type { Event, CreateEventData, UpdateEventData } from "@/types/event"

// In a real app, this would be a database
const events: Event[] = [
    {
        id: "1",
        title: "Club Foundation",
        date: "2020-01-15",
        description:
            "Our professional club was established with a vision to create a platform for industry leaders to connect, collaborate, and drive innovation in our field.",
        image: "/placeholder.svg?height=300&width=400&text=Club+Foundation",
        location: "Downtown Conference Center",
        slug: "club-foundation",
        content:
            "The foundation of ACTS marked a significant milestone in our journey. With the vision of creating a collaborative platform for technology enthusiasts, we started with a small group of passionate individuals who believed in the power of community-driven learning.",
        featured: true,
        status: "completed",
        createdAt: "2020-01-15T00:00:00Z",
        updatedAt: "2020-01-15T00:00:00Z",
    },
    {
        id: "2",
        title: "First Annual Conference",
        date: "2020-03-22",
        description:
            "Our inaugural conference brought together over 200 professionals from various industries to discuss emerging trends and future opportunities.",
        image: "/placeholder.svg?height=300&width=400&text=Annual+Conference",
        location: "Grand Hotel Ballroom",
        slug: "first-annual-conference",
        content:
            "Our first annual conference was a resounding success, featuring keynote speakers from leading tech companies, interactive workshops, and networking sessions that fostered meaningful connections among attendees.",
        featured: true,
        status: "completed",
        createdAt: "2020-03-22T00:00:00Z",
        updatedAt: "2020-03-22T00:00:00Z",
    },
    {
        id: "3",
        title: "Mentorship Program Launch",
        date: "2021-09-10",
        description:
            "We launched our comprehensive mentorship program, connecting experienced professionals with emerging talent in the industry.",
        image: "/placeholder.svg?height=300&width=400&text=Mentorship+Program",
        location: "Innovation Hub",
        slug: "mentorship-program-launch",
        content:
            "The mentorship program has been one of our most impactful initiatives, pairing industry veterans with newcomers to provide guidance, support, and career development opportunities.",
        featured: false,
        status: "ongoing",
        createdAt: "2021-09-10T00:00:00Z",
        updatedAt: "2021-09-10T00:00:00Z",
    },
    {
        id: "4",
        title: "Industry Partnership",
        date: "2022-06-05",
        description:
            "Established strategic partnerships with leading companies to provide exclusive opportunities and resources for our members.",
        image: "/placeholder.svg?height=300&width=400&text=Industry+Partnership",
        location: "Corporate Headquarters",
        slug: "industry-partnership",
        content:
            "Our strategic partnerships have opened doors to exclusive internships, job opportunities, and collaborative projects that benefit our entire community.",
        featured: false,
        status: "completed",
        createdAt: "2022-06-05T00:00:00Z",
        updatedAt: "2022-06-05T00:00:00Z",
    },
    {
        id: "5",
        title: "Digital Transformation",
        date: "2025-02-15",
        description:
            "Launching our digital platform and mobile app, making it easier for members to connect, access resources, and participate in events.",
        image: "/placeholder.svg?height=300&width=400&text=Digital+Platform",
        location: "Tech Campus",
        slug: "digital-transformation",
        content:
            "The digital transformation initiative will revolutionize how our members interact with the club, providing seamless access to resources, events, and networking opportunities through our new platform.",
        featured: true,
        status: "upcoming",
        createdAt: "2023-11-18T00:00:00Z",
        updatedAt: "2023-11-18T00:00:00Z",
    },
]

export function getAllEvents(): Event[] {
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getEventById(id: string): Event | undefined {
    return events.find((event) => event.id === id)
}

export function getEventBySlug(slug: string): Event | undefined {
    return events.find((event) => event.slug === slug)
}

export function createEvent(data: CreateEventData): Event {
    const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    const now = new Date().toISOString()

    const newEvent: Event = {
        id: Date.now().toString(),
        ...data,
        slug,
        createdAt: now,
        updatedAt: now,
    }

    events.push(newEvent)
    return newEvent
}

export function updateEvent(data: UpdateEventData): Event | null {
    const index = events.findIndex((event) => event.id === data.id)
    if (index === -1) return null

    const updatedEvent = {
        ...events[index],
        ...data,
        updatedAt: new Date().toISOString(),
    }

    // Update slug if title changed
    if (data.title) {
        updatedEvent.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
    }

    events[index] = updatedEvent
    return updatedEvent
}

export function deleteEvent(id: string): boolean {
    const index = events.findIndex((event) => event.id === id)
    if (index === -1) return false

    events.splice(index, 1)
    return true
}

// Auto-update event status based on date
export function autoUpdateEventStatuses(): void {
    const now = new Date()

    events.forEach((event) => {
        const eventDate = new Date(event.date)
        const daysDiff = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24))

        if (daysDiff > 7) {
            event.status = "upcoming"
        } else if (daysDiff >= 0 && daysDiff <= 7) {
            event.status = "live"
        } else if (daysDiff < 0 && daysDiff >= -30) {
            // Recently completed events might still be ongoing
            if (event.status !== "ongoing") {
                event.status = "completed"
            }
        } else {
            event.status = "completed"
        }

        event.updatedAt = new Date().toISOString()
    })
}

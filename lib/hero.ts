import type { HeroSlide, CreateHeroSlideData, UpdateHeroSlideData } from "@/types/hero"
import { supabase } from "./supabase"

// Define a type for the database row to avoid using `any`
type HeroSlideDbRow = {
    id: string
    title: string
    image: string
    link: string | null
    order_index: number | null
    active: boolean | null
    created_at: string
    updated_at: string
}

// Convert database row to HeroSlide type
function dbRowToHeroSlide(row: HeroSlideDbRow): HeroSlide {
    return {
        id: row.id,
        title: row.title,
        image: row.image,
        link: row.link || "/ourJourney",
        order: row.order_index || 0,
        active: row.active ?? true, // Use nullish coalescing for boolean
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }
}

export async function getAllHeroSlides(): Promise<HeroSlide[]> {
    try {
        const { data, error } = await supabase.from("hero_slides").select("*").order("order_index", { ascending: true })

        if (error) {
            console.error("Supabase error:", error)
            return []
        }

        return data?.map(dbRowToHeroSlide) || []
    } catch (error) {
        console.error("Error fetching hero slides:", error)
        return []
    }
}

export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
    try {
        const { data, error } = await supabase
            .from("hero_slides")
            .select("*")
            .eq("active", true)
            .order("order_index", { ascending: true })

        if (error) {
            console.error("Supabase error:", error)
            return []
        }

        return data?.map(dbRowToHeroSlide) || []
    } catch (error) {
        console.error("Error fetching active hero slides:", error)
        return []
    }
}

export async function getHeroSlideById(id: string): Promise<HeroSlide | null> {
    try {
        const { data, error } = await supabase.from("hero_slides").select("*").eq("id", id).single()

        if (error) {
            console.error("Supabase error:", error)
            return null
        }

        return data ? dbRowToHeroSlide(data) : null
    } catch (error) {
        console.error("Error fetching hero slide by ID:", error)
        return null
    }
}

export async function createHeroSlide(data: CreateHeroSlideData): Promise<HeroSlide | null> {
    try {
        const { data: newSlide, error } = await supabase
            .from("hero_slides")
            .insert([
                {
                    title: data.title,
                    image: data.image,
                    link: data.link || "/ourJourney",
                    order_index: data.order,
                    active: data.active,
                },
            ])
            .select()
            .single()

        if (error) {
            console.error("Supabase error:", error)
            throw error
        }

        return newSlide ? dbRowToHeroSlide(newSlide) : null
    } catch (error) {
        console.error("Error creating hero slide:", error)
        throw error
    }
}

export async function updateHeroSlide(data: UpdateHeroSlideData): Promise<HeroSlide | null> {
    try {
        const { id, ...updateFields } = data

        const updateData: Partial<Omit<HeroSlideDbRow, "id" | "created_at" | "updated_at">> = {
            title: updateFields.title,
            image: updateFields.image,
            link: updateFields.link,
            active: updateFields.active,
        }

        // Map order to order_index for database
        if (updateFields.order !== undefined) {
            updateData.order_index = updateFields.order
        }

        const { data: updatedSlide, error } = await supabase
            .from("hero_slides")
            .update(updateData)
            .eq("id", id)
            .select()
            .single()

        if (error) {
            console.error("Supabase error:", error)
            throw error
        }

        return updatedSlide ? dbRowToHeroSlide(updatedSlide) : null
    } catch (error) {
        console.error("Error updating hero slide:", error)
        throw error
    }
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
    try {
        const { error } = await supabase.from("hero_slides").delete().eq("id", id)

        if (error) {
            console.error("Supabase error:", error)
            return false
        }

        return true
    } catch (error) {
        console.error("Error deleting hero slide:", error)
        return false
    }
}

export async function reorderHeroSlides(slideIds: string[]): Promise<boolean> {
    try {
        // Update order for each slide
        const updates = slideIds.map((id, index) =>
            supabase
                .from("hero_slides")
                .update({ order_index: index + 1 })
                .eq("id", id),
        )

        await Promise.all(updates)
        return true
    } catch (error) {
        console.error("Error reordering hero slides:", error)
        return false
    }
}

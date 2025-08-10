export interface HeroSlide {
    id: string
    title: string
    image: string
    link: string
    order: number
    active: boolean
    createdAt: string
    updatedAt: string
}

export interface CreateHeroSlideData {
    title: string
    image: string
    link: string
    order: number
    active: boolean
}

export interface UpdateHeroSlideData extends Partial<CreateHeroSlideData> {
    id: string
}

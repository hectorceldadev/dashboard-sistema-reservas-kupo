export interface Member {
    id: string
    business_id: string
    role: string
    full_name: string
    description: string | null
    email: string
    is_active: boolean
    avatar_url: string
    created_at: string
    metadata: JSON
}

export interface ServiceDB {
    title: string
    price: number
    duration: number
    features: string[]
    short_desc: string
    full_desc: string
    id: string, 
    icon: string
    slug: string
    metadata: Record<string, string>
    image_url: string
}
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
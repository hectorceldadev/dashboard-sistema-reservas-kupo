export interface ProfileDB {
    id: string
    business_id: string
    role: string
    full_name: string
    description: string | null
    email: string
    is_active: boolean
    avatar_url: string
}
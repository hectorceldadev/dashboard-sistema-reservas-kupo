import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getTeamMembers = cache(async(businessId: string) => {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('business_id', businessId)
        .order('is_active', { ascending: false })

    if (error || !data || data.length === 0) {
        console.error('Error al buscar los componentes del equipo')
        return []
    } 

    return data

})
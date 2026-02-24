'use server'

import { createClient } from "@/utils/supabase/server"
import { error } from "console"
import { revalidatePath } from "next/cache"

export async function getServices () {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'No estás autenticado.' }

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
            
        if (!profile) return { error: 'Error obteniendo la información del negocio.' }

        const { data: services, error: errorServices } = await supabase
            .from('services')
            .select('*')
            .eq('business_id', profile.business_id)

        if (errorServices || !services) return { error: 'Error obteniendo los servicios.' }

        return {
            success: true,
            servicios: services || [],
            profile
        }

    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno.' }
    }
}

export async function updateService (serviceId: string, data: {
    title: string;
    short_desc?: string;
    full_desc?: string;
    duration: number;
    price: number;
    is_active: boolean;
    features?: string[];
}) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'No estás autenticado' }

        const { data: profile } = await supabase    
            .from('profiles')
            .select('business_id, role')
            .eq('id', user.id)
            .single()

        if (!profile) return { error: 'Error obteniendo información del negocio.' }
        if (profile.role !== 'admin') return { error: 'No tienes los permisos para editar un servicio.' }

        const slug = data.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "") // Quita tildes
            .replace(/[^a-z0-9]+/g, '-')     // Reemplaza espacios por guiones
            .replace(/(^-|-$)+/g, '');       // Quita guiones al principio o final

        const { error: errorUpdate } = await supabase
            .from('services')
            .update({
                title: data.title,
                short_desc: data.short_desc,
                full_desc: data.full_desc,
                duration: data.duration,
                price: data.price,
                is_active: data.is_active,
                slug: slug,
                features: data.features
            })
            .eq('business_id', profile.business_id)
            .eq('id', serviceId)

        if (errorUpdate) {
            console.error('Error: ', errorUpdate)
            return { error: 'Error actualizando el servicio en la base de datos.' }
        } 

        return { success: true }
        
    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno.' }
    }
}

export async function createService (data: {
    title: string;
    short_desc?: string;
    full_desc?: string;
    duration: number;
    price: number;
    is_active: boolean;
    features?: string[];
}) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'No estás autenticado.' }

        const { data: profile } = await supabase
            .from('profiles')
            .select('business_id, role')
            .eq('id', user.id)
            .single()

        if (!profile) return { error: 'Error obteniendo datos del negocio.' }
        if (profile.role !== 'admin') return { error: 'No tienes los permisos para crear un servicio.' }

        const slug = data.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "") // Quita tildes
            .replace(/[^a-z0-9]+/g, '-')     // Reemplaza espacios por guiones
            .replace(/(^-|-$)+/g, '');       // Quita guiones al principio o final        

        const { data: newService, error: errorService } = await supabase
            .from('services')
            .insert({
                title: data.title,
                short_desc: data.short_desc,
                full_desc: data.full_desc,
                duration: data.duration,
                price: data.price,
                is_active: data.is_active,
                slug: slug,
                features: data.features,
                business_id: profile.business_id
            })
            .select()
            .single()

        if (errorService) return { error: 'Error creando el servicio' }

        revalidatePath('/dashboard/servicios')
        return { success: 'Servicio creado correctamente.', service: newService }

    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno.' }
    }
}

export async function deleteService (serviceId: string) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'No estás autenticado.' }

        const { data: profile } = await supabase
            .from('profiles')
            .select('business_id, role')
            .eq('id', user.id)
            .single()

        if (!profile) return { error: 'Error obteniendo datos del negocio.' }
        if (profile.role !== 'admin') return { error: 'No tienes los permisos para eliminar un servicio.' }

        const { error: errorDelete } = await supabase
            .from('services')
            .delete()
            .eq('id', serviceId)
            .eq('business_id', profile.business_id)

        if (errorDelete) return { error: 'Error eliminando el servicio.' }

        revalidatePath('/dashboard/servicios')
        return { success: 'Servicio eliminado correctamente.' }
    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno.' }
    }
}
'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getCustomers () {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'No estás autenticado.' }

        const { data: profile } = await supabase
            .from('profiles')
            .select('business_id')
            .eq('id', user.id)
            .single()

        if (!profile?.business_id) return { error: 'No estas autorizado.' }

        const { data: customers, error: errorCustomers } = await supabase
            .from('customers')
            .select('*')
            .eq('business_id', profile.business_id)
            
        if (errorCustomers) return { error: 'Error obteniendo los clientes.' }

        // Si no hay datos, devolverá [] correctamente
        return {
            success: true,
            customers: customers || []
        }

    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno.' }
    }
}

export async function getCustomerData (customerId: string) {
    try {

        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'No estás autenticado' }

        const { data: profile } = await supabase
            .from('profiles')
            .select('business_id')
            .eq('id', user.id)
            .single()

        if (!profile?.business_id) return { error: 'Error al obtener datos de negocio del customer.' }

        const { data: customer, error: errorCustomer } = await supabase
            .from('customers')
            .select('*')
            .eq('id', customerId)
            .single()

        if (errorCustomer) return { error: 'Error obteniendo los datos del customer.' }
        
        const { data: bookings, error: errorBookings } = await supabase
            .from('bookings')
            .select(`
                *,
                booking_items (
                    *
                ),
                staff:profiles!staff_id (
                    avatar_url,
                    full_name
                )
                `)
            .eq('customer_id', customerId)
            .eq('business_id', profile.business_id)
            .order('start_time', { ascending: false })

        if (errorBookings) {
          console.log("🔥 ERROR RLS EN BOOKINGS/PROFILES:", errorBookings)  
          return { error: 'Se ha producido un error obteniendo las reservas del costumer.' }
        } 

        return {
            success: true,
            bookings: bookings || [],
            activeCustomer: customer
        }

    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno.' }
    }
}
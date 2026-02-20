import AgendaContainer from "@/components/dashboard/agenda/AgendaContainer"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function AgendaPage() {
    const supabase = await createClient()

    // 1. Verificación de usuario
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // 2. Obtener perfil y rol (para saber si cargamos el selector de staff)
    const { data: profile } = await supabase
        .from('profiles')
        .select(`
            role, 
            business_id,
            businesses(
                open_hour,
                close_hour
            )
            `)
        .eq('id', user.id)
        .single()

    if (!profile) redirect('/login')

    const businessHours = {
        open: profile.businesses?.open_hour ?? 8,
        close: profile.businesses?.close_hour ?? 21
    }

    const isAdmin = profile.role === 'admin'
    let staffList: any[] = []

    // 3. Si es Admin, cargamos la lista de empleados para el filtro superior
    if (isAdmin) {
        const { data: staff } = await supabase
            .from('profiles')
            .select('id, full_name, role')
            .eq('business_id', profile.business_id)
            .eq('is_active', true)
        
        staffList = staff || []
    }

    const { data: rawBookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        date,
        start_time,
        end_time,
        status,
        customer_name,
        staff_id,
        total_price,
        staff:profiles!staff_id ( 
          full_name,
          avatar_url
          ),
        booking_items (
            price,
            services ( title, duration )
        )
      `)
      .eq('business_id', profile.business_id)
      .neq('status', 'cancelled')

    if (error) {
        console.error("Error cargando citas:", error)
    }

    const initialBookings = rawBookings || []

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Agenda</h1>
                    <p className="text-zinc-400 mt-1">Gestiona las reservas de tu negocio.</p>
                </div>
                {/* Aquí iría un botón de "+ Nueva Cita Manual" en el futuro */}
            </div>

            {/* Contenedor Interactivo */}
            <AgendaContainer 
                initialStaff={staffList} 
                isAdmin={isAdmin} 
                currentUserId={user.id} 
                initialBookings={initialBookings}
                businessHours={businessHours}
            />
        </div>
    )
}
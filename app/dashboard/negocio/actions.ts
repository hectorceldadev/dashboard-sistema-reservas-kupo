'use server'

import { createClient } from "@/utils/supabase/server"
import { subDays, format, differenceInDays, addDays, parseISO, formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export async function getDashboardData (timeRange: string) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'No estás autenticado.' }

        const { data: profile } = await supabase
            .from('profiles')
            .select('business_id, role')
            .eq('id', user.id)
            .single()

        if (!profile) return { error: 'Error obteniendo los datos.' }
        if (profile.role !== 'admin') return { error: 'No tienes los permisos.' }

        // 1. CALCULAMOS LAS FECHAS
        const currentEnd = new Date()
        let currentStart = new Date()
        let daysToSubtract = 30

        if (timeRange === '1_dia') daysToSubtract = 1
        if (timeRange === '3_dias') daysToSubtract = 3
        if (timeRange === '1_semana') daysToSubtract = 7
        if (timeRange === '1_mes') daysToSubtract = 30
        if (timeRange === '3_meses') daysToSubtract = 90
        if (timeRange === '6_meses') daysToSubtract = 180
        if (timeRange === '1_ano') daysToSubtract = 365

        currentStart = subDays(currentEnd, daysToSubtract - 1)
        const prevEnd = subDays(currentStart, 1)
        const prevStart = subDays(prevEnd, daysToSubtract - 1)

        const formatDate = (d: Date) => format(d, 'yyyy-MM-dd')

        // 2. TRAEMOS DATOS (Añadido avatar_url y customer_phone)
        const { data: currentBookings } = await supabase
            .from('bookings')
            .select(`
                id, date, start_time, status, customer_name, customer_phone, total_price,
                booking_items ( price, service_name ),
                staff:profiles!staff_id ( full_name, avatar_url )
            `)
            .eq('business_id', profile.business_id)
            .gte('date', formatDate(currentStart))
            .lte('date', formatDate(currentEnd))

        const { data: prevBookings } = await supabase
            .from('bookings')
            .select(`id, status, total_price, booking_items ( price )`)
            .eq('business_id', profile.business_id)
            .gte('date', formatDate(prevStart))
            .lte('date', formatDate(prevEnd))

        if (!currentBookings || !prevBookings) return { error: 'Error obteniendo datos.' }

        // 3. VARIABLES Y DICCIONARIOS
        let ingresosTotales = 0
        let citasCompletadas = 0
        let canceladas = 0
        
        const ingresosPorDia: Record<string, number> = {}
        const conteoServicios: Record<string, number> = {}
        const conteoDias: Record<string, number> = {}
        const statsStaff: Record<string, { ingresos: number, citas: number, avatar: string | null }> = {}
        const statsClientes: Record<string, { visits: number, spent: number, lastVisit: string, phone: string }> = {}

        currentBookings.forEach(booking => {
            const rawPrice = booking.total_price || booking.booking_items?.reduce((sum: number, item: any) => sum + (item.price || 0), 0) || 0
            
            const esCompletada = booking.status === 'completed'
            const precioValido = esCompletada ? rawPrice : 0

            if (booking.status === 'cancelled') {
                canceladas++
                return 
            }

            if (esCompletada) citasCompletadas++
            ingresosTotales += precioValido

            ingresosPorDia[booking.date] = (ingresosPorDia[booking.date] || 0) + precioValido

            const nombreDia = format(parseISO(booking.date), 'EEE', { locale: es }).replace('.', '')
            conteoDias[nombreDia] = (conteoDias[nombreDia] || 0) + 1

            booking.booking_items?.forEach((item: any) => {
                const nombreServicio = item.service_name || 'General'
                conteoServicios[nombreServicio] = (conteoServicios[nombreServicio] || 0) + 1
            })

            const nombreStaff = booking.staff?.full_name || 'Sin asignar'
            const avatarStaff = booking.staff?.avatar_url || null
            if (!statsStaff[nombreStaff]) statsStaff[nombreStaff] = { ingresos: 0, citas: 0, avatar: avatarStaff }
            statsStaff[nombreStaff].ingresos += precioValido
            statsStaff[nombreStaff].citas += 1

            const nombreCliente = booking.customer_name || 'Cliente sin nombre'
            const tlfCliente = booking.customer_phone || ''
            if (!statsClientes[nombreCliente]) statsClientes[nombreCliente] = { visits: 0, spent: 0, lastVisit: booking.date, phone: tlfCliente }
            statsClientes[nombreCliente].visits += 1
            statsClientes[nombreCliente].spent += precioValido
            if (booking.date > statsClientes[nombreCliente].lastVisit) {
                statsClientes[nombreCliente].lastVisit = booking.date 
            }
        })

        // 4. DATOS ANTERIORES (Para el porcentaje)
        let ingresosAnteriores = 0
        let canceladasAnteriores = 0
        let completadasAnteriores = 0 // <-- NUEVA VARIABLE
        let citasAnterioresValidas = 0
        const prevIngresosPorDia: Record<string, number> = {}

        prevBookings.forEach(booking => {
            const rawPrice = booking.total_price || booking.booking_items?.reduce((sum: number, item: any) => sum + (item.price || 0), 0) || 0
            if (booking.status === 'cancelled') {
                canceladasAnteriores++
            } else {
                citasAnterioresValidas++
                if (booking.status === 'completed') {
                    completadasAnteriores++ // <-- SUMAMOS COMPLETADAS
                    ingresosAnteriores += rawPrice
                }
            }
        })

        // 5. DAR FORMA AL JSON FINAL
        const totalCitas = currentBookings.length
        const totalAnteriores = prevBookings.length
        const ticketMedio = citasCompletadas > 0 ? (ingresosTotales / citasCompletadas) : 0
        const prevTicketMedio = ingresosAnteriores > 0 ? (ingresosAnteriores / citasAnterioresValidas) : 0

        // <-- NUEVA FUNCIÓN: Para evitar dividir entre 0 y dar un % real
        const calcCrecimiento = (actual: number, pasado: number) => {
            if (pasado === 0) return actual > 0 ? 100 : 0;
            return ((actual - pasado) / pasado) * 100;
        }

        const kpis = {
            ingresos: ingresosTotales,
            ingresosCrecimiento: calcCrecimiento(ingresosTotales, ingresosAnteriores),
            completadas: citasCompletadas,
            completadasCrecimiento: calcCrecimiento(citasCompletadas, completadasAnteriores), // <-- AÑADIDO
            tasaCancelacion: totalCitas > 0 ? (canceladas / totalCitas) * 100 : 0,
            tasaCancelacionCrecimiento: totalAnteriores > 0 ? (((canceladas/totalCitas) - (canceladasAnteriores/totalAnteriores)) * 100) : 0,
            ticketMedio,
            ticketMedioCrecimiento: calcCrecimiento(ticketMedio, prevTicketMedio)
        }
        
        const serviciosEstrella = Object.entries(conteoServicios)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5) 

        const rendimientoEquipo = Object.entries(statsStaff)
            .map(([name, stats]) => ({ name, ingresos: stats.ingresos, citas: stats.citas, avatar: stats.avatar }))
            .sort((a, b) => b.ingresos - a.ingresos)

        const ordenDias = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom']
        const diasFuertes = Object.entries(conteoDias)
            .map(([name, citas]) => ({ name, citas }))
            .sort((a, b) => ordenDias.indexOf(a.name) - ordenDias.indexOf(b.name))

        const topClientes = Object.entries(statsClientes)
            .map(([name, stats], index) => ({
                id: index,
                name,
                phone: stats.phone,
                visits: stats.visits,
                spent: stats.spent,
                lastVisit: formatDistanceToNow(parseISO(stats.lastVisit), { addSuffix: true, locale: es })
            }))
            .sort((a, b) => b.spent - a.spent)
            .slice(0, 5)

        const diasDiff = differenceInDays(currentEnd, currentStart) + 1
        const ingresosGrafico = Array.from({ length: diasDiff }).map((_, i) => {
            const fechaIteracion = formatDate(addDays(currentStart, i))
            return {
                name: format(addDays(currentStart, i), 'dd/MM'), 
                actual: ingresosPorDia[fechaIteracion] || 0,
                pasado: 0
            }
        })

        return {
            success: true,
            data: {
                kpis,
                ingresosGrafico,
                diasFuertes,
                serviciosEstrella,
                rendimientoEquipo,
                topClientes
            }
        }

    } catch (error) {
        console.error('Error procesando dashboard: ', error)
        return { error: 'Error interno procesando las métricas.' }
    }
}
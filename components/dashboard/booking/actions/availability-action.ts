'use server'

import { createClient } from "@/utils/supabase/server"
import { fromZonedTime, toZonedTime } from "date-fns-tz"

const TIMEZONE = 'Europe/Madrid'

const timeToMins = (time: string) => {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
}

const minsToTime = (mins: number) => {
    const h = Math.floor(mins / 60).toString().padStart(2, '0')
    const m = (mins % 60).toString().padStart(2, '0')
    return `${h}:${m}`
}

export async function getBookingAvailabilityAction(dateParam: string, staffId: string, duration: number) {
    try {
        const supabase = await createClient()
        
        // 1. Autenticación y obtención segura del negocio del Admin
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'No estás autenticado.' }

        const { data: profile } = await supabase
            .from('profiles')
            .select('business_id')
            .eq('id', user.id)
            .single()

        if (!profile?.business_id) return { error: 'Error obteniendo datos del negocio.' }
        const businessId = profile.business_id

        if (!dateParam) {
             return { error: 'Faltan parámetros de fecha.' }
        }

        // 2. Lógica principal de cálculo de fechas
        const localMidnight = fromZonedTime(`${dateParam}T00:00:00`, TIMEZONE)
        const dateInMadrid = toZonedTime(localMidnight, TIMEZONE)
        const dayOfWeek = dateInMadrid.getDay()

        let scheduleQuery = supabase
            .from('staff_schedules')
            .select('*')
            .eq('business_id', businessId)
            .eq('day_of_week', dayOfWeek)
            .eq('is_working', true)

        if (staffId && staffId !== 'any') {
            scheduleQuery = scheduleQuery.eq('staff_id', staffId)
        }

        const { data: schedules, error: scheduleError } = await scheduleQuery

        if (scheduleError || !schedules || schedules.length === 0) {
             return { success: true, slots: [] }
        }

        const workingStaffIds = schedules.map(s => s.staff_id)

        // 3. Consultas de disponibilidad (Reservas y Bloqueos)
        const { data: bookings } = await supabase
            .from('bookings')
            .select('start_time, end_time, staff_id')
            .eq('business_id', businessId)
            .eq('date', dateParam)
            .in('staff_id', workingStaffIds)
            .neq('status', 'cancelled')
            .neq('status', 'rejected')

        const { data: blockedPeriods } = await supabase
            .from('blocked_periods')
            .select('start_date, end_date, staff_id')
            .eq('business_id', businessId)
            .in('staff_id', workingStaffIds)
            .eq('status', 'active')

        // 4. Lógica de "El día de hoy"
        const nowUtc = new Date()
        const nowInMadrid = toZonedTime(nowUtc, TIMEZONE)

        const todayString = `${nowInMadrid.getFullYear()}-${String(nowInMadrid.getMonth() + 1).padStart(2, '0')}-${String(nowInMadrid.getDate()).padStart(2, '0')}`
        const isToday = dateParam === todayString

        // En el admin podemos dejar el bufferMins a 0 por si quieren meter una reserva de urgencia ya mismo.
        const bufferMins = 0 
        const currentMinsOfDay = (nowInMadrid.getHours() * 60 + nowInMadrid.getMinutes()) + bufferMins 

        const slotsSet = new Set<string>()
        const INTERVAL = 30

        // 5. Bucle de comprobación de huecos
        schedules.forEach(schedule => {
            const shiftStart = timeToMins(schedule.start_time)
            const shiftEnd = timeToMins(schedule.end_time)

            for (let currentMins = shiftStart; currentMins <= shiftEnd - duration; currentMins += INTERVAL) {

                if (isToday && currentMins < currentMinsOfDay) {
                    continue
                }

                const timeString = minsToTime(currentMins)
                if (slotsSet.has(timeString)) continue

                const slotStartMins = currentMins
                const slotEndMins = currentMins + duration
                let isAvailable = true

                // A. Comprobar Descanso (Break)
                if (schedule.break_start && schedule.break_end) {
                    const breakStart = timeToMins(schedule.break_start)
                    const breakEnd = timeToMins(schedule.break_end)

                    if (slotStartMins < breakEnd && slotEndMins > breakStart) {
                        isAvailable = false
                    }
                }

                // B. Comprobar Reservas y Bloqueos
                if (isAvailable) {
                    const slotLocalStartStr = `${dateParam}T${minsToTime(slotStartMins)}:00`
                    const slotLocalEndStr = `${dateParam}T${minsToTime(slotEndMins)}:00`
    
                    const slotUtcStart = fromZonedTime(slotLocalStartStr, TIMEZONE)
                    const slotUtcEnd = fromZonedTime(slotLocalEndStr, TIMEZONE)
    
                    // Validación de Reservas
                    const staffBookings = bookings?.filter(b => b.staff_id === schedule.staff_id) || []
                    const hasBookingConflict = staffBookings.some(booking => {
                        const bookingStartUtc = new Date(booking.start_time)
                        const bookingEndUtc = new Date(booking.end_time)
    
                        return (slotUtcStart < bookingEndUtc && slotUtcEnd > bookingStartUtc)
                    })
    
                    if (hasBookingConflict) {
                        isAvailable = false
                    }
    
                    // Validación de Bloqueos
                    if (isAvailable) {
                        const staffBlocks = blockedPeriods?.filter(b => b.staff_id === schedule.staff_id) || []
                        const hasBlockConflict = staffBlocks.some(block => {
                            const blockStartUtc = new Date(block.start_date)
                            const blockEndUtc = new Date(block.end_date)
    
                            return (slotUtcStart < blockEndUtc && slotUtcEnd > blockStartUtc)
                        })
    
                        if (hasBlockConflict) {
                            isAvailable = false
                        }
                    }
                }

                if (isAvailable) {
                    slotsSet.add(timeString)
                }
            }
        })

        const sortedSlots = Array.from(slotsSet).sort((a, b) => timeToMins(a) - timeToMins(b))

        return { success: true, slots: sortedSlots }

    } catch (error) {
        console.error('Error calculando la disponibilidad: ', error)
        return { error: 'Error interno calculando disponibilidad.' }
    }
}
'use server'

import { cancelBookingAction } from "@/app/dashboard/agenda/actions"
import { createClient } from "@/utils/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { fromZonedTime } from "date-fns-tz"
import { revalidatePath } from "next/cache"

const TIMEZONE = 'Europe/Madrid'

export async function getMemberSchedule(memberId: string) {
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
        if (profile.role !== 'admin' && user.id !== memberId) return { error: 'No tienes los permisos para modificar este horario.' }

        const { data: memberSchedule, error: errorSchedule } = await supabase
            .from('staff_schedules')
            .select('*')
            .eq('staff_id', memberId)
            .eq('business_id', profile.business_id)


        const { data: blockedPeriods, error: errorBlocks } = await supabase
            .from('blocked_periods')
            .select('*')
            .eq('business_id', profile.business_id)
            .eq('staff_id', memberId)
            .order('start_date', { ascending: true })

        if (errorSchedule || errorBlocks) return { error: 'Error obteniendo el horario.', schedule: [], blockedPeriods: [] }

        return {
            success: true,
            schedule: memberSchedule || [],
            blockedPeriods: blockedPeriods || []
        }

    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno.' }
    }
}

export async function updateMemberSchedule(memberId: string, memberSchedule: {
    start_time: string | null
    end_time: string | null
    break_start: string | null
    break_end: string | null
    day_of_week: number
    is_working: boolean
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
        if (profile.role !== 'admin' && memberId !== user.id) return { error: 'No tienes permisos para modificar el horario de otro miembro.' }

        if (!memberSchedule.is_working) {
            const { error: errorDelete } = await supabase
                .from('staff_schedules')
                .delete()
                .eq('staff_id', memberId)
                .eq('business_id', profile.business_id)
                .eq('day_of_week', memberSchedule.day_of_week)

            if (errorDelete) return { error: 'Error al marcar el dia como libre.' }

            return { success: true }
        }
        
        const { data: business } = await supabase
            .from('businesses')
            .select('open_hour, close_hour')
            .eq('id', profile.business_id)
            .single()

        if (!business) return { error: 'Error obteniendo datos del negocio' }


        const timeToMins = (time: string) => {
            if (!time) return
            const [h, m] = time.split(':').map(Number)
            return h * 60 + m
        }

        const openHour = timeToMins(business.open_hour)
        const closeHour = timeToMins(business.close_hour)

        if (memberSchedule.is_working) {
            if (!memberSchedule.start_time || !memberSchedule.end_time) {
                return { error: 'Debes especificar una hora de entrada y una hora de salida para los dias laborables.' }
            }

            const startTime = timeToMins(memberSchedule.start_time)
            const endTime = timeToMins(memberSchedule.end_time)

            if (startTime! >= endTime!) {
                return { error: 'La hora de fin debe ser posterior a la hora de inicio.' }
            }

            if (startTime! < openHour! || endTime! > closeHour!) {
                return { error: `El horario excede la apertura del local (${business.open_hour} a ${business.close_hour})` }
            }

            if (memberSchedule.break_start && memberSchedule.break_end && memberSchedule.break_start !== '' && memberSchedule.break_end !== '') {
                const breakStart = timeToMins(memberSchedule.break_start!)
                const breakEnd = timeToMins(memberSchedule.break_end!)

                if (breakStart && breakEnd) {
                    if (breakStart < startTime!) {
                        return { error: 'El inicio del break no puede ser menor al inicio del horario.' }
                    } else if (breakEnd > endTime!) {
                        return { error: 'El inicio del break no puede ser posterior al fin del horario.' }
                    } else if (breakStart >= breakEnd) {
                        return { error: 'El fin del break debe ser mayor al inicio.' }
                    }
                }
            }
        }

        const payload = {
            staff_id: memberId,
            business_id: profile.business_id,
            day_of_week: memberSchedule.day_of_week,
            is_working: memberSchedule.is_working,
            start_time: memberSchedule.is_working ? memberSchedule.start_time : '00:00:00',
            end_time: memberSchedule.is_working ? memberSchedule.end_time : '00:00:00',
            break_start: memberSchedule.break_start,
            break_end: memberSchedule.break_end
        }

        const { error: errorUpdate } = await supabase
            .from('staff_schedules')
            .upsert(payload, { onConflict: 'staff_id, day_of_week' })

        if (errorUpdate) return { error: 'Error actualizando el horario.' }

        return { success: true }

    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno.' }
    }
}

export async function createBlockedPeriods(memberId: string, blockedPeriod: {
    start_date: string
    end_date: string
    reason: string
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
        if (profile.role !== 'admin' && memberId !== user.id) return { error: 'No tienes los permisos para crear periodos bloqueados a otros miembros.' }

        const startDate = fromZonedTime(blockedPeriod.start_date, TIMEZONE)
        const endDate = fromZonedTime(blockedPeriod.end_date, TIMEZONE)

        if ((isNaN(startDate.getTime())) || (isNaN(endDate.getTime()))) return { error: 'El formato de las fechas no es válido.' }

        if (startDate >= endDate) return { error: 'La fecha de fin debe de ser posterior a la de inicio.' }

        const payload = {
            business_id: profile.business_id,
            staff_id: memberId,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            reason: blockedPeriod.reason,
            status: 'active'
        }

        const { error: errorBlockedPeriod } = await supabase
            .from('blocked_periods')
            .insert(payload)

        if (errorBlockedPeriod) return { error: 'Error al crear el periodo bloqueado.' }

        return { success: true }

    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno.' }
    }
}

export async function deleteBlockedPeriod(periodId: string, memberId: string) {
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
        if (profile.role !== 'admin' && memberId !== user.id) return { error: 'No estas autorizado a eliminar este periodo de bloqueo.' }

        const { error: errorDelete } = await supabase
            .from('blocked_periods')
            .delete()
            .eq('business_id', profile.business_id)
            .eq('staff_id', memberId)
            .eq('id', periodId)

        if (errorDelete) return { error: 'Error eliminando el periodo bloqueado.' }

        return {
            success: true
        }
    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno.' }
    }
}

export async function deleteMember (memberId: string) {
    try {
        if (!memberId) return { error: 'ID del miembro no proporcionado.' }

        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'No estás autenticado.' }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role, business_id')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            return { error: "No tienes permisos para eliminar miembros" };
        }
        if (memberId === user.id) {
            return { error: "No puedes eliminar tu propia cuenta de administrador." };
        }

        const { data: targetProfile } = await supabase
            .from('profiles')
            .select('business_id')
            .eq('id', memberId)
            .single()

        if (targetProfile?.business_id !== profile.business_id) {
            return { error: 'Este usuario no pertenece a tu negocio.' }
        }

        const { data: bookings, error: errorUpdate } = await supabase
            .from('bookings')
            .select('*')
            .eq('business_id', targetProfile?.business_id)
            .eq('staff_id', memberId)
            .in('status', ['confirmed', 'pending_payment'])

        if (errorUpdate) return { error: 'Error eliminando las reservas del usuario, vuelve a intentarlo.' }

        if (bookings && bookings.length > 0) {
            await Promise.all(bookings.map(b => cancelBookingAction(b.id)))
        }

        const supabaseAdmin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!   
        )

        await supabaseAdmin.from('bookings').delete().eq('staff_id', memberId)
        await supabaseAdmin.from('staff_schedules').delete().eq('staff_id', memberId);
        await supabaseAdmin.from('blocked_periods').delete().eq('staff_id', memberId);

        const { error: errorDeleteProfile } = await supabaseAdmin
            .from('profiles')
            .delete()
            .eq('id', memberId);

        if (errorDeleteProfile) {
            console.error('Error borrando el profile:', errorDeleteProfile);
            return { error: "Error al eliminar el perfil público del trabajador." };
        }

        const { error: errorDelete } = await supabaseAdmin.auth.admin.deleteUser(memberId)

        if (errorDelete) {
            console.error('Error interno eliminando auth user: ', errorDelete);
            return { error: "Error al eliminar el usuario del sistema." };
        }

        revalidatePath('/dashboard/equipo')
        return { success: true }

    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error inseperado al eliminar el miembro.' }
    }
}
'use server'

import { createClient } from "@/utils/supabase/server"
import { deleteService } from '@/app/dashboard/servicios/actions';
import { error } from "console";

export async function getMemberSchedule (memberId: string) {
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

export async function updateMemberSchedule (memberId: string, memberSchedule: {
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

        const { data: business } = await supabase
            .from('business')
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

            if (memberSchedule.break_start && memberSchedule.break_end) {
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


        const { error: errorUpdate } = await supabase
            .from('staff_schedules')
            .upsert({
                staff_id: memberId,
                business_id: profile.business_id,
                day_of_week: memberSchedule.day_of_week,
                is_working: memberSchedule.is_working,
                start_time: memberSchedule.start_time,
                end_time: memberSchedule.end_time,
                break_start: memberSchedule.break_start,
                break_end: memberSchedule.break_end
            }, {
                onConflict: 'staff_id, day_of_week'
            })
            

        if (errorUpdate) return { error: 'Error actualizando el horario.' }

        return { success: true }

    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno.' }
    }
}

export async function createBlockedPeriods (memberId: string, blockedPeriod: {
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

        const startDate = new Date(blockedPeriod.start_date)
        const endDate = new Date(blockedPeriod.end_date)

        if ((isNaN(startDate.getTime())) || (isNaN(endDate.getTime()))) return { error: 'El formato de las fechas no es válido.' }

        if (startDate >= endDate) return { error: 'La fecha de fin debe de ser posterior a la de inicio.' }

        const { error: errorBlockedPeriod } = await supabase
            .from('blocked_periods')
            .insert({
                business_id: profile.business_id,
                staff_id: memberId,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                reason: blockedPeriod.reason,
                status: 'active'
            })

        if (errorBlockedPeriod) return { error: 'Error al crear el periodo bloqueado.' }

        return { success: true }
        
    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno.' }
    }
}

export async function deleteBlockedPeriod (periodId: string, memberId: string) {
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
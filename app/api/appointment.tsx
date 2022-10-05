import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Appointment } from "../models"

let supabaseClient:SupabaseClient

const getAppointments = async (orderBy:keyof Appointment = 'title', ascending:boolean = false, filter:string | null = null) => {
    const { data: appointments } = await getSupabaseClient()
        .from<Appointment>('appointments')
        .select('*')
        .order(orderBy??'title', { ascending: ascending })
        .like('title', filter ? '%'+ filter +'%' : '%%')

    return appointments
}

const addAppointment = async (title:string | undefined, date:string, time_start:string, time_end:string) => {

    const { data, error } = await getSupabaseClient().from<Appointment>('appointments').insert([
        {
            title: title,
            date: new Date(date),
            time_start: time_start,
            time_end: time_end
        },
    ])

    return { data, error }
}

const deleteAppointment = async (appointmentId:number) => {

    const { data, error } = await getSupabaseClient().from<Appointment>('appointments')
        .delete()
        .match({ id: appointmentId })

    return { data, error }
}

const checkDateTimeAvailable = async (dateToCompare:string, timeStartToCompare:string, timeEndToCompare:string) => {
    const { data: appointments, error } = await getSupabaseClient()
        .rpc('check_available_appointment', {
            dateap: dateToCompare,
            timestart: timeStartToCompare,
            timeend: timeEndToCompare
        })

    return appointments
}

const getSupabaseClient = ():SupabaseClient => {

    if (supabaseClient) {
        return supabaseClient;
    }

    supabaseClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_TOKEN!)

    return supabaseClient
}

export { getAppointments, addAppointment, deleteAppointment, checkDateTimeAvailable }
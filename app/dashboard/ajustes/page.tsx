import { SettingsForm } from "@/components/dashboard/ajustes/SettingsForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Ajustes",
}

export default async function SettingsPage () {
    
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')
    
    const { data: profile } = await supabase
        .from('profiles')
        .select(`
            *,
            businesses (
                name,
                address,
                phone,
                open_hour,
                close_hour,
                slot_interval  
            )
            `)
            .eq('id', user.id)
            .single()
    
    if (profile.role !== 'admin') {
        redirect('/dashboard')
    }

    const business = profile?.businesses

    if (!business) return <div>No se encontró el negocio</div>

    return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in py-6 stagger-container">
      <div className="border-b border-zinc-800 pb-6 stagger-container">
        <h1 className="text-2xl font-bold font-unbounded text-white">Ajustes</h1>
        <p className="text-zinc-400 mt-2">
          Actualiza la información pública de tu establecimiento.
        </p>
      </div>

      {/* 3. Pasamos los datos reales al formulario */}
      <SettingsForm initialData={business} />
    </div>
  )

}
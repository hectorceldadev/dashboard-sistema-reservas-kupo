import { Sidebar } from "@/components/dashboard/Sidebar"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(`
      *,
      businesses(
        name,
        slug,
        subscription_status
      )
      `)
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error("Error fetching profile:", profileError)
    // Opción: Redirigir a una página de error o de "Terminar configuración"
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
            <div className="p-6 border border-red-500 rounded-lg bg-red-900/20">
                <h1 className="font-bold text-xl mb-2">Error de Cuenta</h1>
                <p>No se encontraron datos del negocio asociados a este usuario.</p>
            </div>
        </div>
    )
  }

  const businessName = profile.businesses.name || 'Mi Negocio' // Mock data por ahora

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-yellow-500/30 selection:text-yellow-200">
      <Sidebar businessName={businessName} />
      <main className="md:ml-72 min-h-screen transition-all duration-300 ease-in-out relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-yellow-500/5 blur-[100px] pointer-events-none -z-10" />
        <div className="p-8 lg:p-12 max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
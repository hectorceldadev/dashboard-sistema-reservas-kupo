import { Sidebar } from "@/components/dashboard/menu/Sidebar"
import { createClient } from "@/utils/supabase/server"
import { AlertTriangle } from "lucide-react"
import { redirect } from "next/navigation"
import { signOut } from "../login/actions"

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-200 p-4">
        <div className="max-w-md w-full bg-zinc-900/50 border border-red-500/20 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6 text-center">

          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          <div className="space-y-2 pb-2">
            <h1 className="font-bold text-2xl text-white">Error de Cuenta</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Hemos detectado tu usuario ({user.email}), pero no encontramos un perfil de negocio asociado.
            </p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold py-3 rounded-xl transition-all"
            >

              
                Volver a inciar sesión
              
            </button>
          </form>
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
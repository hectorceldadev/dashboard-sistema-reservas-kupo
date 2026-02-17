import { Sidebar } from "@/components/dashboard/Sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  // AQUÍ VA TU LÓGICA DE VERIFICACIÓN DE USUARIO (Supabase/NextAuth)
  // const user = await getUser();
  // if (!user) redirect('/login');
  
  const businessName = "Barbería Estilo" // Mock data por ahora

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-yellow-500/30 selection:text-yellow-200">
        
        <Sidebar businessName={businessName}/>

      {/* Contenido Principal */}
      {/* md:ml-72: Debe coincidir con el ancho del sidebar (w-72) */}
      <main className="md:ml-72 min-h-screen transition-all duration-300 ease-in-out relative">
        
        {/* Luz ambiental superior para que el dashboard no sea plano */}
        <div className="absolute top-0 left-0 w-full h-96 bg-yellow-500/5 blur-[100px] pointer-events-none -z-10" />

        <div className="p-8 lg:p-12 max-w-7xl mx-auto animate-fade-in">
            {children}
        </div>
      </main>
    </div>
  )
}
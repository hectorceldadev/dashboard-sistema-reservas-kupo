import { getCustomers } from "./actions"
import { Clientes } from "@/components/dashboard/clientes/Clientes"

export const metadata = {
    title: 'Clientes',
    description: 'Gestión de clientes de tu negocio',
}

const Page = async () => {
    // Obtenemos los datos del servidor
    const response = await getCustomers()

    // Manejo seguro de errores de base de datos
    if (response.error) {
        return (
            <div className="p-4 md:p-12">
                <div className="p-6 text-center text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    {response.error}
                </div>
            </div>
        )
    }

    const customers = response.customers || []

    return (
        <div className="p-4 max-w-7xl mx-auto h-full">
            <Clientes customers={customers} />
        </div>
    )
}

export default Page
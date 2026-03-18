import LoginPage from "@/components/sesion/Login"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Iniciar sesión",
    description: "Accede a tu panel de control de KUPO. Gestiona tu agenda, clientes y configuración de forma rápida y segura.",
}

export default function page () {
    return (
        <LoginPage />
    )
}
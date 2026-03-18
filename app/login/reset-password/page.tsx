import { UpdatePasswordPage } from "@/components/sesion/ResetPassword"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Reestablecer contraseña",
    description: "Establece una nueva contraseña segura para tu cuenta de KUPO y recupera el acceso a tu panel de control.",
}

export default function page () {
    return (
        <UpdatePasswordPage />
    )
}
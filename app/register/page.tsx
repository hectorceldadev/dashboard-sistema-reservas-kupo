import { Register } from "@/components/sesion/Register";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Solicitar acceso",
    description: "Da el salto digital. Solicita tu acceso a KUPO y transforma la gestión de tu negocio hoy mismo.",
}

export default function page () {
    return (
        <Register />
    )
}
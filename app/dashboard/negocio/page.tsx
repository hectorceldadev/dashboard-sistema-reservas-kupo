import NegocioDashboard from "@/components/dashboard/negocio/NegocioDashboard";
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Mi Negocio",
}

export default function MiNegocioPage() {
    return (
        <NegocioDashboard />
    )
}
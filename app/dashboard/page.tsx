import { DashboardHome } from "@/components/dashboard/home/DashboardHome";
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Resumen",
    description: "Métricas y resumen de actividad de tu negocio.",
}

export default function DashBoardPage () {

  return (
    <DashboardHome />
  )
}




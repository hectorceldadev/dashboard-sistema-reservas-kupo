import { Servicios } from "@/components/dashboard/servicios/Servicios"
import { getServices } from "./actions"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Servicios",
}

const page = async () => {

  const response = await getServices()

  if (response.error) return (
    <div>
      <span>Error cargando los servicios.</span>
    </div>
  )

  const servicios = response.servicios || []
  const profile = response.profile || []

  return (
    <div>
      <Servicios servicios={servicios} profile={profile} />
    </div>
  )
}

export default page

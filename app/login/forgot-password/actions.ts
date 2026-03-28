'use server'

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

// El prevState es necesario para que funcione con el hook useActionState
export async function sendResetEmail(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  // Obtenemos la URL actual (localhost o dominio) para construir el link de vuelta correctamente
  const email = formData.get("email") as string;

  const headersList = await headers()
  
  const host = headersList.get('host') || 'www.kupo.es'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const urlDestino = `${protocol}://${host}/auth/callback?next=/login/reset-password`

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // IMPORTANTE: Aquí definimos a dónde va el usuario cuando hace clic en el email.
    // Lo mandamos a un endpoint de callback que valida el token y luego al dashboard.
    redirectTo: urlDestino, 
  });

  if (error) {
    console.error(error); // Para que lo veas en tu consola si falla
    return { error: "No pudimos enviar el correo. Verifica que el email sea correcto o espera unos minutos." };
  }

  return { 
    success: "Revisa tu bandeja de entrada (y spam). Hemos enviado el enlace de recuperación." 
  };
}
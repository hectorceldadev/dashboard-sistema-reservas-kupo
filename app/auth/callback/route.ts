import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 1. Supabase nos envía a esta URL con un código en los parámetros (?code=...)
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  
  // "next" es a donde queremos ir después. 
  // En la action anterior definimos que fuera "/dashboard/ajustes"
  // Si no viene definido, por defecto lo mandamos al dashboard general.
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    // 2. Iniciamos el cliente de Supabase
    const supabase = await createClient();
    
    // 3. ¡LA CLAVE! Intercambiamos ese código de un solo uso por una sesión real (cookies)
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // 4. Si todo ha ido bien, redirigimos al usuario a donde queríamos (el dashboard)
      // Ahora el usuario ya tiene la cookie y el middleware le dejará pasar.
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 5. Si algo falla (código inválido o caducado), lo devolvemos al login con un error
  return NextResponse.redirect(`${origin}/login?error=auth_code_error`);
}
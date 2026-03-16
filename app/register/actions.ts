'use server'

import { createClient } from "@/utils/supabase/server"
import { Resend } from "resend"

export async function newBusinessImplementation(newBusiness: {
    name: string | null
    business_name: string | null
    email: string | null
    phone: string | null
}) {
    try {
        if (!newBusiness.name || !newBusiness.business_name || !newBusiness.email || !newBusiness.phone) return { error: 'Datos inválidos' }

        const supabase = await createClient()

        const { error } = await supabase
            .from('onboarding_requests')
            .insert({
                name: newBusiness.name,
                business_name: newBusiness.business_name,
                email: newBusiness.email,
                phone: newBusiness.phone
            })

        if (error) return { error: 'Error enviando la solicitud, vuelve a intentarlo' }

        if (process.env.RESEND_API_KEY) {
            try {
                const resend = new Resend(process.env.RESEND_API_KEY)

                resend.emails.send({
                    from: 'Solicitud de Implementación KUPO <onboarding@resend.dev>',
                    to: 'celdajusticiahector@gmail.com',
                    subject: `Implementación sistema KUPO | ${newBusiness.business_name}`,
                    html: `
                        <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Solicitud de implementación sistema KUPO</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000; margin: 0; padding: 40px 0;">
  
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #09090b; border-radius: 16px; border: 1px solid #27272a; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5); overflow: hidden;">
    
    <tr>
      <td style="padding: 32px 40px; background-color: #09090b; border-bottom: 1px solid #27272a; text-align: center;">
        <span style="font-size: 24px; font-weight: 800; color: #eab308; letter-spacing: -0.5px;">KUPO</span>
      </td>
    </tr>

    <tr>
      <td style="padding: 40px;">
        
        <div style="display: inline-block; padding: 6px 16px; background-color: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.2); border-radius: 99px; color: #eab308; font-size: 13px; font-weight: 700; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.05em;">
          ✨ Nuevo Lead
        </div>

        <h1 style="margin: 0 0 20px; font-size: 24px; font-weight: 700; color: #ffffff;">¡Tienes una nueva solicitud!</h1>
        
        <p style="margin: 0 0 32px; font-size: 16px; line-height: 26px; color: #a1a1aa;">
          Un nuevo negocio quiere dar el salto digital con tu sistema. Aquí tienes sus datos de contacto para que puedas llamarle y preparar su configuración.
        </p>

        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #18181b; border-radius: 12px; border: 1px solid #27272a; margin-bottom: 32px;">
          <tr>
            <td style="padding: 24px;">
              <p style="margin: 0 0 16px; font-size: 15px; color: #a1a1aa;"><strong style="color: #ffffff; display: inline-block; width: 80px;">Negocio:</strong> ${newBusiness.business_name}</p>
              <p style="margin: 0 0 16px; font-size: 15px; color: #a1a1aa;"><strong style="color: #ffffff; display: inline-block; width: 80px;">Contacto:</strong> ${newBusiness.name}</p>
              <p style="margin: 0 0 16px; font-size: 15px; color: #a1a1aa;"><strong style="color: #ffffff; display: inline-block; width: 80px;">Email:</strong> ${newBusiness.email}</p>
              <p style="margin: 0; font-size: 15px; color: #a1a1aa;"><strong style="color: #ffffff; display: inline-block; width: 80px;">Teléfono:</strong> ${newBusiness.phone}</p>
            </td>
          </tr>
        </table>

        <a href="tel:${newBusiness.phone}" style="display: block; width: 100%; box-sizing: border-box; padding: 16px 32px; background-color: #eab308; color: #09090b; text-decoration: none; font-weight: 700; font-size: 16px; border-radius: 12px; text-align: center;">
          Llamar ahora &rarr;
        </a>
        
      </td>
    </tr>

    <tr>
      <td style="padding: 24px 40px; background-color: #09090b; border-top: 1px solid #27272a;">
        <p style="margin: 0; font-size: 13px; color: #52525b; text-align: center;">
          Notificación automática del sistema de Onboarding.
        </p>
      </td>
    </tr>
  </table>

</body>
</html>
                    `
                })
            } catch (error) {
                console.error('Error enviando el email de implementación de sistema KUPO: ', error)
            }
        }

        return { success: true }
    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno, vuelve a intentarlo' }
    }
}


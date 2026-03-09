// app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kupo - Sistema de Reservas',
    short_name: 'Kupo',
    description: 'Gestiona la agenda y las reservas de tu negocio fácilmente.',
    start_url: '/',
    display: 'standalone',      // Esto oculta la barra del navegador (efecto App nativa)
    background_color: '#09090b', // Tu color de fondo (zinc-950) para la pantalla de carga
    theme_color: '#eab308',      // Tu color principal (yellow-500) para la barra de estado del móvil
    orientation: 'portrait',     // Bloquea la app en vertical (opcional)
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable' // Ayuda a que el icono se adapte mejor en Android
      },
    ],
  }
}
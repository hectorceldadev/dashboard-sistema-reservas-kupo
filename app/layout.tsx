import type { Metadata, Viewport } from "next";
import { Poppins, Unbounded, Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sileo";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ["latin"]
})

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin']
})

const unbounded = Unbounded({
  variable: "--font-unbounded",
  weight: 'variable',
  subsets: ['latin']
})

export const metadata: Metadata = {
  // Asegúrate de cambiar 'http://localhost:3000' por tu dominio real cuando salgas a producción (ej. 'https://kupo.es')
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  
  title: {
    default: "KUPO | Sistema de reservas y gestión para tu negocio",
    template: "%s | KUPO" // La magia: si en otra página pones título "Login", se verá "Login | KUPO"
  },
  description: "Maximiza tu eficiencia operativa. Gestiona reservas, clientes y equipo en tiempo real con KUPO, el sistema diseñado para negocios de alto rendimiento.",
  keywords: ["sistema de reservas", "software para barberías", "gestión de salones", "agenda online", "kupo", "software peluquerías"],
  authors: [{ name: "KUPO" }],
  creator: "KUPO",
  
  // Open Graph (Cómo se ve cuando comparten tu enlace por WhatsApp, LinkedIn, etc.)
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    title: "KUPO | Sistema de reservas para negocios de alto rendimiento",
    description: "Gestiona reservas, clientes y equipo en tiempo real con KUPO.",
    siteName: "KUPO",
    images: [
      {
        url: "/openGraph.png", // Asegúrate de tener esta imagen en tu carpeta public/
        width: 1200,
        height: 630,
        alt: "KUPO Dashboard Preview",
      },
    ],
  },
  
  // Twitter / X Cards
  twitter: {
    card: "summary_large_image",
    title: "KUPO | Sistema de reservas",
    description: "Gestiona reservas y clientes en tiempo real con KUPO.",
    images: ["/icon-512x512.png"],
  },
  
  // Apple PWA
  appleWebApp: {
    capable: true,
    title: "Kupo",
    statusBarStyle: "black",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b", // El color zinc-950 de tu fondo
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Evita que la app se haga zoom al tocar inputs en iOS
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body
          className={` ${poppins.variable} ${unbounded.variable} ${geist.variable} antialiased`}
        >
          <div className="relative z-9999 font-geist">
            <Toaster 
              options={{
                  fill: "black",
                  styles: {
                      title: 'text-white font-bold',
                      description: 'text-white',
                  },
                  position: 'top-center'
              }}
            />
          </div>
          {children}
        </body>
      </html>
    </>
  );
}

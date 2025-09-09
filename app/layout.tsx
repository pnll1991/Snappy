import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Open_Sans, Lora } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsappButton from "@/components/whatsapp-button"
import { cn } from "@/lib/utils"

// New typography: Montserrat (heading/accent), Open Sans (body), Lora (display)
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Snappy Coaching - Formación Universitaria en Coaching Ontológico",
  description:
    "Diplomaturas y cursos 100% online para coaches ontológicos. Obtené una certificación universitaria con el respaldo de la UAI.",
  icons: { icon: "/logo.png" },
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preload" href="/logo-snappy.png" as="image" />
        <link rel="preload" href="/uai-logo-white.png" as="image" />
      </head>
      <body
        className={cn(
          "font-body text-dark antialiased bg-app-texture",
          montserrat.variable, // Montserrat
          openSans.variable, // Open Sans
          lora.variable, // Lora
        )}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsappButton />
      </body>
    </html>
  )
}

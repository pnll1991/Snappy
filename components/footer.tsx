import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const year = new Date().getFullYear()
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491141498531"
  const whatsappLink = `https://wa.me/${number}?text=${encodeURIComponent("Hola Snappy Coaching, quiero más información.")}`

  return (
    <footer className="relative glass text-foreground pt-12">
      {/* Soft accent wash behind the glass for depth */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div className="container">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Brand + UAI seal */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex">
              <Image
                src="/logo-snappy.png"
                alt="Snappy Coaching"
                width={180}
                height={45}
                loading="lazy"
                sizes="180px"
              />
            </Link>
            <p className="body-base text-foreground/80">Formación Universitaria en Coaching Ontológico 100% online.</p>
            <div className="rounded-lg border border-white/30 dark:border-white/10 p-4 flex items-center gap-4 bg-white/50 dark:bg-neutral-900/40">
              <div className="shrink-0">
                <Image
                  src="/uai-certifica-logo.jpeg"
                  alt="CERTIFICA UAI - Universidad Abierta Interamericana"
                  width={140}
                  height={42}
                  loading="lazy"
                  sizes="140px"
                />
              </div>
              <p className="body-small text-foreground/70">Con el respaldo académico de la UAI.</p>
            </div>
          </div>

          {/* Real site sections only */}
          <nav aria-label="Secciones del sitio" className="grid grid-cols-1 gap-8">
            <div>
              <h3 className="heading-6 mb-3">Secciones</h3>
              <ul className="space-y-2 text-base">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/cursos" className="hover:text-primary transition-colors">
                    Diplomaturas
                  </Link>
                </li>
                <li>
                  <Link href="/#benefits" className="hover:text-primary transition-colors">
                    Beneficios
                  </Link>
                </li>
                <li>
                  <Link href="/#sobre" className="hover:text-primary transition-colors">
                    Equipo docente
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="hover:text-primary transition-colors">
                    Preguntas frecuentes
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="hover:text-primary transition-colors">
                    Acceso a administración
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* Contact + WhatsApp only (no invented socials) */}
          <div>
            <h3 className="heading-6 mb-3">Contacto</h3>
            <ul className="space-y-2 text-base">
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 mt-0.5 text-primary" />
                <a className="hover:text-primary transition-colors" href="mailto:info@snappycoaching.com">
                  info@snappycoaching.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-5 w-5 mt-0.5 text-primary" />
                <a className="hover:text-primary transition-colors" href={`tel:+5491141498531`}>
                  +54 9 11 4149-8531
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                <span>Argentina · Online</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-white/30 dark:border-white/10" />

        {/* Bottom strip: only copyright (remove privacy/terms/etc.) */}
        <div className="py-6 flex items-center justify-center">
          <p className="body-small text-foreground/70">© {year} Snappy Coaching. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

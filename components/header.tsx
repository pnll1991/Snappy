"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MenuIcon, X } from "lucide-react"
import { useState } from "react"

const navLinks = [
  { href: "/#sobre", label: "Sobre Snappy" },
  { href: "/cursos", label: "Diplomaturas" },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border"
      style={{
        background:
          "linear-gradient(135deg, rgba(228, 103, 21, 0.08) 0%, rgba(102, 41, 56, 0.06) 50%, rgba(255, 255, 255, 0.95) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <Image
              src="/logo-snappy.png"
              alt="Snappy Coaching Logo"
              width={140}
              height={35}
              className="sm:w-[180px] sm:h-[45px]"
              priority
              sizes="(max-width: 640px) 140px, 180px"
            />
            <div
              className="block bg-red-800 px-1.5 py-1 sm:px-3 sm:py-2 rounded-md transition-all duration-200"
              style={{ backgroundColor: "rgb(102, 41, 56)" }}
            >
              <Image
                src="/uai-nuevo-logo.png"
                alt="UAI Logo"
                width={100}
                height={25}
                className="object-contain w-auto h-4 sm:h-6 md:h-7"
                priority
                sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 120px"
              />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-base font-medium text-foreground transition-all duration-200 hover:text-primary px-3 py-2 rounded-md hover:bg-primary/5 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
            <Button
              asChild
              variant="default"
              size="default"
              className="font-accent ml-4 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Link href="https://campus.snappycoaching.ar/acceso.cgi" target="_blank" rel="noopener noreferrer">
                Campus
              </Link>
            </Button>
          </nav>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="glass"
                size="icon"
                className="h-10 w-10 sm:h-12 sm:w-12 hover:bg-primary/10 transition-colors duration-200"
                aria-label="Abrir menú de navegación"
              >
                <MenuIcon className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] sm:w-[350px] border-border shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(228, 103, 21, 0.08) 0%, rgba(102, 41, 56, 0.06) 50%, rgba(255, 255, 255, 0.98) 100%)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              <div className="flex items-center justify-between p-6 border-b border-border/20">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <Image
                    src="/logo-snappy.png"
                    alt="Snappy Coaching Logo"
                    width={140}
                    height={35}
                    loading="lazy"
                    sizes="140px"
                  />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 hover:bg-primary/10"
                  aria-label="Cerrar menú"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <nav className="flex flex-col gap-2 p-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-semibold text-foreground transition-all duration-200 hover:text-primary hover:bg-primary/5 px-4 py-3 rounded-lg border border-transparent hover:border-primary/20"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="mt-6 pt-6 border-t border-border/20">
                  <Button
                    asChild
                    variant="default"
                    size="lg"
                    className="w-full font-accent text-base py-3 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Link
                      href="https://campus.snappycoaching.ar/acceso.cgi"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                    >
                      Acceder al Campus
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

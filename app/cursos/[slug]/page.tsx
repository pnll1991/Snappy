import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getCourseBySlug } from "@/app/admin/actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Award, Calendar, Clock, MessageCircle } from "lucide-react"

// Dynamic metadata for better route announcements by assistive tech [^1]
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug)
  const course = await getCourseBySlug(slug)
  if (!course) {
    return {
      title: "Diplomatura no encontrada",
      description: "La diplomatura solicitada no existe o fue movida.",
    }
  }
  return {
    title: `${course.title} — Snappy Coaching`,
    description: course.description,
    openGraph: {
      title: `${course.title} — Snappy Coaching`,
      description: course.description || undefined,
      images: course.image ? [{ url: course.image }] : undefined,
    },
  }
}

function getWhatsAppLink(title: string) {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5493416414491"
  const phone = (raw || "").replace(/\D/g, "") || "5493416414491"
  const text = encodeURIComponent(`Quiero saber más sobre ${title}!`)
  return `https://wa.me/${phone}?text=${text}`
}

export default async function CoursePage({
  params,
}: {
  params: { slug: string }
}) {
  const slug = decodeURIComponent(params.slug)
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const waLink = getWhatsAppLink(course.title)

  return (
    <div className="bg-transparent section-spacing">
      <div className="container">
        {/* Header */}
        <div className="content-spacing-sm text-center">
          <h1 className="heading-1 text-primary">{course.title}</h1>
          {course.description && (
            <p className="body-large max-w-3xl mx-auto text-muted-foreground mt-4">{course.description}</p>
          )}
        </div>

        {/* Top grid: image + stats/cta */}
        <div className="grid grid-cols-1 lg:grid-cols-2 element-spacing items-start content-spacing">
          {/* Image */}
          <Card className="overflow-hidden glass-card place-self-center w-full max-w-[680px]">
            <div className="relative w-full aspect-square">
              {course.image ? (
                <Image
                  src={course.image || "/placeholder.svg"}
                  alt={`Imagen de ${course.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <Image
                  src="/placeholder.svg?height=800&width=800"
                  alt="Imagen de curso no disponible"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              )}
            </div>
          </Card>

          {/* Facts + CTA */}
          <div className="space-y-6 self-start">
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="heading-6">Información clave</CardTitle>
                <CardDescription className="body-small">Datos principales de la diplomatura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-display">
                    <span className="text-muted-foreground">Duración:</span> {course.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-display">
                    <span className="text-muted-foreground">Modalidad:</span> {course.modality}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="font-display">
                    <span className="text-muted-foreground">Certificación:</span> {course.certification}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex flex-col gap-3 w-full">
                  <Button
                    asChild
                    size="default"
                    className="w-full font-accent bg-green-600 text-white hover:bg-green-700"
                  >
                    <Link
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Consultar por WhatsApp sobre ${course.title}`}
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Consultar por WhatsApp
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Professionals (compact) */}
            {course.professionals && course.professionals.length > 0 && (
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="heading-6">Profesionales</CardTitle>
                  <CardDescription className="body-small">Equipo docente de la diplomatura</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    {course.professionals.map((prof, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Avatar className="w-10 h-10 ring-2 ring-background shrink-0">
                          <AvatarImage
                            src={prof.image || "/placeholder.svg?height=80&width=80&query=instructor"}
                            alt={prof.name}
                          />
                          <AvatarFallback>{prof.name?.substring(0, 2) || "PR"}</AvatarFallback>
                        </Avatar>
                        <div className="leading-tight flex-1 min-w-0">
                          <div className="text-sm font-medium">{prof.name}</div>
                          {prof.role && (
                            <div className="text-sm text-muted-foreground whitespace-pre-line break-words">
                              {prof.role}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Content */}
        <section id="programa" className="grid grid-cols-1 element-spacing">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="heading-3">Programa</CardTitle>
              <CardDescription>Contenido y unidades</CardDescription>
            </CardHeader>
            <CardContent>
              {course.content_md ? (
                <article className="prose prose-neutral max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{course.content_md}</ReactMarkdown>
                </article>
              ) : (
                <p className="text-muted-foreground">El programa detallado estará disponible próximamente.</p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

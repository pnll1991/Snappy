"use client"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"

import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"
import Link from "next/link"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import type { Course } from "@/app/admin/actions"
import dynamic from "next/dynamic"
import { BookOpen, Award, Users, MessageCircle } from "lucide-react"
import CourseCard from "@/components/course-card"
import { CachedAvatar } from "@/components/cached-image"

const Carousel = dynamic(() => import("@/components/ui/carousel").then((m) => ({ default: m.Carousel })), {
  ssr: false,
})
const CarouselContent = dynamic(
  () => import("@/components/ui/carousel").then((m) => ({ default: m.CarouselContent })),
  {
    ssr: false,
  },
)
const CarouselItem = dynamic(() => import("@/components/ui/carousel").then((m) => ({ default: m.CarouselItem })), {
  ssr: false,
})
const CarouselNext = dynamic(() => import("@/components/ui/carousel").then((m) => ({ default: m.CarouselNext })), {
  ssr: false,
})
const CarouselPrevious = dynamic(
  () => import("@/components/ui/carousel").then((m) => ({ default: m.CarouselPrevious })),
  { ssr: false },
)

type TeamMember = {
  name: string
  role: string
  image: string
  bio?: string
  highlights?: string[]
}

interface HomeClientProps {
  latestCourses: Course[]
  teamMembers: TeamMember[]
  testimonials: { name: string; text: string }[]
}

export default function HomeClient({ latestCourses, teamMembers, testimonials }: HomeClientProps) {
  const [heroTitleRef, isHeroTitleInView] = useInView({ threshold: 0.3 })
  const [benefitsTitleRef, isBenefitsTitleInView] = useInView({ threshold: 0.3 })
  const [teamTitleRef, isTeamTitleInView] = useInView({ threshold: 0.3 })
  const [testimonialsTitleRef, isTestimonialsTitleInView] = useInView({ threshold: 0.3 })
  const [faqTitleRef, isFaqTitleInView] = useInView({ threshold: 0.3 })

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero */}
        <section className="w-full py-24 bg-transparent overflow-hidden leading-10 tracking-normal">
          <div className="container px-4 md:px-6 text-center">
            <h1
              ref={heroTitleRef}
              className={cn("heading-1 text-primary mb-6", { "animate-fade-in-up": isHeroTitleInView })}
            >
              Formación Universitaria
            </h1>
            <p
              className={cn("heading-3 text-dark max-w-4xl mx-auto", {
                "animate-fade-in-up": isHeroTitleInView,
              })}
              style={{ animationDelay: "0.1s" }}
            >
              Llevá tus metas al siguiente nivel
            </p>
            <p
              className={cn("max-w-2xl mx-auto mt-6 body-large text-muted-foreground", {
                "animate-fade-in-up": isHeroTitleInView,
              })}
              style={{ animationDelay: "0.2s" }}
            >
              Dirigido a quienes buscan una formación en coaching 100% online con certificación universitaria
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="default" variant="default" className="font-accent tracking-wide">
                <Link href="/cursos">Empezá tu diplomatura hoy</Link>
              </Button>
              <Button asChild variant="default" size="default" className="font-accent tracking-wide">
                <Link href="/#contacto">Consultanos por WhatsApp</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="relative py-16 overflow-hidden" style={{ backgroundColor: "#662938" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          <div className="container relative">
            <p className="font-display text-center text-sm font-semibold tracking-wider uppercase text-white/90 mb-4">
              Con el respaldo académico de
            </p>
            <div className="flex justify-center items-center py-2 transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/uai-logo-white.png"
                alt="Universidad Abierta Interamericana (UAI)"
                width={200}
                height={60}
                priority
                className="filter drop-shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Últimas cursos */}
        <section className="w-full py-24 bg-transparent overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="heading-2">Nuestras Diplomaturas</h2>
              <p className="body-large max-w-[700px] mx-auto text-muted-foreground mt-6">
                Descubrí las últimas incorporaciones a nuestra oferta académica de diplomaturas.
              </p>
            </div>
            {latestCourses.length === 0 ? (
              <p className="text-center text-lg text-muted-foreground">
                No hay diplomaturas disponibles en este momento. ¡Agregalas desde el panel de administración!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
            <div className="text-center mt-20">
              <Button asChild size="default" variant="default" className="font-accent">
                <Link href="/cursos">Ver todas las diplomaturas</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section id="benefits" className="w-full py-24 bg-transparent overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2
                ref={benefitsTitleRef}
                className={cn("heading-2", {
                  "animate-fade-in-up": isBenefitsTitleInView,
                })}
              >
                ¿Por qué elegir Snappy Coaching?
              </h2>
              <p
                className={cn("body-large max-w-[700px] mx-auto text-muted-foreground mt-6", {
                  "animate-fade-in-up": isBenefitsTitleInView,
                })}
                style={{ animationDelay: "0.1s" }}
              >
                Te ofrecemos una formación de vanguardia, flexible y con respaldo académico.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center gap-4">
                <Award className="h-12 w-12 text-primary" />
                <h3 className="heading-4">Certificación Universitaria</h3>
                <p className="body-base text-muted-foreground">
                  Obtené un diplomado con validez y prestigio que potenciará tu perfil profesional.
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-4">
                <BookOpen className="h-12 w-12 text-primary" />
                <h3 className="heading-4">Modalidad 100% Online</h3>
                <p className="body-base text-muted-foreground">
                  Estudiá a tu ritmo, desde cualquier lugar del mundo y sin horarios fijos.
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-4">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="heading-4">Docentes Expertos</h3>
                <p className="body-base text-muted-foreground">
                  Aprendé de coaches profesionales con amplia trayectoria y experiencia en el campo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sobre - equipo docente */}
        <section id="sobre" className="py-24 bg-transparent overflow-hidden">
          <div className="container">
            <div className="text-center mb-16">
              <h2
                ref={teamTitleRef}
                className={cn("heading-2", {
                  "animate-fade-in-up": isTeamTitleInView,
                })}
              >
                Conocé a nuestro equipo docente
              </h2>
              <p
                className={cn("body-large max-w-[700px] mx-auto text-muted-foreground mt-6", {
                  "animate-fade-in-up": isTeamTitleInView,
                })}
                style={{ animationDelay: "0.1s" }}
              >
                Profesionales con pasión por enseñar y una vasta experiencia en el mundo del coaching.
              </p>
            </div>

            <div className="mb-12">
              <div className="mx-auto w-full max-w-3xl">
                <Accordion type="multiple" className="w-full space-y-6">
                  {teamMembers.map((member, index) => (
                    <AccordionItem
                      key={member.name}
                      value={`${member.name}-${index}`}
                      className="glass-card border rounded-lg"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center gap-4 text-left">
                          <CachedAvatar
                            src={member.image || "/placeholder.svg"}
                            alt={member.name}
                            size={80}
                            fallbackInitials={member.name.substring(0, 2)}
                          />
                          <div>
                            <div className="heading-5">{member.name}</div>
                            <div className="body-small text-primary">{member.role}</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        {member.bio ? (
                          <div className="space-y-3">
                            <p className="body-base text-foreground/80">{member.bio}</p>
                            {member.highlights && member.highlights.length > 0 && (
                              <ul className="list-disc list-inside body-base text-muted-foreground space-y-1">
                                {member.highlights.map((h, i) => (
                                  <li key={i}>{h}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          <p className="body-base text-muted-foreground">Más información próximamente.</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section className="w-full py-24 bg-transparent overflow-hidden">
          <div className="container">
            <h2
              ref={testimonialsTitleRef}
              className={cn("heading-2 text-center mb-16", {
                "animate-fade-in-up": isTestimonialsTitleInView,
              })}
            >
              Lo que dicen nuestros alumnos
            </h2>
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="glass-card">
                        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                          <MessageCircle className="w-10 h-10 text-secondary mb-4" />
                          <p className="font-serif text-xl italic mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                          <span className="body-base font-accent text-primary">{testimonial.name}</span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="w-full py-24 bg-transparent overflow-hidden">
          <div className="container max-w-3xl mx-auto">
            <h2
              ref={faqTitleRef}
              className={cn("heading-2 text-center mb-16", {
                "animate-fade-in-up": isFaqTitleInView,
              })}
            >
              Preguntas Frecuentes
            </h2>

            <Accordion type="single" collapsible className="w-full space-y-6">
              {/* ¿Qué es la Diplomatura...? */}
              <AccordionItem
                id="que-es-diplomatura-en-coaching-ontologico"
                value="que-es-diplomatura-en-coaching-ontologico"
                className="glass-card border rounded-lg"
              >
                <AccordionTrigger className="heading-6 px-4">
                  ¿Qué es la Diplomatura Universitaria en Coaching Ontológico?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-5">
                  <h3 className="sr-only">¿Qué es la Diplomatura Universitaria en Coaching Ontológico?</h3>
                  <div className="space-y-3">
                    <p className="body-base text-foreground/80">
                      <strong>Nuestra misión</strong> es formar <strong>Coaches Ontológicos Profesionales</strong> con
                      metodologías innovadoras, con foco en el valor humano y en crear{" "}
                      <strong>espacios de reflexión</strong> orientados a mejores resultados.
                    </p>
                    <p className="body-base text-foreground/80">
                      Estudiando con Snappy Coaching podrás desarrollarte como <strong>COP</strong> e incorporar{" "}
                      <strong>habilidades de Liderazgo Personal y Profesional</strong>, con el{" "}
                      <strong>respaldo académico de la UAI</strong>.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Modelo de aprendizaje online */}
              <AccordionItem
                id="modelo-aprendizaje-online"
                value="modelo-aprendizaje-online"
                className="glass-card border rounded-lg"
              >
                <AccordionTrigger className="heading-6 px-4">
                  Modelo de aprendizaje online de la Diplomatura
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-5">
                  <h3 className="sr-only">Modelo de aprendizaje online de la Diplomatura</h3>
                  <ul className="list-disc pl-5 space-y-2 body-base text-foreground/80">
                    <li>
                      <strong>Modalidad 100% online</strong> con instancias sincrónicas y asincrónicas.
                    </li>
                    <li>
                      <strong>Enfoque práctico</strong>: entrenamiento conversacional, observación y reflexión.
                    </li>
                    <li>
                      <strong>Acompañamiento cercano</strong> de docentes y tutores durante todo el proceso.
                    </li>
                    <li>
                      <strong>Materiales actualizados</strong>, foros y actividades colaborativas.
                    </li>
                    <li>
                      <strong>Evaluaciones por competencias</strong> con devoluciones personalizadas.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Beneficios */}
              <AccordionItem
                id="beneficios-formarte-coach-ontologico"
                value="beneficios-formarte-coach-ontologico"
                className="glass-card border rounded-lg"
              >
                <AccordionTrigger className="heading-6 px-4">
                  Beneficios de formarte como Coach Ontológico
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-5">
                  <h3 className="sr-only">Beneficios de formarte como Coach Ontológico</h3>
                  <ul className="list-disc pl-5 space-y-2 body-base text-foreground/80">
                    <li>
                      <strong>Certificación universitaria</strong> con reconocimiento académico.
                    </li>
                    <li>
                      <strong>Flexibilidad</strong> para estudiar desde cualquier lugar y compatibilizar con tu trabajo.
                    </li>
                    <li>
                      <strong>Desarrollo de liderazgo</strong> personal y profesional.
                    </li>
                    <li>
                      <strong>Comunidad</strong> de colegas y <strong>práctica</strong> colaborativa.
                    </li>
                    <li>
                      <strong>Enfoque ético y profesional</strong> del ejercicio del coaching.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Propuesta académica */}
              <AccordionItem
                id="propuesta-academica-coaching-ontologico"
                value="propuesta-academica-coaching-ontologico"
                className="glass-card border rounded-lg"
              >
                <AccordionTrigger className="heading-6 px-4">
                  Nuestra propuesta académica en Coaching Ontológico
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-5">
                  <h3 className="sr-only">Nuestra propuesta académica en Coaching Ontológico</h3>
                  <p className="body-base text-foreground/80">
                    Ofrecemos una <strong>formación integral</strong> que combina fundamentos ontológicos, herramientas
                    de intervención, <strong>práctica supervisada</strong> y espacios de reflexión. El objetivo es que
                    puedas <strong>diseñar conversaciones poderosas</strong> y acompañar procesos de cambio efectivos en
                    personas y equipos.
                  </p>
                  <ul className="list-disc pl-5 mt-3 space-y-2 body-base text-foreground/80">
                    <li>
                      <strong>Certificación universitaria</strong> emitida por la UAI.
                    </li>
                    <li>
                      <strong>Programa actualizado</strong> y orientado a resultados.
                    </li>
                    <li>
                      <strong>Docentes con amplia trayectoria</strong> profesional.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Estructura y etapas */}
              <AccordionItem
                id="estructura-etapas-plan-estudios"
                value="estructura-etapas-plan-estudios"
                className="glass-card border rounded-lg"
              >
                <AccordionTrigger className="heading-6 px-4">Estructura y etapas del plan de estudios</AccordionTrigger>
                <AccordionContent className="px-4 pb-5">
                  <h3 className="sr-only">Estructura y etapas del plan de estudios</h3>
                  <ol className="list-decimal pl-5 space-y-2 body-base text-foreground/80">
                    <li>
                      <strong>Fundamentos del Coaching Ontológico</strong>: observador, lenguaje, emoción y
                      corporalidad.
                    </li>
                    <li>
                      <strong>Herramientas y Conversaciones</strong>: pedidos, ofertas, promesas, juicios, quiebres y
                      diseño de acciones.
                    </li>
                    <li>
                      <strong>Práctica Supervisada</strong>: sesiones reales con <strong>feedback docente</strong>.
                    </li>
                    <li>
                      <strong>Liderazgo y Ética Profesional</strong>: trabajo con equipos y comunicación efectiva.
                    </li>
                    <li>
                      <strong>Integración y Trabajo Final</strong>: proyecto integrador y evaluación por competencias.
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
    </div>
  )
}

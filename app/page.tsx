import { getVisibleCourses, getVisibleTeachers, type Course } from "@/app/admin/actions"
import HomeClient from "@/components/home-client"
import FaqJsonLd from "@/components/seo/faq-jsonld"
import PerformanceMonitor from "@/components/performance-monitor"
import { preloadImages } from "@/hooks/use-image-cache"

const testimonials = [
  {
    name: "Laura G.",
    text: "La diplomatura superó mis expectativas. El nivel académico y el acompañamiento docente son excelentes. ¡100% recomendable!",
  },
  {
    name: "Marcos T.",
    text: "Gracias a Snappy pude obtener mi certificación universitaria sin dejar mi trabajo. La modalidad online es perfecta.",
  },
  {
    name: "Sofía R.",
    text: "Una experiencia transformadora. Aprendí herramientas que aplico todos los días en mis sesiones de coaching.",
  },
]

// FAQ JSON-LD con títulos optimizados para SEO
const faqItems = [
  {
    question: "¿Qué es la Diplomatura Universitaria en Coaching Ontológico?",
    answer:
      "Nuestra misión es formar Coaches Ontológicos Profesionales con metodologías innovadoras, centradas en el valor humano y la creación de espacios de reflexión para mejores resultados. Estudiando con Snappy Coaching podrás desarrollarte como COP incorporando habilidades de liderazgo personal y profesional, con el respaldo académico de la UAI.",
  },
  {
    question: "Modelo de aprendizaje online de la Diplomatura",
    answer:
      "Modalidad 100% online con instancias sincrónicas y asincrónicas; enfoque práctico en entrenamiento conversacional, observación y reflexión; acompañamiento cercano de docentes y tutores; materiales actualizados y actividades colaborativas; evaluaciones por competencias con devoluciones personalizadas.",
  },
  {
    question: "Beneficios de formarte como Coach Ontológico",
    answer:
      "Certificación universitaria con reconocimiento académico; flexibilidad para estudiar desde donde estés; desarrollo de liderazgo personal y profesional; comunidad de colegas y práctica; enfoque ético y profesional del coaching.",
  },
  {
    question: "Nuestra propuesta académica en Coaching Ontológico",
    answer:
      "Formación integral que combina fundamentos ontológicos, herramientas de intervención, práctica supervisada y espacios de reflexión para diseñar conversaciones poderosas y acompañar procesos de cambio efectivos en personas y equipos, con docentes expertos.",
  },
  {
    question: "Estructura y etapas del plan de estudios",
    answer:
      "1) Fundamentos del Coaching Ontológico: observador, lenguaje, emoción y corporalidad. 2) Herramientas y conversaciones: pedidos, ofertas, promesas, juicios, quiebres y diseño de acciones. 3) Práctica supervisada con feedback docente. 4) Liderazgo y ética profesional: trabajo con equipos y comunicación efectiva. 5) Integración y trabajo final con evaluación por competencias.",
  },
]

export default async function HomePage() {
  let latestCourses: Course[] = []
  let teamMembers: any[] = []

  try {
    latestCourses = await getVisibleCourses()
    console.log("[v0] Total cursos visibles encontrados:", latestCourses.length)
    console.log(
      "[v0] Cursos visibles:",
      latestCourses.map((c) => ({ id: c.id, title: c.title, visible: c.visible })),
    )

    const teachers = await getVisibleTeachers()
    console.log("[v0] Total docentes visibles encontrados:", teachers.length)

    // Transform teachers to match the expected format for HomeClient
    teamMembers = teachers.map((teacher) => ({
      name: teacher.name,
      role: teacher.role,
      image: teacher.image || "/placeholder.svg",
      bio: teacher.bio,
      highlights: teacher.highlights || [],
    }))

    if (typeof window !== "undefined") {
      const criticalImages = [
        "/logo-snappy.png",
        "/uai-logo-white.png",
        ...latestCourses
          .slice(0, 3)
          .map((course) => course.image)
          .filter(Boolean),
        ...teamMembers
          .slice(0, 3)
          .map((member) => member.image)
          .filter(Boolean),
      ]
      preloadImages(criticalImages)
    }
  } catch (error) {
    console.error("Database connection error:", error)
    // Continue with empty arrays if database is not available
  }

  return (
    <>
      <FaqJsonLd items={faqItems} />
      <HomeClient latestCourses={latestCourses.slice(0, 3)} teamMembers={teamMembers} testimonials={testimonials} />
      <PerformanceMonitor />
    </>
  )
}

export const metadata = {
  title: "Snappy Coaching - Formación Universitaria en Coaching Ontológico",
  description:
    "Diplomaturas y cursos 100% online para coaches ontológicos. Obtené una certificación universitaria con el respaldo de la UAI.",
}

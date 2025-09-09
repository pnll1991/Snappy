import { getVisibleCourses, type Course } from "@/app/admin/actions"
import HomeClient from "@/components/home-client"
import FaqJsonLd from "@/components/seo/faq-jsonld"

const teamMembers = [
  {
    name: "Lic. Marta Repupilli",
    role: "Senior Coach Ontológico Profesional",
    image: "/marta-repupilli.png",
    bio: "Coach con amplia trayectoria en procesos de transformación personal y organizacional. Ha liderado equipos y programas de formación durante más de 15 años.",
    highlights: [
      "Más de 1.500 horas de coaching ejecutivo y de equipos",
      "Docente universitaria en programas de liderazgo",
      "Conferencista en eventos internacionales de coaching",
    ],
  },
  {
    name: "Gustavo Cone Vera",
    role: "Coach Ontológico Profesional",
    image: "/gustavo-cone-vera.jpeg",
    bio: "Especialista en liderazgo adaptativo y desarrollo de habilidades blandas. Acompaña a profesionales y empresas en procesos de cambio cultural.",
    highlights: [
      "Diseño e implementación de programas de liderazgo",
      "Facilitador en metodologías ágiles aplicadas a personas",
      "Mentor de coaches en etapa inicial",
    ],
  },
  {
    name: "Graciela Helguero",
    role: "Coach Ontológico Profesional",
    image: "/graciela-helguero.png",
    bio: "Enfocada en el bienestar integral y el desarrollo del potencial humano, integra herramientas de coaching con prácticas de comunicación efectiva.",
    highlights: [
      "Programas de intervención en equipos de alto rendimiento",
      "Acompañamiento a líderes en contextos de cambio",
      "Experiencia en educación y formación de formadores",
    ],
  },
  {
    name: "Mónica Castro",
    role: "Coach Ontológico Profesional",
    image: "/monica-castro.png",
    bio: "Experta en gestión de equipos y mejora de desempeño. Se especializa en acompañar a organizaciones a construir culturas de aprendizaje continuo.",
    highlights: [
      "Consultoría en transformación cultural",
      "Docencia en habilidades de comunicación y feedback",
      "Entrenadora de competencias conversacionales",
    ],
  },
  {
    name: "José María Arancibia",
    role: "Coach Ontológico Profesional",
    image: "/jose-maria-arancibia.jpeg",
    bio: "Acompaña a profesionales y emprendedores a alcanzar resultados sostenibles mediante el desarrollo de competencias de liderazgo y autogestión.",
    highlights: [
      "Más de 10 años de experiencia como coach",
      "Facilitador en programas de liderazgo personal",
      "Mentor en planes de carrera y propósito",
    ],
  },
  {
    name: "María Natalia Pedernera",
    role: "Coach Ontológico Profesional",
    image: "/maria_natalia_pedernera.jpeg",
    bio: "Se especializa en crecimiento profesional con foco en comunicación, trabajo colaborativo y gestión emocional.",
    highlights: [
      "Programas de capacitación para empresas",
      "Diseño de itinerarios formativos online",
      "Acompañamiento a equipos interdisciplinarios",
    ],
  },
]

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

  try {
    latestCourses = await getVisibleCourses()
  } catch (error) {
    console.error("Database connection error:", error)
    // Continue with empty array if database is not available
  }

  return (
    <>
      <FaqJsonLd items={faqItems} />
      <HomeClient latestCourses={latestCourses.slice(0, 3)} teamMembers={teamMembers} testimonials={testimonials} />
    </>
  )
}

export const metadata = {
  title: "Snappy Coaching - Formación Universitaria en Coaching Ontológico",
  description:
    "Diplomaturas y cursos 100% online para coaches ontológicos. Obtené una certificación universitaria con el respaldo de la UAI.",
}

"use client"

import { useEffect, useState } from "react"
import { getCourses, type Course } from "@/app/admin/actions"
import CourseCard from "@/components/course-card"

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      const data = await getCourses()
      setCourses(data)
      setLoading(false)
    }
    fetchCourses()
  }, [])

  return (
    <div className="bg-transparent section-spacing">
      <div className="container">
        <div className="text-center content-spacing">
          <h1 className="heading-2">Nuestras Diplomaturas</h1>
          <p className="body-large max-w-[700px] mx-auto text-muted-foreground mt-4">
            Elegí la diplomatura que mejor se adapte a tus objetivos profesionales y empezá a transformar tu futuro hoy.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Cargando diplomaturas...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 element-spacing">
            {courses.length > 0 ? (
              courses.map((course) => <CourseCard key={course.id} course={course} />)
            ) : (
              <p className="col-span-full text-center text-muted-foreground">
                No hay diplomaturas disponibles en este momento. ¡Agregalas desde el panel de administración!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

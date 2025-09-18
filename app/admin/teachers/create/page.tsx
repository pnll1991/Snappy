import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, UserPlus } from "lucide-react"
import TeacherForm from "@/components/admin/teacher-form"

export default function NewTeacherPage() {
  console.log("[v0] NewTeacherPage loaded")

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/teachers">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <UserPlus className="h-8 w-8 text-primary" />
          <div>
            <h1 className="heading-2">Agregar Nuevo Docente</h1>
            <p className="text-muted-foreground">Completá la información del nuevo miembro del equipo</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Docente</CardTitle>
          <CardDescription>
            Ingresá los datos del docente que aparecerá en la página de inicio del sitio web.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TeacherForm />
        </CardContent>
      </Card>
    </div>
  )
}

export const metadata = {
  title: "Agregar Docente - Admin",
  description: "Agregar nuevo docente al equipo",
}

import { getTeacherById } from "@/app/admin/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, FolderEdit as UserEdit } from "lucide-react"
import TeacherForm from "@/components/admin/teacher-form"
import { notFound } from "next/navigation"

interface EditTeacherPageProps {
  params: {
    id: string
  }
}

export default async function EditTeacherPage({ params }: EditTeacherPageProps) {
  console.log("[v0] EditTeacherPage called with params:", params)

  try {
    const teacher = await getTeacherById(params.id)
    console.log("[v0] Teacher found:", teacher ? "Yes" : "No")

    if (!teacher) {
      console.log("[v0] Teacher not found, calling notFound()")
      notFound()
    }

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
            <UserEdit className="h-8 w-8 text-primary" />
            <div>
              <h1 className="heading-2">Editar Docente</h1>
              <p className="text-muted-foreground">Modificá la información de {teacher.name}</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Docente</CardTitle>
            <CardDescription>
              Actualizá los datos del docente que aparece en la página de inicio del sitio web.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TeacherForm teacher={teacher} />
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("[v0] Error in EditTeacherPage:", error)
    notFound()
  }
}

export const metadata = {
  title: "Editar Docente - Admin",
  description: "Editar información del docente",
}

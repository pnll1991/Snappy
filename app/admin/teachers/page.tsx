import { getTeachers } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Edit, Eye, EyeOff, Users } from "lucide-react"
import TeacherActions from "@/components/admin/teacher-actions"
import Image from "next/image"

export default async function TeachersPage() {
  const teachers = await getTeachers()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="heading-2">Gestión de Docentes</h1>
            <p className="text-muted-foreground">Administrá el equipo docente que aparece en la página de inicio</p>
          </div>
        </div>
        <Link href="/admin/teachers/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Agregar Docente
          </Button>
        </Link>
      </div>

      {teachers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="heading-4 mb-2">No hay docentes registrados</h3>
            <p className="text-muted-foreground mb-4">Comenzá agregando tu primer docente al equipo.</p>
            <Link href="/admin/teachers/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Docente
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Teacher Image */}
                  <div className="flex-shrink-0">
                    {teacher.image ? (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={teacher.image || "/placeholder.svg"}
                          alt={teacher.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                        <Users className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Teacher Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="heading-4 mb-1">{teacher.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{teacher.role}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant={teacher.visible ? "default" : "secondary"}>
                            {teacher.visible ? (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Visible
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Oculto
                              </>
                            )}
                          </Badge>
                          <Badge variant="outline">Orden: {teacher.sort_order}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/teachers/${teacher.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <TeacherActions teacher={teacher} />
                      </div>
                    </div>

                    {/* Bio */}
                    {teacher.bio && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{teacher.bio}</p>}

                    {/* Highlights */}
                    {teacher.highlights && teacher.highlights.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Destacados:</p>
                        <div className="flex flex-wrap gap-1">
                          {teacher.highlights.slice(0, 3).map((highlight, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {highlight.length > 50 ? `${highlight.substring(0, 50)}...` : highlight}
                            </Badge>
                          ))}
                          {teacher.highlights.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{teacher.highlights.length - 3} más
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Back to Dashboard */}
      <div className="mt-8 pt-6 border-t">
        <Link href="/admin/dashboard">
          <Button variant="outline">← Volver al Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

export const metadata = {
  title: "Gestión de Docentes - Admin",
  description: "Administrar el equipo docente",
}

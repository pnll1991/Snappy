"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useState, useRef, useEffect } from "react"
import { logout, addCourse, getCourses, deleteCourse, toggleCourseVisibility, type Course } from "../actions"
import { Trash2, ImageIcon, Pencil, Eye, EyeOff, Users } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

export default function AdminDashboardPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isPending, setIsPending] = useState(false)
  const [formMessage, setFormMessage] = useState<{ success: boolean; message: string } | null>(null)
  const [content, setContent] = useState<string>("")
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    async function fetchCourses() {
      const fetched = await getCourses()
      setCourses(fetched)
    }
    fetchCourses()
  }, [])

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsPending(true)
    setFormMessage(null)

    const formData = new FormData(event.currentTarget)
    const imageFile = formData.get("image") as File

    if (imageFile && imageFile.size > 0) {
      const imageBase64 = await toBase64(imageFile)
      formData.set("image", imageBase64)
    } else {
      formData.set("image", "")
    }

    formData.set("content_md", content)

    const result = await addCourse(formData)
    setFormMessage(result)

    if (result.success) {
      formRef.current?.reset()
      setContent("")
      const updated = await getCourses()
      setCourses(updated)
    }
    setIsPending(false)
  }

  const handleDeleteCourse = async (id: string) => {
    const res = await deleteCourse(id)
    if (res.success) {
      const updated = await getCourses()
      setCourses(updated)
    }
  }

  const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
    const result = await toggleCourseVisibility(id, !currentVisibility)
    if (result.success) {
      const updated = await getCourses()
      setCourses(updated)
    }
  }

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="heading-2 text-dark">Panel de Administración</h1>
          <div className="flex gap-2">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/admin/instructors">
                <Users className="h-4 w-4 mr-2" />
                Gestionar Instructores
              </Link>
            </Button>
            <form action={logout}>
              <Button variant="glass-outline" size="lg">
                Cerrar Sesión
              </Button>
            </form>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="heading-5">Añadir Curso</CardTitle>
            <CardDescription>
              Completá los datos para agregar un nuevo programa. El contenido soporta Markdown.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" name="title" placeholder="Ej: Diplomatura en Coaching Organizacional" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción corta</Label>
                <Textarea id="description" name="description" placeholder="Resumen del curso..." required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración</Label>
                  <Input id="duration" name="duration" placeholder="Ej: 8 meses" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modality">Modalidad</Label>
                  <Input id="modality" name="modality" placeholder="Ej: 100% Online" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certification">Certificación</Label>
                  <Input id="certification" name="certification" placeholder="Ej: Universitaria" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Contenido (Markdown)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="# Título\n\nContenido en **Markdown** con listas, tablas, etc."
                    className="min-h-[220px]"
                  />
                  <div className="border rounded-md p-3 bg-white overflow-auto min-h-[220px]">
                    <div className="text-xs text-muted-foreground mb-2">Vista previa</div>
                    <article className="prose prose-neutral max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content || "Nada para previsualizar..."}
                      </ReactMarkdown>
                    </article>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Imagen del Curso</Label>
                <Input id="image" name="image" type="file" accept="image/*" />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="visible" name="visible" defaultChecked />
                <Label htmlFor="visible">Mostrar en la landing principal</Label>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                {isPending ? "Agregando..." : "Agregar Curso"}
              </Button>
              {formMessage && (
                <Alert
                  variant={formMessage.success ? "default" : "destructive"}
                  className={formMessage.success ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"}
                >
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>{formMessage.success ? "Éxito" : "Error"}</AlertTitle>
                  <AlertDescription>{formMessage.message}</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="heading-5">Cursos Existentes</CardTitle>
            <CardDescription>
              Usa el interruptor para controlar qué cursos aparecen en "Nuestras Diplomaturas"
            </CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-center text-muted-foreground">No hay cursos cargados aún.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-md bg-white gap-4"
                  >
                    {course.image ? (
                      <Image
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-grow">
                      <h3 className="heading-6">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {course.duration} | {course.modality}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {course.visible ? (
                          <Eye className="h-3 w-3 text-green-600" />
                        ) : (
                          <EyeOff className="h-3 w-3 text-gray-400" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {course.visible ? "Visible en landing" : "Oculto en landing"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={course.visible}
                          onCheckedChange={() => handleToggleVisibility(course.id, course.visible)}
                        />
                        <Label className="text-xs">Visible</Label>
                      </div>
                      <Button variant="secondary" size="icon" asChild aria-label="Editar curso">
                        <Link href={`/admin/courses/${course.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteCourse(course.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar curso</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

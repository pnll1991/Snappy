"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { getCourseById, updateCourse, type Course, type Professional } from "@/app/admin/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useParams, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react"

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

export default function EditCoursePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState("")
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    async function load() {
      const data = await getCourseById(params.id)
      setCourse(data)
      setContent(data?.content_md ?? "")
      setProfessionals(
        (data?.professionals || []).map((p, idx) => ({
          id: p.id,
          name: p.name,
          role: p.role,
          image: p.image,
          sort_order: idx,
        })),
      )
      setLoading(false)
    }
    load()
  }, [params.id])

  const addProfessional = () => {
    setProfessionals((prev) => [...prev, { name: "", role: "", image: null }])
  }

  const removeProfessional = (index: number) => {
    setProfessionals((prev) => prev.filter((_, i) => i !== index))
  }

  const moveProfessional = (index: number, dir: "up" | "down") => {
    setProfessionals((prev) => {
      const next = [...prev]
      const newIndex = dir === "up" ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= next.length) return prev
      const [item] = next.splice(index, 1)
      next.splice(newIndex, 0, item)
      return next
    })
  }

  const handleImageChange = async (index: number, file: File | null) => {
    if (!file) return
    const encoded = await toBase64(file)
    setProfessionals((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], image: encoded }
      return next
    })
  }

  if (loading) {
    return <div className="container py-12">Cargando curso...</div>
  }
  if (!course) {
    return <div className="container py-12">Curso no encontrado.</div>
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    const formData = new FormData(e.currentTarget)
    const imageFile = formData.get("image") as File
    if (imageFile && imageFile.size > 0) {
      const base64 = await toBase64(imageFile)
      formData.set("image", base64)
    } else {
      formData.set("image", course.image || "")
    }
    formData.set("content_md", content)
    const payload = professionals.map((p, idx) => ({ ...p, sort_order: idx }))
    formData.set("professionals", JSON.stringify(payload))

    const res = await updateCourse(course.id, formData)
    setSaving(false)
    if (res.success) {
      router.push("/admin/dashboard")
    }
  }

  return (
    <div className="container py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-body text-xl font-bold">Editar Curso</CardTitle>
          <CardDescription>
            Actualizá la información del curso. El contenido soporta Markdown y profesionales asignados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" name="title" defaultValue={course.title} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (opcional)</Label>
                <Input id="slug" name="slug" placeholder="mi-curso" defaultValue={course.slug ?? ""} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción corta</Label>
              <Textarea id="description" name="description" defaultValue={course.description} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duración</Label>
                <Input id="duration" name="duration" defaultValue={course.duration} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modality">Modalidad</Label>
                <Input id="modality" name="modality" defaultValue={course.modality} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certification">Certificación</Label>
                <Input id="certification" name="certification" defaultValue={course.certification} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contenido (Markdown)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="# Título\n\nContenido en **Markdown**"
                  className="min-h-[280px]"
                />
                <div className="border rounded-md p-3 bg-white overflow-auto min-h-[280px]">
                  <div className="text-xs text-muted-foreground mb-2">Vista previa</div>
                  <article className="prose prose-neutral max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "Nada para previsualizar..."}</ReactMarkdown>
                  </article>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagen del Curso</Label>
              <Input id="image" name="image" type="file" accept="image/*" />
              {course.image && (
                <div className="mt-2">
                  <Image
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    width={160}
                    height={120}
                    className="rounded-md object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Profesionales del curso</Label>
                <Button type="button" variant="secondary" size="sm" onClick={addProfessional}>
                  <Plus className="h-4 w-4 mr-1" /> Agregar profesional
                </Button>
              </div>

              <div className="space-y-3">
                {professionals.map((prof, index) => (
                  <div key={index} className="p-3 border rounded-md bg-white">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        {prof.image ? (
                          <AvatarImage src={prof.image || "/placeholder.svg"} alt={prof.name || "Profesional"} />
                        ) : (
                          <AvatarFallback>{(prof.name || "PR").substring(0, 2)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                        <div className="space-y-1">
                          <Label>Nombre</Label>
                          <Input
                            value={prof.name}
                            onChange={(e) =>
                              setProfessionals((prev) => {
                                const next = [...prev]
                                next[index] = { ...next[index], name: e.target.value }
                                return next
                              })
                            }
                            placeholder="Nombre y Apellido"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Rol</Label>
                          <Textarea
                            value={prof.role}
                            onChange={(e) =>
                              setProfessionals((prev) => {
                                const next = [...prev]
                                next[index] = { ...next[index], role: e.target.value }
                                return next
                              })
                            }
                            rows={4}
                            className="min-h-[120px]"
                            placeholder={
                              "Médica, experta en Medicina China.\nMáster coach ontológico acreditado por AACOP Internacional.\nCoach Especialista en Gestión Emocional y Corporal.\nProgramación Neuro Lingüística. Neuro-psicoeducadora.\nBailarina.\nAutora del libro «Cuerpo, coaching y bienestar»."
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            Podés escribir varias líneas y detalles del rol del/la profesional.
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label>Foto</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(index, e.target.files?.[0] || null)}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => moveProfessional(index, "up")}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => moveProfessional(index, "down")}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeProfessional(index)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Quitar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {professionals.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aún no agregaste profesionales a este curso.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

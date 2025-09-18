"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, X, Upload, ImageIcon } from "lucide-react"
import { addTeacher, updateTeacher, type Teacher } from "@/app/admin/actions"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

interface TeacherFormProps {
  teacher?: Teacher
}

export default function TeacherForm({ teacher }: TeacherFormProps) {
  console.log("[v0] TeacherForm loaded with teacher:", teacher ? "existing" : "new")

  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState(teacher?.name || "")
  const [role, setRole] = useState(teacher?.role || "")
  const [bio, setBio] = useState(teacher?.bio || "")
  const [image, setImage] = useState(teacher?.image || "")
  const [highlights, setHighlights] = useState<string[]>(teacher?.highlights || [])
  const [sortOrder, setSortOrder] = useState(teacher?.sort_order || 0)
  const [visible, setVisible] = useState(teacher?.visible ?? true)
  const [newHighlight, setNewHighlight] = useState("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("La imagen debe ser menor a 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImage(result)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const addHighlight = () => {
    if (newHighlight.trim() && !highlights.includes(newHighlight.trim())) {
      setHighlights([...highlights, newHighlight.trim()])
      setNewHighlight("")
    }
  }

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted, isLoading:", isLoading)
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("name", name.trim())
      formData.append("role", role.trim())
      formData.append("bio", bio.trim())
      formData.append("image", image)
      formData.append("highlights", JSON.stringify(highlights))
      formData.append("sort_order", sortOrder.toString())
      formData.append("visible", visible.toString())

      console.log("[v0] Calling", teacher ? "updateTeacher" : "addTeacher")
      const result = teacher ? await updateTeacher(teacher.id, formData) : await addTeacher(formData)
      console.log("[v0] Result:", result)

      if (result.success) {
        toast({
          title: "Éxito",
          description: result.message,
        })
        router.push("/admin/teachers")
        router.refresh()
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error("[v0] Form submission error:", error)
      setError("Ocurrió un error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Lic. María García"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Rol/Título *</Label>
          <Input
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Ej: Coach Ontológico Profesional"
            required
          />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Biografía</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Descripción profesional del docente..."
          rows={4}
        />
      </div>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Imagen del Docente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {image ? (
            <div className="flex items-start gap-4">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted">
                <Image src={image || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Imagen actual</p>
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Cambiar imagen
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setImage("")} className="ml-2">
                  <X className="h-4 w-4 mr-2" />
                  Quitar
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">Subí una imagen del docente (opcional)</p>
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Seleccionar imagen
              </Button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </CardContent>
      </Card>

      {/* Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Destacados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              placeholder="Agregar un destacado..."
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
            />
            <Button type="button" onClick={addHighlight} disabled={!newHighlight.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {highlights.map((highlight, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {highlight}
                  <button type="button" onClick={() => removeHighlight(index)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Orden de aparición</Label>
          <Input
            id="sortOrder"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number.parseInt(e.target.value) || 0)}
            min="0"
          />
          <p className="text-xs text-muted-foreground">Número menor aparece primero</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="visible">Visibilidad</Label>
          <div className="flex items-center space-x-2">
            <Switch id="visible" checked={visible} onCheckedChange={setVisible} />
            <Label htmlFor="visible" className="text-sm">
              {visible ? "Visible en la página" : "Oculto"}
            </Label>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-6">
        <Button type="submit" disabled={isLoading || !name.trim() || !role.trim()}>
          {isLoading ? "Guardando..." : teacher ? "Actualizar Docente" : "Crear Docente"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

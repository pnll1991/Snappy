"use server"

import { createSession, deleteSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getDb } from "@/lib/db"

// Types
export type Professional = {
  id?: string
  name: string
  role: string
  image: string | null
  sort_order?: number
}

export type Course = {
  id: string
  title: string
  description: string
  duration: string
  modality: string
  certification: string
  image: string | null
  content_md: string | null
  slug: string | null
  created_at: string | null
  visible: boolean
  professionals?: Professional[]
}

// Utilities
function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 200)
}

async function ensureSchema() {
  const sql = getDb()
  if (!sql) {
    throw new Error("Database connection not available")
  }

  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`
  await sql`
  CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(100) NOT NULL,
    modality VARCHAR(100) NOT NULL,
    certification VARCHAR(255) NOT NULL,
    image TEXT,
    content_md TEXT,
    slug TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    visible BOOLEAN DEFAULT true
  );
`

  // Nueva tabla simple para profesionales
  await sql`
  CREATE TABLE IF NOT EXISTS course_professionals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role TEXT NOT NULL,
    image TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
`
}

function isUndefinedTableError(e: unknown) {
  return typeof e === "object" && e !== null && (e as any).code === "42P01"
}
function isUndefinedColumnError(e: unknown) {
  return typeof e === "object" && e !== null && (e as any).code === "42703"
}

// Auth
export async function login(prevState: { error?: string } | undefined, formData: FormData) {
  const username = formData.get("username")
  const password = formData.get("password")

  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
    await createSession(username as string)
    redirect("/admin/dashboard")
  }
  return { error: "Credenciales inválidas. Verificá usuario y contraseña." }
}

export async function logout() {
  deleteSession()
  redirect("/admin/login")
}

async function syncCourseProfessionals(courseId: string, professionals: Professional[]) {
  const sql = getDb()
  if (!sql) {
    throw new Error("Database connection not available")
  }

  // Eliminar profesionales existentes del curso
  await sql`DELETE FROM course_professionals WHERE course_id = ${courseId}::uuid`

  // Insertar nuevos profesionales
  for (let i = 0; i < professionals.length; i++) {
    const prof = professionals[i]
    if (prof.name.trim() && prof.role.trim()) {
      await sql`
        INSERT INTO course_professionals (course_id, name, role, image, sort_order)
        VALUES (${courseId}::uuid, ${prof.name.trim()}, ${prof.role.trim()}, ${prof.image}, ${i})
      `
    }
  }
}

// Create
export async function addCourse(formData: FormData) {
  try {
    const sql = getDb()
    if (!sql) {
      return { success: false, message: "Database connection not available" }
    }

    await ensureSchema()

    const title = (formData.get("title") as string)?.trim()
    const description = (formData.get("description") as string)?.trim()
    const duration = (formData.get("duration") as string)?.trim()
    const modality = (formData.get("modality") as string)?.trim()
    const certification = (formData.get("certification") as string)?.trim()
    const image = (formData.get("image") as string) || null
    const content_md = ((formData.get("content_md") as string) || "").trim() || null
    const professionalsJson = formData.get("professionals") as string | null
    const professionals: Professional[] = professionalsJson ? JSON.parse(professionalsJson) : []
    const visible = formData.get("visible") === "on" || formData.get("visible") === "true"

    if (!title || !description || !duration || !modality || !certification) {
      return { success: false, message: "Todos los campos son obligatorios." }
    }

    // Generate unique slug
    let base = slugify(title)
    if (!base) base = "curso"
    let uniqueSlug = base
    let i = 1
    while (true) {
      const existing = await sql`SELECT 1 FROM courses WHERE slug = ${uniqueSlug} LIMIT 1`
      if (Array.isArray(existing) && existing.length === 0) break
      uniqueSlug = `${base}-${i++}`
    }

    const inserted = await sql<{ id: string }[]>`
    INSERT INTO courses (title, description, duration, modality, certification, image, content_md, slug, visible)
    VALUES (${title}, ${description}, ${duration}, ${modality}, ${certification}, ${image}, ${content_md}, ${uniqueSlug}, ${visible})
    RETURNING id::text AS id
  `
    const courseId = (inserted as any[])[0]?.id as string

    if (courseId && professionals.length > 0) {
      await syncCourseProfessionals(courseId, professionals)
    }

    revalidatePath("/admin/dashboard")
    revalidatePath("/cursos")
    revalidatePath(`/cursos/${uniqueSlug}`)
    revalidatePath("/")
    return { success: true, message: "Curso agregado exitosamente." }
  } catch (error: any) {
    if (isUndefinedTableError(error) || isUndefinedColumnError(error)) {
      await ensureSchema()
      return addCourse(formData)
    }
    return { success: false, message: `Error al agregar el curso: ${error?.message ?? "Error desconocido"}` }
  }
}

export async function getCourses(): Promise<Course[]> {
  try {
    const sql = getDb()
    if (!sql) {
      console.warn("No database connection available, returning empty courses array")
      return []
    }

    const rows = await sql<any[]>`
    SELECT
      c.id::text,
      c.title,
      c.description,
      c.duration,
      c.modality,
      c.certification,
      c.image,
      c.content_md,
      c.slug,
      c.created_at,
      COALESCE(c.visible, true) as visible,
      COALESCE(
        json_agg(
          json_build_object(
            'id', p.id::text,
            'name', p.name,
            'role', p.role,
            'image', p.image,
            'sort_order', p.sort_order
          )
          ORDER BY p.sort_order ASC
        ) FILTER (WHERE p.id IS NOT NULL),
        '[]'
      ) AS professionals
    FROM courses c
    LEFT JOIN course_professionals p ON p.course_id = c.id
    GROUP BY c.id
    ORDER BY c.created_at DESC NULLS LAST, c.id DESC
  `
    return rows as Course[]
  } catch (error: any) {
    if (isUndefinedTableError(error) || isUndefinedColumnError(error)) {
      await ensureSchema()
      return getCourses()
    }
    console.error("Error fetching courses:", error)
    return []
  }
}

export async function getVisibleCourses(): Promise<Course[]> {
  try {
    const sql = getDb()
    if (!sql) {
      console.warn("No database connection available, returning empty courses array")
      return []
    }

    const rows = await sql<any[]>`
    SELECT
      c.id::text,
      c.title,
      c.description,
      c.duration,
      c.modality,
      c.certification,
      c.image,
      c.content_md,
      c.slug,
      c.created_at,
      COALESCE(c.visible, true) as visible,
      COALESCE(
        json_agg(
          json_build_object(
            'id', p.id::text,
            'name', p.name,
            'role', p.role,
            'image', p.image,
            'sort_order', p.sort_order
          )
          ORDER BY p.sort_order ASC
        ) FILTER (WHERE p.id IS NOT NULL),
        '[]'
      ) AS professionals
    FROM courses c
    LEFT JOIN course_professionals p ON p.course_id = c.id
    WHERE COALESCE(c.visible, true) = true
    GROUP BY c.id
    ORDER BY c.created_at DESC NULLS LAST, c.id DESC
  `
    return rows as Course[]
  } catch (error: any) {
    if (isUndefinedTableError(error) || isUndefinedColumnError(error)) {
      await ensureSchema()
      return getVisibleCourses()
    }
    console.error("Error fetching visible courses:", error)
    return []
  }
}

export async function getCourseById(id: string): Promise<Course | null> {
  try {
    const sql = getDb()
    if (!sql) {
      return null
    }

    const rows = await sql<any[]>`
    SELECT
      c.id::text,
      c.title,
      c.description,
      c.duration,
      c.modality,
      c.certification,
      c.image,
      c.content_md,
      c.slug,
      c.created_at,
      COALESCE(c.visible, true) as visible,
      COALESCE(
        json_agg(
          json_build_object(
            'id', p.id::text,
            'name', p.name,
            'role', p.role,
            'image', p.image,
            'sort_order', p.sort_order
          )
          ORDER BY p.sort_order ASC
        ) FILTER (WHERE p.id IS NOT NULL),
        '[]'
      ) AS professionals
    FROM courses c
    LEFT JOIN course_professionals p ON p.course_id = c.id
    WHERE c.id = ${id}::uuid
    GROUP BY c.id
    LIMIT 1
  `
    return (rows as any[])[0] ?? null
  } catch (error: any) {
    if (isUndefinedTableError(error) || isUndefinedColumnError(error)) {
      await ensureSchema()
      return getCourseById(id)
    }
    return null
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const sql = getDb()
    if (!sql) {
      return null
    }

    const rows = await sql<any[]>`
    SELECT
      c.id::text,
      c.title,
      c.description,
      c.duration,
      c.modality,
      c.certification,
      c.image,
      c.content_md,
      c.slug,
      c.created_at,
      COALESCE(c.visible, true) as visible,
      COALESCE(
        json_agg(
          json_build_object(
            'id', p.id::text,
            'name', p.name,
            'role', p.role,
            'image', p.image,
            'sort_order', p.sort_order
          )
          ORDER BY p.sort_order ASC
        ) FILTER (WHERE p.id IS NOT NULL),
        '[]'
      ) AS professionals
    FROM courses c
    LEFT JOIN course_professionals p ON p.course_id = c.id
    WHERE c.slug = ${slug}
    GROUP BY c.id
    LIMIT 1
  `
    return (rows as any[])[0] ?? null
  } catch (error: any) {
    if (isUndefinedTableError(error) || isUndefinedColumnError(error)) {
      await ensureSchema()
      return getCourseBySlug(slug)
    }
    return null
  }
}

// Update
export async function updateCourse(id: string, formData: FormData) {
  try {
    const sql = getDb()
    if (!sql) {
      return { success: false, message: "Database connection not available" }
    }

    await ensureSchema()

    const title = (formData.get("title") as string)?.trim()
    const description = (formData.get("description") as string)?.trim()
    const duration = (formData.get("duration") as string)?.trim()
    const modality = (formData.get("modality") as string)?.trim()
    const certification = (formData.get("certification") as string)?.trim()
    const image = (formData.get("image") as string) || null
    const content_md = ((formData.get("content_md") as string) || "").trim() || null
    let slug = (formData.get("slug") as string)?.trim() || null
    const visible = formData.get("visible") === "on" || formData.get("visible") === "true"

    const professionalsJson = formData.get("professionals") as string | null
    const professionals: Professional[] = professionalsJson ? JSON.parse(professionalsJson) : []

    const current = await getCourseById(id)
    if (!current) return { success: false, message: "Curso no encontrado." }

    if (!title || !description || !duration || !modality || !certification) {
      return { success: false, message: "Todos los campos son obligatorios." }
    }

    if (!slug) {
      slug = current.slug ?? slugify(title)
    }
    if (slug !== current.slug) {
      slug = slugify(slug || "")
      const base = slug || "curso"
      let uniqueSlug = base
      let i = 1
      while (true) {
        const exists = await sql`SELECT 1 FROM courses WHERE slug = ${uniqueSlug} AND id <> ${id}::uuid LIMIT 1`
        if (Array.isArray(exists) && exists.length === 0) break
        uniqueSlug = `${base}-${i++}`
      }
      slug = uniqueSlug
    }

    await sql`
    UPDATE courses
    SET
      title = ${title},
      description = ${description},
      duration = ${duration},
      modality = ${modality},
      certification = ${certification},
      image = ${image},
      content_md = ${content_md},
      slug = ${slug},
      visible = ${visible}
    WHERE id = ${id}::uuid
  `

    await syncCourseProfessionals(id, professionals)

    revalidatePath("/admin/dashboard")
    revalidatePath(`/admin/courses/${id}`)
    revalidatePath("/cursos")
    if (slug) revalidatePath(`/cursos/${slug}`)
    revalidatePath("/")

    return { success: true, message: "Curso actualizado correctamente.", slug }
  } catch (error: any) {
    if (isUndefinedTableError(error) || isUndefinedColumnError(error)) {
      await ensureSchema()
      return updateCourse(id, formData)
    }
    return { success: false, message: `Error al actualizar el curso: ${error?.message ?? "Error desconocido"}` }
  }
}

export async function toggleCourseVisibility(courseId: string, visible: boolean) {
  try {
    const sql = getDb()
    if (!sql) {
      return { success: false, message: "Database connection not available" }
    }

    await sql`
      UPDATE courses 
      SET visible = ${visible}
      WHERE id = ${courseId}::uuid
    `

    revalidatePath("/admin/dashboard")
    revalidatePath("/")
    return { success: true, message: `Curso ${visible ? "mostrado" : "ocultado"} exitosamente.` }
  } catch (error: any) {
    if (isUndefinedTableError(error)) {
      await ensureSchema()
      return { success: false, message: "No se encontró la tabla de cursos. Intentá nuevamente." }
    }
    return { success: false, message: `Error al cambiar visibilidad: ${error?.message ?? "Error desconocido"}` }
  }
}

// Delete
export async function deleteCourse(courseId: string) {
  try {
    const sql = getDb()
    if (!sql) {
      return { success: false, message: "Database connection not available" }
    }

    await sql`DELETE FROM courses WHERE id = ${courseId}::uuid`

    revalidatePath("/admin/dashboard")
    revalidatePath("/cursos")
    revalidatePath("/")
    return { success: true, message: "Curso eliminado exitosamente." }
  } catch (error: any) {
    if (isUndefinedTableError(error)) {
      await ensureSchema()
      return { success: false, message: "No se encontró la tabla de cursos. Intentá nuevamente." }
    }
    return { success: false, message: `Error al eliminar el curso: ${error?.message ?? "Error desconocido"}` }
  }
}

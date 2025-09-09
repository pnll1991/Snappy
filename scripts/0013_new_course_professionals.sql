-- Eliminar el sistema complejo de instructores y crear una nueva tabla simple
-- Primero eliminar las tablas existentes problemáticas
DROP TABLE IF EXISTS course_instructors CASCADE;
DROP TABLE IF EXISTS instructors CASCADE;

-- Crear nueva tabla simple para profesionales por curso
CREATE TABLE IF NOT EXISTS course_professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role TEXT NOT NULL,
  image TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índice para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_course_professionals_course_id ON course_professionals(course_id);
CREATE INDEX IF NOT EXISTS idx_course_professionals_sort_order ON course_professionals(course_id, sort_order);

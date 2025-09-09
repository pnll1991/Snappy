-- Script para limpiar instructores huérfanos y duplicados
-- Eliminar instructores que no están asociados a ningún curso
DELETE FROM instructors 
WHERE id NOT IN (
  SELECT DISTINCT instructor_id 
  FROM course_instructors 
  WHERE instructor_id IS NOT NULL
);

-- Crear índice único para evitar duplicados por nombre (opcional)
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_instructors_name_unique ON instructors(LOWER(name));

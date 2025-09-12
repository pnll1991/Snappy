-- Verificar el estado actual de los cursos
SELECT id, title, visible, created_at 
FROM courses 
ORDER BY created_at DESC;

-- Si no hay cursos visibles, hacer visibles todos los cursos existentes
UPDATE courses 
SET visible = true 
WHERE visible IS NULL OR visible = false;

-- Verificar el resultado
SELECT id, title, visible 
FROM courses 
WHERE visible = true
ORDER BY created_at DESC;

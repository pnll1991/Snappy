CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE IF EXISTS courses
  ADD COLUMN IF NOT EXISTS content_md TEXT;

ALTER TABLE IF EXISTS courses
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

UPDATE courses SET slug = regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g')
  WHERE slug IS NULL;

ALTER TABLE courses
  ALTER COLUMN slug SET NOT NULL;

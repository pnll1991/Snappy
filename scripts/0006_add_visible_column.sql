-- Add visible column to courses table
ALTER TABLE courses ADD COLUMN visible BOOLEAN DEFAULT true;

-- Update existing courses to be visible by default
UPDATE courses SET visible = true WHERE visible IS NULL;

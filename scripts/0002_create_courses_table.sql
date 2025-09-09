CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  duration VARCHAR(100) NOT NULL,
  modality VARCHAR(100) NOT NULL,
  certification VARCHAR(255) NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create teachers table for global teacher management
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  image TEXT,
  bio TEXT,
  highlights TEXT[], -- Array of highlight strings
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for optimized queries
CREATE INDEX IF NOT EXISTS idx_teachers_visible ON teachers(visible);
CREATE INDEX IF NOT EXISTS idx_teachers_sort_order ON teachers(visible, sort_order);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert existing teachers from the hardcoded data
INSERT INTO teachers (name, role, image, bio, highlights, sort_order, visible) VALUES
(
  'Lic. Marta Repupilli',
  'Senior Coach Ontológico Profesional',
  '/marta-repupilli.png',
  'Coach con amplia trayectoria en procesos de transformación personal y organizacional. Ha liderado equipos y programas de formación durante más de 15 años.',
  ARRAY[
    'Más de 1.500 horas de coaching ejecutivo y de equipos',
    'Docente universitaria en programas de liderazgo',
    'Conferencista en eventos internacionales de coaching'
  ],
  1,
  true
),
(
  'Gustavo Cone Vera',
  'Coach Ontológico Profesional',
  '/gustavo-cone-vera.jpeg',
  'Especialista en liderazgo adaptativo y desarrollo de habilidades blandas. Acompaña a profesionales y empresas en procesos de cambio cultural.',
  ARRAY[
    'Diseño e implementación de programas de liderazgo',
    'Facilitador en metodologías ágiles aplicadas a personas',
    'Mentor de coaches en etapa inicial'
  ],
  2,
  true
),
(
  'Graciela Helguero',
  'Coach Ontológico Profesional',
  '/graciela-helguero.png',
  'Enfocada en el bienestar integral y el desarrollo del potencial humano, integra herramientas de coaching con prácticas de comunicación efectiva.',
  ARRAY[
    'Programas de intervención en equipos de alto rendimiento',
    'Acompañamiento a líderes en contextos de cambio',
    'Experiencia en educación y formación de formadores'
  ],
  3,
  true
),
(
  'Mónica Castro',
  'Coach Ontológico Profesional',
  '/monica-castro.png',
  'Experta en gestión de equipos y mejora de desempeño. Se especializa en acompañar a organizaciones a construir culturas de aprendizaje continuo.',
  ARRAY[
    'Consultoría en transformación cultural',
    'Docencia en habilidades de comunicación y feedback',
    'Entrenadora de competencias conversacionales'
  ],
  4,
  true
),
(
  'José María Arancibia',
  'Coach Ontológico Profesional',
  '/jose-maria-arancibia.jpeg',
  'Acompaña a profesionales y emprendedores a alcanzar resultados sostenibles mediante el desarrollo de competencias de liderazgo y autogestión.',
  ARRAY[
    'Más de 10 años de experiencia como coach',
    'Facilitador en programas de liderazgo personal',
    'Mentor en planes de carrera y propósito'
  ],
  5,
  true
),
(
  'María Natalia Pedernera',
  'Coach Ontológico Profesional',
  '/maria_natalia_pedernera.jpeg',
  'Se especializa en crecimiento profesional con foco en comunicación, trabajo colaborativo y gestión emocional.',
  ARRAY[
    'Programas de capacitación para empresas',
    'Diseño de itinerarios formativos online',
    'Acompañamiento a equipos interdisciplinarios'
  ],
  6,
  true
);

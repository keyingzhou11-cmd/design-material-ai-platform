-- Design Inspiration Platform — Supabase Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Profiles ───────────────────────────────────────────────
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Categories ─────────────────────────────────────────────
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#E85D04',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO categories (name, slug, color) VALUES
  ('Typography', 'typography', '#E85D04'),
  ('Color', 'color', '#D45303'),
  ('Layout', 'layout', '#1A1A1A'),
  ('Photography', 'photography', '#6B6560'),
  ('Illustration', 'illustration', '#E85D04'),
  ('UI/UX', 'ui-ux', '#A39E98'),
  ('Branding', 'branding', '#D45303'),
  ('Motion', 'motion', '#1A1A1A');

-- ─── Tags ─────────────────────────────────────────────────────
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Materials ────────────────────────────────────────────────
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled',
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  source_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  width INT,
  height INT,
  file_size INT,
  is_favorite BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_materials_user_id ON materials(user_id);
CREATE INDEX idx_materials_category_id ON materials(category_id);
CREATE INDEX idx_materials_created_at ON materials(created_at DESC);

-- ─── Material Tags (junction) ───────────────────────────────
CREATE TABLE material_tags (
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (material_id, tag_id)
);

-- ─── Projects ─────────────────────────────────────────────────
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);

-- ─── Moodboards ───────────────────────────────────────────────
CREATE TABLE moodboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Untitled Board',
  width INT DEFAULT 1920,
  height INT DEFAULT 1080,
  background_color TEXT DEFAULT '#F5F0EB',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Canvas States (Fabric.js JSON) ───────────────────────────
CREATE TABLE canvas_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  moodboard_id UUID REFERENCES moodboards(id) ON DELETE CASCADE UNIQUE,
  state JSONB NOT NULL DEFAULT '{}',
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AI Analyses ──────────────────────────────────────────────
CREATE TABLE ai_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  analysis_type TEXT DEFAULT 'full' CHECK (analysis_type IN ('full', 'color', 'typography', 'layout')),
  result JSONB NOT NULL DEFAULT '{}',
  summary TEXT,
  tags_suggested TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_analyses_material_id ON ai_analyses(material_id);

-- ─── Daily Recommendations ────────────────────────────────────
CREATE TABLE daily_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  material_ids UUID[] NOT NULL DEFAULT '{}',
  reason TEXT,
  recommendation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, recommendation_date)
);

-- ─── Auto-update timestamps ───────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER materials_updated_at BEFORE UPDATE ON materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER moodboards_updated_at BEFORE UPDATE ON moodboards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER canvas_states_updated_at BEFORE UPDATE ON canvas_states
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security ───────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE moodboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_recommendations ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Materials
CREATE POLICY "Users can view own materials" ON materials
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own materials" ON materials
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own materials" ON materials
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own materials" ON materials
  FOR DELETE USING (auth.uid() = user_id);

-- Projects
CREATE POLICY "Users can CRUD own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

-- Moodboards (via project ownership)
CREATE POLICY "Users can CRUD own moodboards" ON moodboards
  FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = moodboards.project_id AND projects.user_id = auth.uid())
  );

-- Canvas states (via moodboard → project)
CREATE POLICY "Users can CRUD own canvas states" ON canvas_states
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM moodboards m
      JOIN projects p ON p.id = m.project_id
      WHERE m.id = canvas_states.moodboard_id AND p.user_id = auth.uid()
    )
  );

-- AI analyses
CREATE POLICY "Users can CRUD own analyses" ON ai_analyses
  FOR ALL USING (auth.uid() = user_id);

-- Daily recommendations
CREATE POLICY "Users can view own recommendations" ON daily_recommendations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recommendations" ON daily_recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Categories & tags are public read
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read tags" ON tags FOR SELECT USING (true);

-- ─── Storage bucket ───────────────────────────────────────────
-- Run in Supabase Dashboard → Storage:
-- Create bucket "materials" (public read, authenticated write)

-- ─── Profile auto-create on signup ────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

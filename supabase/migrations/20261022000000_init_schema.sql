-- 시안픽 (SianPick) Database Schema Migration
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  studio_name TEXT,
  role TEXT NOT NULL DEFAULT 'designer' CHECK (role IN ('designer', 'client', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'in_review' CHECK (status IN ('draft', 'in_review', 'revising', 'approved')),
  due_date DATE,
  max_revision_count INTEGER NOT NULL DEFAULT 3 CHECK (max_revision_count >= 0),
  used_revision_count INTEGER NOT NULL DEFAULT 0 CHECK (used_revision_count >= 0),
  max_selection_count INTEGER NOT NULL DEFAULT 1 CHECK (max_selection_count >= 1),
  share_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  share_password_hash TEXT,
  share_expires_at TIMESTAMPTZ,
  watermark_enabled BOOLEAN NOT NULL DEFAULT false,
  download_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Concepts Table
CREATE TABLE IF NOT EXISTS concepts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  design_concept TEXT,
  color_font_description TEXT,
  usage_recommendation TEXT,
  thumbnail_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Concept Images Table
CREATE TABLE IF NOT EXISTS concept_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Revision Requests Table (defined before concept_versions for foreign key)
CREATE TABLE IF NOT EXISTS revision_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL CHECK (revision_number >= 1),
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'designer_review', 'in_progress', 'version_uploaded', 'client_confirmed', 'rejected')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Concept Versions Table
CREATE TABLE IF NOT EXISTS concept_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1 CHECK (version_number >= 1),
  image_url TEXT NOT NULL,
  change_summary TEXT,
  revision_request_id UUID REFERENCES revision_requests(id) ON DELETE SET NULL,
  is_final BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(concept_id, version_number)
);

-- 7. Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  concept_version_id UUID REFERENCES concept_versions(id) ON DELETE SET NULL,
  author_type TEXT NOT NULL DEFAULT 'client' CHECK (author_type IN ('designer', 'client')),
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  position_x NUMERIC(5, 2), -- 0.00 to 100.00%
  position_y NUMERIC(5, 2), -- 0.00 to 100.00%
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Selections Table
CREATE TABLE IF NOT EXISTS selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  selection_type TEXT NOT NULL DEFAULT 'candidate' CHECK (selection_type IN ('candidate', 'worldcup_winner', 'final')),
  reason TEXT,
  is_final BOOLEAN NOT NULL DEFAULT false,
  selected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Worldcup Sessions Table
CREATE TABLE IF NOT EXISTS worldcup_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL DEFAULT '고객',
  winner_concept_id UUID REFERENCES concepts(id) ON DELETE SET NULL,
  state_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Worldcup Matches Table
CREATE TABLE IF NOT EXISTS worldcup_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES worldcup_sessions(id) ON DELETE CASCADE,
  left_concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  right_concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  selected_concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  match_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_share_token ON projects(share_token);
CREATE INDEX IF NOT EXISTS idx_concepts_project ON concepts(project_id, display_order);
CREATE INDEX IF NOT EXISTS idx_concept_versions_concept ON concept_versions(concept_id, version_number);
CREATE INDEX IF NOT EXISTS idx_comments_project_concept ON comments(project_id, concept_id);
CREATE INDEX IF NOT EXISTS idx_revisions_project ON revision_requests(project_id, revision_number);
CREATE INDEX IF NOT EXISTS idx_selections_project ON selections(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_project ON activity_logs(project_id, created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE worldcup_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE worldcup_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Designer profile policies
CREATE POLICY "Users can view and update their own profile"
  ON profiles FOR ALL
  USING (auth.uid() = id);

-- Project policies:
-- 1. Owner full access
CREATE POLICY "Owners can manage their projects"
  ON projects FOR ALL
  USING (auth.uid() = owner_id);

-- 2. Anyone with valid share token can read non-expired projects
CREATE POLICY "Public can view project by valid share token"
  ON projects FOR SELECT
  USING (
    share_token IS NOT NULL AND
    (share_expires_at IS NULL OR share_expires_at > NOW())
  );

-- Concept policies
CREATE POLICY "Owners have full concept access"
  ON concepts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = concepts.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Public can view public concepts of accessible project"
  ON concepts FOR SELECT
  USING (
    is_public = true AND
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = concepts.project_id
      AND (projects.share_expires_at IS NULL OR projects.share_expires_at > NOW())
    )
  );

-- Comments policies
CREATE POLICY "Project owners can manage comments"
  ON comments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = comments.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Public can view comments on accessible projects"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = comments.project_id
      AND (projects.share_expires_at IS NULL OR projects.share_expires_at > NOW())
    )
  );

CREATE POLICY "Public can insert comments on accessible projects"
  ON comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = comments.project_id
      AND (projects.share_expires_at IS NULL OR projects.share_expires_at > NOW())
    )
  );

-- Revision requests policies
CREATE POLICY "Project owners can manage revisions"
  ON revision_requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = revision_requests.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Public can view revisions on accessible projects"
  ON revision_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = revision_requests.project_id
      AND (projects.share_expires_at IS NULL OR projects.share_expires_at > NOW())
    )
  );

CREATE POLICY "Public can insert revisions on accessible projects"
  ON revision_requests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = revision_requests.project_id
      AND (projects.share_expires_at IS NULL OR projects.share_expires_at > NOW())
    )
  );

-- Selections policies
CREATE POLICY "Project owners can manage selections"
  ON selections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = selections.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Public can view and insert selections on accessible projects"
  ON selections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = selections.project_id
      AND (projects.share_expires_at IS NULL OR projects.share_expires_at > NOW())
    )
  );

-- Activity logs policies
CREATE POLICY "Project owners can view activity logs"
  ON activity_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = activity_logs.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Public can insert activity logs for accessible projects"
  ON activity_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = activity_logs.project_id
      AND (projects.share_expires_at IS NULL OR projects.share_expires_at > NOW())
    )
  );

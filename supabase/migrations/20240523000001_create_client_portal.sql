
-- Create projects table for client portal
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'on_hold')),
  client_email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date TIMESTAMPTZ DEFAULT now(),
  deadline TIMESTAMPTZ,
  budget DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create project_files table for documents and deliverables
CREATE TABLE IF NOT EXISTS project_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create project_updates table for progress tracking
CREATE TABLE IF NOT EXISTS project_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'update' CHECK (type IN ('milestone', 'update', 'issue', 'review')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Clients can view their own projects" ON projects
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create projects" ON projects
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all projects" ON projects
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Project files policies
CREATE POLICY "Clients can view their project files" ON project_files
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_files.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Authenticated users can upload project files" ON project_files
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Project updates policies
CREATE POLICY "Clients can view their project updates" ON project_updates
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_updates.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Authenticated users can create project updates" ON project_updates
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Grant permissions
GRANT SELECT ON projects TO anon;
GRANT SELECT ON project_files TO anon;
GRANT SELECT ON project_updates TO anon;

GRANT ALL ON projects TO authenticated;
GRANT ALL ON project_files TO authenticated;
GRANT ALL ON project_updates TO authenticated;

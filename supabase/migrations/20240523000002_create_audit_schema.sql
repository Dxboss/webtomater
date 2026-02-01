
-- Create audit_submissions table
CREATE TABLE IF NOT EXISTS audit_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_size INTEGER,
  tech_stack TEXT[],
  manual_hours INTEGER,
  integration_level TEXT,
  score INTEGER,
  answers JSONB,
  email TEXT, -- Optional: if we capture email at the end
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE audit_submissions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can insert audit results" ON audit_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all audits" ON audit_submissions
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Update contact_submissions policies to allow authenticated users (Admins) to view
DROP POLICY IF EXISTS "Allow admin select" ON contact_submissions;
CREATE POLICY "Authenticated users can view leads" ON contact_submissions
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin update" ON contact_submissions;
CREATE POLICY "Authenticated users can update leads" ON contact_submissions
  FOR UPDATE
  USING (auth.role() = 'authenticated');

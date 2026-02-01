-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anon to insert (subscribe)
CREATE POLICY "Allow anon insert" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Allow admins to read (if you want to see list later)
CREATE POLICY "Allow admin select" ON newsletter_subscribers FOR SELECT USING (true);

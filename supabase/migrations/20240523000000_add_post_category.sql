-- Add category column to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS category text DEFAULT 'Automation';

-- Update existing posts to have a default category if null
UPDATE posts 
SET category = 'Automation' 
WHERE category IS NULL;

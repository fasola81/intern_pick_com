-- Add avatar_url column to opportunities table
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS avatar_url text;

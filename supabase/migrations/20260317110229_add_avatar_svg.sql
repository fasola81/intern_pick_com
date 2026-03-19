-- Add avatar_svg column to opportunities table
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS avatar_svg text;

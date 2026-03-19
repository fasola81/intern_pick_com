-- Formalize all company profile columns
-- Some of these may already exist if added via Supabase Dashboard;
-- IF NOT EXISTS prevents errors in that case.

ALTER TABLE companies ADD COLUMN IF NOT EXISTS about TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS employee_count TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS address_line TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS social_links TEXT;

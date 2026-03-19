-- Add Account Owner and Hiring Managers fields to companies table

ALTER TABLE companies ADD COLUMN IF NOT EXISTS owner_name TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS owner_title TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS owner_email TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS owner_phone TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS hiring_managers_json JSONB DEFAULT '[]'::jsonb;

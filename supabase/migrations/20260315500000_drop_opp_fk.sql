-- Drop the last FK constraint preventing opportunity creation
ALTER TABLE opportunities DROP CONSTRAINT IF EXISTS opportunities_company_id_fkey;

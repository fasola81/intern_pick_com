-- ==========================================
-- InternPick Schema Enhancements
-- Adds structured data columns for Phase 3 UI features
-- ==========================================

-- 1. New ENUM types
CREATE TYPE compensation_type AS ENUM ('paid', 'unpaid', 'credit');
CREATE TYPE work_setting AS ENUM ('onsite', 'hybrid', 'remote');

-- 2. Add location (zip_code) to students and companies
ALTER TABLE students ADD COLUMN zip_code TEXT;
ALTER TABLE companies ADD COLUMN zip_code TEXT;

-- 3. Enhance opportunities table with structured fields
ALTER TABLE opportunities ADD COLUMN compensation compensation_type DEFAULT 'unpaid';
ALTER TABLE opportunities ADD COLUMN hourly_rate DECIMAL(10,2);
ALTER TABLE opportunities ADD COLUMN work_setting work_setting DEFAULT 'onsite';
ALTER TABLE opportunities ADD COLUMN required_skills TEXT[] DEFAULT '{}';
ALTER TABLE opportunities ADD COLUMN hours_per_week INTEGER;
ALTER TABLE opportunities ADD COLUMN start_date DATE;
ALTER TABLE opportunities ADD COLUMN end_date DATE;
ALTER TABLE opportunities ADD COLUMN category TEXT;

-- 4. Add optional note to student applications (interests)
ALTER TABLE interests ADD COLUMN note TEXT;

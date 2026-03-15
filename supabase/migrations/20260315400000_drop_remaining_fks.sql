-- ==========================================
-- Drop FK constraints for dev mode
-- interests.student_id and interests.opportunity_id
-- students.id and companies.id
-- ==========================================

ALTER TABLE interests DROP CONSTRAINT IF EXISTS interests_student_id_fkey;
ALTER TABLE interests DROP CONSTRAINT IF EXISTS interests_opportunity_id_fkey;
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_id_fkey;
ALTER TABLE companies DROP CONSTRAINT IF EXISTS companies_id_fkey;

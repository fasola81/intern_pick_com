-- ==========================================
-- WBL PLATFORM PIVOT
-- From B2C Job Board → B2B EdTech WBL Management SaaS
-- ==========================================
-- DECISIONS MADE:
--   1. Keep `companies` table name in DB, treat as "Employer" in UI
--   2. Student invite via link (invite_code column on students)
--   3. Clean-slate drop of legacy job board tables

-- ──────────────────────────────────────────
-- PHASE 1: Evolve existing tables
-- ──────────────────────────────────────────

-- 1A. Evolve practicum_programs
ALTER TABLE practicum_programs
  ADD COLUMN IF NOT EXISTS learning_objectives TEXT,
  ADD COLUMN IF NOT EXISTS required_total_hours INTEGER DEFAULT 120;

-- Drop job-board-era columns
ALTER TABLE practicum_programs
  DROP COLUMN IF EXISTS hosts_needed,
  DROP COLUMN IF EXISTS insurance_provided_by_school,
  DROP COLUMN IF EXISTS grants_academic_credit,
  DROP COLUMN IF EXISTS credit_hours;

-- Add school insurance with correct name
ALTER TABLE practicum_programs
  ADD COLUMN IF NOT EXISTS school_provides_insurance BOOLEAN DEFAULT false;

-- Must drop policies that depend on 'status' column before ALTER TYPE
DROP POLICY IF EXISTS "Anyone authenticated can view published programs" ON practicum_programs;
DROP POLICY IF EXISTS "Educators can insert own programs" ON practicum_programs;
DROP POLICY IF EXISTS "Educators can update own programs" ON practicum_programs;
DROP POLICY IF EXISTS "Educators can delete own draft programs" ON practicum_programs;

-- Evolve status to TEXT with CHECK (more flexible than enum)
ALTER TABLE practicum_programs
  ALTER COLUMN status DROP DEFAULT;
ALTER TABLE practicum_programs
  ALTER COLUMN status TYPE TEXT USING status::TEXT;
ALTER TABLE practicum_programs
  ALTER COLUMN status SET DEFAULT 'draft';
ALTER TABLE practicum_programs
  DROP CONSTRAINT IF EXISTS practicum_programs_status_check;
ALTER TABLE practicum_programs
  ADD CONSTRAINT practicum_programs_status_check
  CHECK (status IN ('draft', 'seeking_hosts', 'active', 'completed'));
UPDATE practicum_programs SET status = 'draft'
  WHERE status NOT IN ('draft', 'seeking_hosts', 'active', 'completed');

-- Recreate policies with new status values
CREATE POLICY "Anyone authenticated can view seeking_hosts programs"
  ON practicum_programs FOR SELECT
  USING (auth.role() = 'authenticated' AND (status = 'seeking_hosts' OR status = 'active' OR educator_id = auth.uid()));

CREATE POLICY "Educators can insert own programs"
  ON practicum_programs FOR INSERT
  WITH CHECK (educator_id = auth.uid());

CREATE POLICY "Educators can update own programs"
  ON practicum_programs FOR UPDATE
  USING (educator_id = auth.uid());

CREATE POLICY "Educators can delete own draft programs"
  ON practicum_programs FOR DELETE
  USING (educator_id = auth.uid() AND status = 'draft');

-- Drop ALL policies on host_applications first (they may reference columns we're dropping)
DROP POLICY IF EXISTS "Employers can view own applications" ON host_applications;
DROP POLICY IF EXISTS "Educators can view applications for their programs" ON host_applications;
DROP POLICY IF EXISTS "Employers can insert applications" ON host_applications;
DROP POLICY IF EXISTS "Educators can update application status" ON host_applications;

ALTER TABLE host_applications
  ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS mentorship_plan TEXT;

ALTER TABLE host_applications
  DROP COLUMN IF EXISTS proposed_mentor_title,
  DROP COLUMN IF EXISTS agrees_to_school_terms;

ALTER TABLE host_applications
  ALTER COLUMN status DROP DEFAULT;
ALTER TABLE host_applications
  ALTER COLUMN status TYPE TEXT USING status::TEXT;
ALTER TABLE host_applications
  ALTER COLUMN status SET DEFAULT 'pending';
ALTER TABLE host_applications
  DROP CONSTRAINT IF EXISTS host_applications_status_check;
ALTER TABLE host_applications
  ADD CONSTRAINT host_applications_status_check
  CHECK (status IN ('pending', 'approved_by_school', 'rejected'));
UPDATE host_applications SET status = 'pending'
  WHERE status NOT IN ('pending', 'approved_by_school', 'rejected');

-- Recreate policies for host_applications
CREATE POLICY "Employers can view own applications"
  ON host_applications FOR SELECT
  USING (employer_id = auth.uid());

CREATE POLICY "Educators can view applications for their programs"
  ON host_applications FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM practicum_programs pp
            WHERE pp.id = host_applications.practicum_program_id
            AND pp.educator_id = auth.uid())
  );

CREATE POLICY "Employers can insert applications"
  ON host_applications FOR INSERT
  WITH CHECK (employer_id = auth.uid());

CREATE POLICY "Educators can update application status"
  ON host_applications FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM practicum_programs pp
            WHERE pp.id = host_applications.practicum_program_id
            AND pp.educator_id = auth.uid())
  );

-- 1C. Evolve students table
ALTER TABLE students
  DROP COLUMN IF EXISTS skills_array,
  DROP COLUMN IF EXISTS interests_array,
  DROP COLUMN IF EXISTS generated_resume_url;

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS invite_code TEXT,
  ADD COLUMN IF NOT EXISTS invited_by_educator_id UUID;

-- ──────────────────────────────────────────
-- PHASE 2: Create new WBL tables
-- ──────────────────────────────────────────

-- 2A. Placements (Tripartite Link: Student ↔ Host ↔ Program)
CREATE TABLE IF NOT EXISTS placements (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id            UUID NOT NULL,
  host_application_id   UUID NOT NULL,
  practicum_program_id  UUID NOT NULL,
  educator_signed_at    TIMESTAMPTZ,
  employer_signed_at    TIMESTAMPTZ,
  student_signed_at     TIMESTAMPTZ,
  status                TEXT DEFAULT 'pending_signatures'
                        CHECK (status IN ('pending_signatures', 'active', 'completed')),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, practicum_program_id)
);

CREATE TRIGGER set_placements_updated_at
BEFORE UPDATE ON placements
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_placements_student ON placements(student_id);
CREATE INDEX IF NOT EXISTS idx_placements_host ON placements(host_application_id);
CREATE INDEX IF NOT EXISTS idx_placements_program ON placements(practicum_program_id);

-- 2B. Time Logs (Student Timesheets)
CREATE TABLE IF NOT EXISTS time_logs (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  placement_id    UUID NOT NULL,
  student_id      UUID NOT NULL,
  log_date        DATE NOT NULL,
  hours_worked    DECIMAL(4,2) NOT NULL CHECK (hours_worked > 0 AND hours_worked <= 24),
  journal_entry   TEXT,
  status          TEXT DEFAULT 'pending_employer_approval'
                  CHECK (status IN ('pending_employer_approval', 'approved', 'rejected')),
  employer_notes  TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_time_logs_updated_at
BEFORE UPDATE ON time_logs
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_time_logs_placement ON time_logs(placement_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_student ON time_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_date ON time_logs(log_date);

-- 2C. Evaluations (End-of-Term Grading)
CREATE TABLE IF NOT EXISTS evaluations (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  placement_id    UUID NOT NULL UNIQUE,
  employer_id     UUID NOT NULL,
  rubric_scores   JSONB DEFAULT '{}'::jsonb,
  comments        TEXT,
  submitted_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_evaluations_updated_at
BEFORE UPDATE ON evaluations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_evaluations_placement ON evaluations(placement_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_employer ON evaluations(employer_id);

-- ──────────────────────────────────────────
-- PHASE 3: RLS for new tables
-- ──────────────────────────────────────────

ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Placements
CREATE POLICY "Educators view placements for their programs"
  ON placements FOR SELECT USING (
    EXISTS (SELECT 1 FROM practicum_programs pp
            WHERE pp.id = placements.practicum_program_id
            AND pp.educator_id = auth.uid())
  );

CREATE POLICY "Employers view their placements"
  ON placements FOR SELECT USING (
    EXISTS (SELECT 1 FROM host_applications ha
            WHERE ha.id = placements.host_application_id
            AND ha.employer_id = auth.uid())
  );

CREATE POLICY "Students view own placements"
  ON placements FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Educators create placements"
  ON placements FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM practicum_programs pp
            WHERE pp.id = placements.practicum_program_id
            AND pp.educator_id = auth.uid())
  );

CREATE POLICY "Educators update placements"
  ON placements FOR UPDATE USING (
    EXISTS (SELECT 1 FROM practicum_programs pp
            WHERE pp.id = placements.practicum_program_id
            AND pp.educator_id = auth.uid())
  );

-- Allow employers and students to update (for signing)
CREATE POLICY "Employers sign placements"
  ON placements FOR UPDATE USING (
    EXISTS (SELECT 1 FROM host_applications ha
            WHERE ha.id = placements.host_application_id
            AND ha.employer_id = auth.uid())
  );

CREATE POLICY "Students sign placements"
  ON placements FOR UPDATE USING (student_id = auth.uid());

-- Time Logs
CREATE POLICY "Students insert own time logs"
  ON time_logs FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students view own time logs"
  ON time_logs FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Employers view time logs for their placements"
  ON time_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM placements p
            JOIN host_applications ha ON ha.id = p.host_application_id
            WHERE p.id = time_logs.placement_id AND ha.employer_id = auth.uid())
  );

CREATE POLICY "Employers update time log status"
  ON time_logs FOR UPDATE USING (
    EXISTS (SELECT 1 FROM placements p
            JOIN host_applications ha ON ha.id = p.host_application_id
            WHERE p.id = time_logs.placement_id AND ha.employer_id = auth.uid())
  );

CREATE POLICY "Educators view time logs for their programs"
  ON time_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM placements p
            JOIN practicum_programs pp ON pp.id = p.practicum_program_id
            WHERE p.id = time_logs.placement_id AND pp.educator_id = auth.uid())
  );

-- Evaluations
CREATE POLICY "Employers insert evaluations"
  ON evaluations FOR INSERT WITH CHECK (employer_id = auth.uid());

CREATE POLICY "Employers update own evaluations"
  ON evaluations FOR UPDATE USING (employer_id = auth.uid());

CREATE POLICY "Educators view evaluations for their programs"
  ON evaluations FOR SELECT USING (
    EXISTS (SELECT 1 FROM placements p
            JOIN practicum_programs pp ON pp.id = p.practicum_program_id
            WHERE p.id = evaluations.placement_id AND pp.educator_id = auth.uid())
  );

CREATE POLICY "Employers view own evaluations"
  ON evaluations FOR SELECT USING (employer_id = auth.uid());

-- ──────────────────────────────────────────
-- PHASE 4: Drop legacy job board tables
-- ──────────────────────────────────────────

-- Drop in dependency order
DROP TABLE IF EXISTS candidate_messages CASCADE;
DROP TABLE IF EXISTS student_videos CASCADE;
DROP TABLE IF EXISTS invitations CASCADE;
DROP TABLE IF EXISTS interests CASCADE;
DROP TABLE IF EXISTS opportunities CASCADE;

-- Drop legacy enums
DROP TYPE IF EXISTS compensation_type;
DROP TYPE IF EXISTS work_setting;
DROP TYPE IF EXISTS interest_status;
DROP TYPE IF EXISTS practicum_status;
DROP TYPE IF EXISTS host_application_status;

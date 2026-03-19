-- ==========================================
-- Reverse Marketplace: School Practicum Programs
-- Adds Educator role, Practicum Programs, and Host Applications
-- ==========================================

-- 1. New ENUM types
CREATE TYPE practicum_status AS ENUM ('draft', 'pending_review', 'published', 'closed');
CREATE TYPE host_application_status AS ENUM ('pending', 'accepted', 'declined');

-- 2. Add 'educator' to existing user_role ENUM
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'educator';

-- 3. Educators Profile Table
CREATE TABLE educators (
  id              UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name       TEXT NOT NULL,
  school_name     TEXT NOT NULL,
  district        TEXT,
  state           TEXT,
  email_domain    TEXT,
  title           TEXT,
  is_verified     BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_educators_updated_at
BEFORE UPDATE ON educators
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 4. Practicum Programs Table (FERPA-compliant: NO student PII)
CREATE TABLE practicum_programs (
  id                            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  educator_id                   UUID NOT NULL,
  school_name                   TEXT NOT NULL,
  district                      TEXT,
  title                         TEXT NOT NULL,
  description                   TEXT NOT NULL,
  category                      TEXT,
  start_date                    DATE,
  end_date                      DATE,
  hours_per_week                INTEGER DEFAULT 10,
  hosts_needed                  INTEGER DEFAULT 1,
  insurance_provided_by_school  BOOLEAN DEFAULT false,
  grants_academic_credit        BOOLEAN DEFAULT true,
  credit_hours                  INTEGER,
  status                        practicum_status DEFAULT 'draft',
  ai_review_notes               TEXT,
  created_at                    TIMESTAMPTZ DEFAULT NOW(),
  updated_at                    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_practicum_programs_updated_at
BEFORE UPDATE ON practicum_programs
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_practicum_programs_educator_id ON practicum_programs(educator_id);
CREATE INDEX idx_practicum_programs_status ON practicum_programs(status);

-- 5. Host Applications Table (Employers apply to mentor)
CREATE TABLE host_applications (
  id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  practicum_program_id    UUID NOT NULL,
  employer_id             UUID NOT NULL,
  proposed_mentor_name    TEXT NOT NULL,
  proposed_mentor_title   TEXT,
  proposed_mentor_email   TEXT,
  message_to_educator     TEXT NOT NULL,
  agrees_to_school_terms  BOOLEAN DEFAULT false,
  status                  host_application_status DEFAULT 'pending',
  educator_notes          TEXT,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(practicum_program_id, employer_id)
);

CREATE TRIGGER set_host_applications_updated_at
BEFORE UPDATE ON host_applications
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_host_applications_program ON host_applications(practicum_program_id);
CREATE INDEX idx_host_applications_employer ON host_applications(employer_id);

-- 6. Row Level Security

ALTER TABLE educators ENABLE ROW LEVEL SECURITY;
ALTER TABLE practicum_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_applications ENABLE ROW LEVEL SECURITY;

-- educators policies
CREATE POLICY "Educators can view own profile"
  ON educators FOR SELECT USING (id = auth.uid());

CREATE POLICY "Educators can insert own profile"
  ON educators FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Educators can update own profile"
  ON educators FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Verified educator profiles are public"
  ON educators FOR SELECT USING (is_verified = true);

-- practicum_programs policies
CREATE POLICY "Anyone authenticated can view published programs"
  ON practicum_programs FOR SELECT
  USING (auth.role() = 'authenticated' AND (status = 'published' OR educator_id = auth.uid()));

CREATE POLICY "Educators can insert own programs"
  ON practicum_programs FOR INSERT
  WITH CHECK (educator_id = auth.uid());

CREATE POLICY "Educators can update own programs"
  ON practicum_programs FOR UPDATE
  USING (educator_id = auth.uid());

CREATE POLICY "Educators can delete own draft programs"
  ON practicum_programs FOR DELETE
  USING (educator_id = auth.uid() AND status = 'draft');

-- host_applications policies
CREATE POLICY "Employers can view own applications"
  ON host_applications FOR SELECT
  USING (employer_id = auth.uid());

CREATE POLICY "Educators can view applications for their programs"
  ON host_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM practicum_programs pp
      WHERE pp.id = host_applications.practicum_program_id
        AND pp.educator_id = auth.uid()
    )
  );

CREATE POLICY "Employers can insert applications"
  ON host_applications FOR INSERT
  WITH CHECK (employer_id = auth.uid() AND agrees_to_school_terms = true);

CREATE POLICY "Educators can update application status"
  ON host_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM practicum_programs pp
      WHERE pp.id = host_applications.practicum_program_id
        AND pp.educator_id = auth.uid()
    )
  );

-- 7. Update ai_moderation_logs to support educator content
ALTER TABLE ai_moderation_logs DROP CONSTRAINT IF EXISTS ai_moderation_logs_sender_role_check;
ALTER TABLE ai_moderation_logs ADD CONSTRAINT ai_moderation_logs_sender_role_check
  CHECK (sender_role IN ('student', 'company', 'educator'));

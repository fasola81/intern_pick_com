-- Fix: Ensure all WBL columns exist on practicum_programs
-- This is a safe idempotent migration to add any missing columns

ALTER TABLE practicum_programs
  ADD COLUMN IF NOT EXISTS learning_objectives TEXT,
  ADD COLUMN IF NOT EXISTS required_total_hours INTEGER DEFAULT 120,
  ADD COLUMN IF NOT EXISTS school_provides_insurance BOOLEAN DEFAULT false;

-- Ensure placements table exists for student dashboard
CREATE TABLE IF NOT EXISTS placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practicum_program_id UUID REFERENCES practicum_programs(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  employer_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  host_application_id UUID REFERENCES host_applications(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure time_logs table exists for student hour tracking
CREATE TABLE IF NOT EXISTS time_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  placement_id UUID REFERENCES placements(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  hours NUMERIC(4,1) NOT NULL CHECK (hours > 0 AND hours <= 24),
  notes TEXT,
  approved_by_employer BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for placements
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Students see own placements" ON placements;
CREATE POLICY "Students see own placements" ON placements FOR SELECT
  USING (auth.uid() = student_id);
DROP POLICY IF EXISTS "Employers see own placements" ON placements;
CREATE POLICY "Employers see own placements" ON placements FOR SELECT
  USING (auth.uid() = employer_id);
DROP POLICY IF EXISTS "Educators manage placements" ON placements;
CREATE POLICY "Educators manage placements" ON placements FOR ALL
  USING (
    auth.uid() IN (
      SELECT educator_id FROM practicum_programs WHERE id = practicum_program_id
    )
  );

-- RLS for time_logs
ALTER TABLE time_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Students manage own time_logs" ON time_logs;
CREATE POLICY "Students manage own time_logs" ON time_logs FOR ALL
  USING (auth.uid() = student_id);
DROP POLICY IF EXISTS "Employers view placement time_logs" ON time_logs;
CREATE POLICY "Employers view placement time_logs" ON time_logs FOR SELECT
  USING (
    placement_id IN (SELECT id FROM placements WHERE employer_id = auth.uid())
  );

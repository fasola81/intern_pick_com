-- ==========================================
-- Role Invitations Table
-- Employers can invite students to apply to specific roles
-- ==========================================

CREATE TABLE IF NOT EXISTS invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  student_id UUID NOT NULL,
  opportunity_id UUID NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, opportunity_id)
);

-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Permissive policies for development
DROP POLICY IF EXISTS "allow_insert_invitations" ON invitations;
CREATE POLICY "allow_insert_invitations" ON invitations
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "allow_select_invitations" ON invitations;
CREATE POLICY "allow_select_invitations" ON invitations
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow_update_invitations" ON invitations;
CREATE POLICY "allow_update_invitations" ON invitations
  FOR UPDATE USING (true);

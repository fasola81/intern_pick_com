-- ==========================================
-- Candidate Messages Table
-- AI-moderated messages between employers and candidates
-- ==========================================

CREATE TABLE IF NOT EXISTS candidate_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  interest_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('employer', 'student')),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE candidate_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_insert_candidate_messages" ON candidate_messages;
CREATE POLICY "allow_insert_candidate_messages" ON candidate_messages
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "allow_select_candidate_messages" ON candidate_messages;
CREATE POLICY "allow_select_candidate_messages" ON candidate_messages
  FOR SELECT USING (true);

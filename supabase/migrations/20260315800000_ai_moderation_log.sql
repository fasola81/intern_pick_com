-- AI Moderation Logs Table
CREATE TABLE IF NOT EXISTS ai_moderation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID,
  sender_role TEXT CHECK (sender_role IN ('student', 'company')),
  message_text TEXT NOT NULL,
  flagged_reason TEXT NOT NULL,
  category TEXT CHECK (category IN ('harassment', 'pii_request', 'inappropriate', 'scam', 'predatory', 'other')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE ai_moderation_logs ENABLE ROW LEVEL SECURITY;

-- Permissive policies for development
CREATE POLICY "allow_insert_moderation_logs" ON ai_moderation_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "allow_select_moderation_logs" ON ai_moderation_logs
  FOR SELECT USING (true);

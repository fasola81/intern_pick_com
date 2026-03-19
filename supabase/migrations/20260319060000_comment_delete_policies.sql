-- Allow comment deletion for employers (who own the opportunity) and comment authors
-- Guarded: comments table may not exist in all environments
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'comments') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can delete their own comments" ON comments';
    EXECUTE 'CREATE POLICY "Users can delete their own comments" ON comments FOR DELETE USING (user_id = auth.uid())';
    
    EXECUTE 'DROP POLICY IF EXISTS "Employers can delete comments on their opportunities" ON comments';
    EXECUTE 'CREATE POLICY "Employers can delete comments on their opportunities" ON comments FOR DELETE USING (EXISTS (SELECT 1 FROM opportunities o WHERE o.id = comments.opportunity_id AND o.company_id = auth.uid()))';
  END IF;
END
$$;


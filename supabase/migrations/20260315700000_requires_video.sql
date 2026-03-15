-- Add requires_video flag to opportunities
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS requires_video BOOLEAN DEFAULT false;

-- Mark some roles as requiring video introductions
UPDATE opportunities SET requires_video = true
WHERE title IN (
  'AI Tutor Intern',
  'Campus Ambassador',
  'Customer Support Intern',
  'Video Production Intern',
  'Social Media Manager Intern',
  'Content Creator & Copywriter'
);

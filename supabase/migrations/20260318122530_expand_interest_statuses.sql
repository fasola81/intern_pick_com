-- Expand interest_status ENUM
ALTER TYPE interest_status ADD VALUE IF NOT EXISTS 'applied';
ALTER TYPE interest_status ADD VALUE IF NOT EXISTS 'screening';
ALTER TYPE interest_status ADD VALUE IF NOT EXISTS 'interviewing';
ALTER TYPE interest_status ADD VALUE IF NOT EXISTS 'offered';

-- Note: The existing values are 'pending', 'accepted', and 'declined'.
-- 'pending' will be replaced by 'applied' in the UI, but we'll leave it in the DB to avoid breaking existing records.

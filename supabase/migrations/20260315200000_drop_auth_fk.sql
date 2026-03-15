-- ==========================================
-- Drop FK constraint on users.id for dev mode
-- This allows demo UUIDs to be inserted without
-- requiring an auth.users record first
-- ==========================================

-- Drop the foreign key constraint from users to auth.users
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

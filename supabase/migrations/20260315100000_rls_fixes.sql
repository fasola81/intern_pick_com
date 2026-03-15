-- ==========================================
-- InternPick RLS Policy Fixes
-- Allow inserts for demo/dev mode (no auth)
-- Allow public read for opportunities feed
-- ==========================================

-- 1. Users table: allow inserts (needed for onboarding)
CREATE POLICY "Allow user profile creation"
ON users FOR INSERT WITH CHECK (true);

-- 2. Students table: allow inserts (needed for student onboarding)
CREATE POLICY "Allow student profile creation"
ON students FOR INSERT WITH CHECK (true);

-- 3. Companies table: allow inserts (needed for employer onboarding)
CREATE POLICY "Allow company profile creation"
ON companies FOR INSERT WITH CHECK (true);

-- 4. Opportunities: allow public read for the student feed (anon key)
-- Drop the existing restrictive SELECT and replace with public read for active
DROP POLICY IF EXISTS "Anyone logged in can view active opportunities or their own" ON opportunities;

CREATE POLICY "Anyone can view active opportunities"
ON opportunities FOR SELECT USING (is_active = true);

CREATE POLICY "Companies can view their own opportunities"
ON opportunities FOR SELECT USING (company_id = auth.uid());

-- 5. Opportunities: allow inserts for demo mode
CREATE POLICY "Allow opportunity creation"
ON opportunities FOR INSERT WITH CHECK (true);

-- 6. Interests: allow inserts for demo mode (Quick Apply)
DROP POLICY IF EXISTS "Students can insert interests" ON interests;

CREATE POLICY "Allow interest creation"
ON interests FOR INSERT WITH CHECK (true);

-- 7. Interests: allow public read for demo mode
DROP POLICY IF EXISTS "Students can view their own interests" ON interests;

CREATE POLICY "Anyone can view their interests"
ON interests FOR SELECT USING (true);

-- 8. Users: allow public read so joins work
DROP POLICY IF EXISTS "Users can view their own record" ON users;

CREATE POLICY "Users are readable"
ON users FOR SELECT USING (true);

-- 9. Students: allow public read for demo
DROP POLICY IF EXISTS "Students can view their own profile" ON students;

CREATE POLICY "Students are readable"
ON students FOR SELECT USING (true);

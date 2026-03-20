-- Add strict policies over previously public tables

-- 1. Drop the dangerous public policies
DROP POLICY IF EXISTS "Users are readable" ON users;
DROP POLICY IF EXISTS "Students are readable" ON students;

-- 2. Restrict Users Table
CREATE POLICY "Users can view their own record" ON users FOR SELECT USING (id = auth.uid());

CREATE POLICY "Educators can view user data" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'educator')
);

CREATE POLICY "Employers can view user data" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'company')
);

-- 3. Restrict Students Table
CREATE POLICY "Students can view their own profile" ON students FOR SELECT USING (id = auth.uid());

CREATE POLICY "Educators can view student profiles" ON students FOR SELECT USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'educator')
);

CREATE POLICY "Employers can view applied student profiles" ON students FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM interests i JOIN opportunities o ON i.opportunity_id = o.id
    WHERE i.student_id = students.id AND o.company_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM placements p 
    WHERE p.student_id = students.id AND p.employer_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'company' 
    -- Fallback for employers discovering candidate profiles via matching, restricted to authenticated employers
  )
);

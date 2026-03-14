-- ==========================================
-- InternPick Database Schema Initialization
-- ==========================================

-- 1. Custom Types
CREATE TYPE user_role AS ENUM ('student', 'company', 'admin');
CREATE TYPE interest_status AS ENUM ('pending', 'reviewed', 'accepted', 'declined');

-- 2. Trigger Function for updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Core Tables Creation

-- Users Table (Extends auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  role user_role NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Companies Table
CREATE TABLE companies (
  id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  company_name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  description TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Students Table
CREATE TABLE students (
  id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  high_school_name TEXT NOT NULL,
  graduation_year INTEGER,
  skills_array TEXT[] DEFAULT '{}',
  interests_array TEXT[] DEFAULT '{}',
  generated_resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_students_updated_at
BEFORE UPDATE ON students
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Opportunities Table
CREATE TABLE opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_opportunities_updated_at
BEFORE UPDATE ON opportunities
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Interests Table
CREATE TABLE interests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE NOT NULL,
  status interest_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, opportunity_id) -- Prevent duplicate applications
);

CREATE TRIGGER set_interests_updated_at
BEFORE UPDATE ON interests
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 4. Performance Indexes
CREATE INDEX idx_opportunities_company_id ON opportunities(company_id);
CREATE INDEX idx_interests_student_id ON interests(student_id);
CREATE INDEX idx_interests_opportunity_id ON interests(opportunity_id);

-- 5. Row Level Security (RLS) Implementation

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;

-- users policies
CREATE POLICY "Users can view their own record"
ON users FOR SELECT USING (auth.uid() = id);

-- opportunities policies
CREATE POLICY "Anyone logged in can view active opportunities or their own"
ON opportunities FOR SELECT USING (
  auth.role() = 'authenticated' AND (is_active = true OR company_id = auth.uid())
);

CREATE POLICY "Companies can insert their own opportunities"
ON opportunities FOR INSERT WITH CHECK (company_id = auth.uid());

CREATE POLICY "Companies can update their own opportunities"
ON opportunities FOR UPDATE USING (company_id = auth.uid());

CREATE POLICY "Companies can delete their own opportunities"
ON opportunities FOR DELETE USING (company_id = auth.uid());

-- students policies
CREATE POLICY "Students can view their own profile"
ON students FOR SELECT USING (id = auth.uid());

CREATE POLICY "Companies can view student profiles if interested"
ON students FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM interests i
    JOIN opportunities o ON i.opportunity_id = o.id
    WHERE i.student_id = students.id AND o.company_id = auth.uid()
  )
);

CREATE POLICY "Students can update their own profile"
ON students FOR UPDATE USING (id = auth.uid());

-- companies policies
CREATE POLICY "Companies are publicly readable"
ON companies FOR SELECT USING (true);

CREATE POLICY "Companies can update their own profile"
ON companies FOR UPDATE USING (id = auth.uid());

-- interests policies
CREATE POLICY "Students can view their own interests"
ON interests FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Companies can view interests tied to their opportunities"
ON interests FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM opportunities o 
    WHERE o.id = interests.opportunity_id AND o.company_id = auth.uid()
  )
);

CREATE POLICY "Students can insert interests"
ON interests FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Companies can update interest status"
ON interests FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM opportunities o 
    WHERE o.id = interests.opportunity_id AND o.company_id = auth.uid()
  )
);

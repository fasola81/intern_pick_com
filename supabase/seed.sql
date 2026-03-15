-- ==========================================
-- InternPick Seed Data
-- SwiftLearn.ai + 20 Roles + 5 Students + Applications
-- ==========================================

-- Clean up existing demo data first
DELETE FROM interests WHERE student_id IN (
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000003',
  '10000000-0000-0000-0000-000000000004',
  '10000000-0000-0000-0000-000000000005'
);
DELETE FROM opportunities WHERE company_id IN (
  '00000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000001'
);
DELETE FROM students WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000003',
  '10000000-0000-0000-0000-000000000004',
  '10000000-0000-0000-0000-000000000005'
);
DELETE FROM companies WHERE id IN (
  '00000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000001'
);
DELETE FROM users WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000003',
  '10000000-0000-0000-0000-000000000004',
  '10000000-0000-0000-0000-000000000005',
  '20000000-0000-0000-0000-000000000001'
);

-- ========================================
-- 1. SwiftLearn.ai Company Profile
-- ========================================
INSERT INTO users (id, role, full_name) VALUES
  ('20000000-0000-0000-0000-000000000001', 'company', 'SwiftLearn.ai');

INSERT INTO companies (id, company_name, industry, website, description, contact_email, zip_code) VALUES
  ('20000000-0000-0000-0000-000000000001',
   'SwiftLearn.ai',
   'tech',
   'https://swiftlearn.ai',
   'AI-powered education platform connecting learners with personalized, bite-sized lessons. We believe technology can make education accessible, engaging, and fun for everyone.',
   'careers@swiftlearn.ai',
   '60601');

-- ========================================
-- 2. 20 Diverse Internship Roles
-- ========================================
INSERT INTO opportunities (company_id, title, description, category, compensation, hourly_rate, work_setting, required_skills, hours_per_week, is_active) VALUES

-- 1. Marketing & Social Media
('20000000-0000-0000-0000-000000000001',
 'Social Media Marketing Intern',
 'Help us grow our TikTok, Instagram, and LinkedIn presence. You''ll create engaging short-form video scripts, schedule posts using Buffer, and analyze engagement metrics weekly. Great opportunity to learn how an AI startup markets to schools.',
 'marketing', 'paid', 18.00, 'hybrid',
 ARRAY['Social Media', 'Canva', 'Communication', 'Writing'],
 15, true),

-- 2. Content Creation
('20000000-0000-0000-0000-000000000001',
 'Content Creator & Copywriter',
 'Write blog posts, email newsletters, and landing page copy that explains complex AI concepts in simple language. Perfect for students who love writing and want to explore tech communications.',
 'marketing', 'paid', 17.00, 'remote',
 ARRAY['Writing', 'Communication', 'SEO'],
 12, true),

-- 3. Graphic Design
('20000000-0000-0000-0000-000000000001',
 'Graphic Design Intern',
 'Design social media graphics, presentation decks, and product mockups using Figma and Canva. Collaborate directly with our Head of Design on brand refresh projects.',
 'arts', 'paid', 19.00, 'hybrid',
 ARRAY['Canva', 'Detail Oriented'],
 15, true),

-- 4. Frontend Web Development
('20000000-0000-0000-0000-000000000001',
 'Frontend Developer Intern',
 'Build React components for our learner dashboard, fix CSS bugs, and help implement dark mode across the platform. You should know basic HTML/CSS and be eager to learn React and TypeScript.',
 'tech', 'paid', 22.00, 'remote',
 ARRAY['Problem Solving', 'Detail Oriented'],
 20, true),

-- 5. Data Entry & Operations
('20000000-0000-0000-0000-000000000001',
 'Data Entry & Quality Assurance Intern',
 'Review lesson content for accuracy, tag curriculum materials by grade level and subject, and maintain our content database. This role requires careful attention to detail and comfort with spreadsheets.',
 'admin', 'paid', 15.00, 'remote',
 ARRAY['Data Entry', 'Excel', 'Detail Oriented', 'G-Suite'],
 10, true),

-- 6. Customer Success
('20000000-0000-0000-0000-000000000001',
 'Customer Success Intern',
 'Respond to user support tickets, create helpful tutorial videos, and collect feedback from school administrators. You''ll be the voice of SwiftLearn to our users!',
 'admin', 'paid', 16.00, 'hybrid',
 ARRAY['Customer Service', 'Communication', 'Problem Solving'],
 15, true),

-- 7. Sales & Outreach
('20000000-0000-0000-0000-000000000001',
 'Sales Development Representative Intern',
 'Research potential school district partners, draft outreach emails, and help maintain our CRM pipeline. Learn B2B sales from the ground up at an AI-first company.',
 'admin', 'paid', 17.00, 'onsite',
 ARRAY['Communication', 'Excel', 'Writing'],
 15, true),

-- 8. Video Production
('20000000-0000-0000-0000-000000000001',
 'Video Production Intern',
 'Film, edit, and produce educational tutorial videos, product demos, and student testimonials. Experience with CapCut, iMovie, or Premiere Pro is a plus.',
 'arts', 'paid', 18.00, 'hybrid',
 ARRAY['Communication', 'Detail Oriented'],
 12, true),

-- 9. Product Management
('20000000-0000-0000-0000-000000000001',
 'Product Management Intern',
 'Assist our PM team with user research interviews, competitive analysis, and writing feature specs. Shadow product reviews and learn how AI product decisions are made.',
 'tech', 'paid', 20.00, 'hybrid',
 ARRAY['Communication', 'Writing', 'Problem Solving', 'Excel'],
 15, true),

-- 10. Community Manager
('20000000-0000-0000-0000-000000000001',
 'Community Manager Intern',
 'Moderate our Discord and online forums, organize virtual study groups, and plan community events. Help us build a vibrant learner community.',
 'marketing', 'paid', 16.00, 'remote',
 ARRAY['Social Media', 'Communication', 'Writing'],
 10, true),

-- 11. SEO Specialist
('20000000-0000-0000-0000-000000000001',
 'SEO & Analytics Intern',
 'Audit our website for SEO opportunities, optimize blog content with targeted keywords, track rankings in Google Search Console, and build monthly reports using Google Analytics.',
 'marketing', 'paid', 17.00, 'remote',
 ARRAY['SEO', 'Excel', 'Writing', 'G-Suite'],
 12, true),

-- 12. HR & People Operations
('20000000-0000-0000-0000-000000000001',
 'People Operations Intern',
 'Help organize team events, assist with onboarding new hires, maintain team directories, and support recruiting efforts. Perfect for HR-curious students.',
 'admin', 'unpaid', NULL, 'onsite',
 ARRAY['Communication', 'Excel', 'G-Suite', 'Detail Oriented'],
 10, true),

-- 13. Finance & Accounting
('20000000-0000-0000-0000-000000000001',
 'Finance & Bookkeeping Intern',
 'Assist with invoice processing, expense categorization in QuickBooks, and help prepare monthly financial summaries. Fantastic intro to startup finance.',
 'finance', 'paid', 17.00, 'onsite',
 ARRAY['Excel', 'Detail Oriented', 'Data Entry'],
 10, true),

-- 14. UX Research
('20000000-0000-0000-0000-000000000001',
 'UX Research Intern',
 'Conduct usability testing sessions with real students, synthesize findings into actionable insights, and present recommendations to the product team. No prior UX experience needed — just curiosity.',
 'tech', 'paid', 19.00, 'hybrid',
 ARRAY['Communication', 'Writing', 'Problem Solving', 'Detail Oriented'],
 15, true),

-- 15. Mobile App Testing
('20000000-0000-0000-0000-000000000001',
 'Mobile App QA Tester',
 'Test our iOS and Android apps before each release, document bugs with detailed reproduction steps, and verify fixes. You will use TestFlight and internal testing tools.',
 'tech', 'paid', 16.00, 'remote',
 ARRAY['Detail Oriented', 'Problem Solving'],
 10, true),

-- 16. Event Planning
('20000000-0000-0000-0000-000000000001',
 'Events & Partnerships Intern',
 'Help plan our annual "Learn Forward" hackathon, coordinate sponsor logistics, and manage event day operations. Great for people-persons who love organizing.',
 'admin', 'credit', NULL, 'onsite',
 ARRAY['Communication', 'Project Management', 'Public Speaking'],
 12, true),

-- 17. AI Prompt Engineering
('20000000-0000-0000-0000-000000000001',
 'AI Prompt Engineering Intern',
 'Craft and test prompts for our AI tutoring engine, evaluate response quality, and help build our prompt library. You''ll learn how large language models work from the inside.',
 'tech', 'paid', 22.00, 'remote',
 ARRAY['Writing', 'Problem Solving', 'Detail Oriented'],
 15, true),

-- 18. Curriculum Design
('20000000-0000-0000-0000-000000000001',
 'Curriculum Design Intern',
 'Help build lesson plans for K-12 subjects using our AI-assisted content tools. Review existing materials for clarity and age-appropriateness. Teaching experience or tutoring background is a plus.',
 'education', 'paid', 18.00, 'remote',
 ARRAY['Writing', 'Detail Oriented', 'Communication'],
 12, true),

-- 19. Email Marketing
('20000000-0000-0000-0000-000000000001',
 'Email Marketing Intern',
 'Design and A/B test email campaigns in Mailchimp, segment our mailing list, and write subject lines that get opened. Track open rates, clicks, and conversions.',
 'marketing', 'paid', 16.50, 'remote',
 ARRAY['Writing', 'Data Entry', 'Communication', 'Detail Oriented'],
 10, true),

-- 20. IT & Help Desk
('20000000-0000-0000-0000-000000000001',
 'IT Help Desk & Support Intern',
 'Assist the team with hardware setup, software troubleshooting, account provisioning, and maintaining our internal wiki. Great for tech-savvy problem solvers.',
 'tech', 'paid', 16.00, 'onsite',
 ARRAY['Problem Solving', 'Customer Service', 'G-Suite'],
 15, true);


-- ========================================
-- 3. Five Student Profiles
-- ========================================

-- Student 1: Maria Rodriguez — Marketing-focused
INSERT INTO users (id, role, full_name) VALUES
  ('10000000-0000-0000-0000-000000000001', 'student', 'Maria Rodriguez');
INSERT INTO students (id, high_school_name, graduation_year, zip_code, skills_array, interests_array) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Lincoln High School', 2027, '60602',
   ARRAY['Social Media', 'Canva', 'Writing', 'Communication'],
   ARRAY['Marketing', 'Design', 'Content Creation']);

-- Student 2: James Park — Tech-focused
INSERT INTO users (id, role, full_name) VALUES
  ('10000000-0000-0000-0000-000000000002', 'student', 'James Park');
INSERT INTO students (id, high_school_name, graduation_year, zip_code, skills_array, interests_array) VALUES
  ('10000000-0000-0000-0000-000000000002', 'Whitney Young Magnet', 2026, '60605',
   ARRAY['Problem Solving', 'Detail Oriented', 'Excel', 'G-Suite'],
   ARRAY['Technology', 'Data Analysis', 'Engineering']);

-- Student 3: Aisha Johnson — Creative & Administrative
INSERT INTO users (id, role, full_name) VALUES
  ('10000000-0000-0000-0000-000000000003', 'student', 'Aisha Johnson');
INSERT INTO students (id, high_school_name, graduation_year, zip_code, skills_array, interests_array) VALUES
  ('10000000-0000-0000-0000-000000000003', 'Jones College Prep', 2027, '60607',
   ARRAY['Communication', 'Public Speaking', 'Writing', 'Project Management'],
   ARRAY['Business', 'Event Planning', 'HR']);

-- Student 4: Lucas Chen — Finance & Data
INSERT INTO users (id, role, full_name) VALUES
  ('10000000-0000-0000-0000-000000000004', 'student', 'Lucas Chen');
INSERT INTO students (id, high_school_name, graduation_year, zip_code, skills_array, interests_array) VALUES
  ('10000000-0000-0000-0000-000000000004', 'Northside College Prep', 2026, '60614',
   ARRAY['Excel', 'Data Entry', 'Detail Oriented', 'Problem Solving'],
   ARRAY['Finance', 'Accounting', 'Data Analysis']);

-- Student 5: Sophia Williams — Multi-interest
INSERT INTO users (id, role, full_name) VALUES
  ('10000000-0000-0000-0000-000000000005', 'student', 'Sophia Williams');
INSERT INTO students (id, high_school_name, graduation_year, zip_code, skills_array, interests_array) VALUES
  ('10000000-0000-0000-0000-000000000005', 'Walter Payton College Prep', 2027, '60610',
   ARRAY['Customer Service', 'Communication', 'SEO', 'Social Media'],
   ARRAY['Marketing', 'Customer Success', 'Community']);


-- ========================================
-- 4. Student Applications (Interests)
-- ========================================
-- We need the opportunity IDs. Since they're auto-generated UUIDs,
-- we'll use a CTE to reference them.

-- Maria applies for marketing-related roles
INSERT INTO interests (student_id, opportunity_id, note, status)
SELECT '10000000-0000-0000-0000-000000000001', id,
  'I run my school''s Instagram account and would love to bring my content skills to SwiftLearn!',
  'pending'
FROM opportunities WHERE title = 'Social Media Marketing Intern'
  AND company_id = '20000000-0000-0000-0000-000000000001';

INSERT INTO interests (student_id, opportunity_id, note, status)
SELECT '10000000-0000-0000-0000-000000000001', id,
  'Writing is my passion — I''d be thrilled to write about AI and education.',
  'reviewed'
FROM opportunities WHERE title = 'Content Creator & Copywriter'
  AND company_id = '20000000-0000-0000-0000-000000000001';

INSERT INTO interests (student_id, opportunity_id, note, status)
SELECT '10000000-0000-0000-0000-000000000001', id,
  'I''m Canva-certified and love visual storytelling!',
  'accepted'
FROM opportunities WHERE title = 'Graphic Design Intern'
  AND company_id = '20000000-0000-0000-0000-000000000001';

-- James applies for tech roles
INSERT INTO interests (student_id, opportunity_id, note, status)
SELECT '10000000-0000-0000-0000-000000000002', id,
  'I''ve been building websites with HTML/CSS for 2 years and just started learning React.',
  'pending'
FROM opportunities WHERE title = 'Frontend Developer Intern'
  AND company_id = '20000000-0000-0000-0000-000000000001';

INSERT INTO interests (student_id, opportunity_id, note, status)
SELECT '10000000-0000-0000-0000-000000000002', id,
  'I love testing apps and finding edge cases. I already have TestFlight on my phone!',
  'reviewed'
FROM opportunities WHERE title = 'Mobile App QA Tester'
  AND company_id = '20000000-0000-0000-0000-000000000001';

INSERT INTO interests (student_id, opportunity_id, note, status)
SELECT '10000000-0000-0000-0000-000000000002', id,
  'AI prompt engineering sounds fascinating — I''ve already been experimenting with ChatGPT for school projects.',
  'pending'
FROM opportunities WHERE title = 'AI Prompt Engineering Intern'
  AND company_id = '20000000-0000-0000-0000-000000000001';

-- Aisha applies for admin/events roles
INSERT INTO interests (student_id, opportunity_id, note, status)
SELECT '10000000-0000-0000-0000-000000000003', id,
  'I organized my school''s prom and a 300-person charity gala. Events are my thing!',
  'accepted'
FROM opportunities WHERE title = 'Events & Partnerships Intern'
  AND company_id = '20000000-0000-0000-0000-000000000001';

INSERT INTO interests (student_id, opportunity_id, note, status)
SELECT '10000000-0000-0000-0000-000000000003', id,
  'I''m interested in HR and this seems like the perfect way to explore the field.',
  'pending'
FROM opportunities WHERE title = 'People Operations Intern'
  AND company_id = '20000000-0000-0000-0000-000000000001';

INSERT INTO interests (student_id, opportunity_id, note, status)
SELECT '10000000-0000-0000-0000-000000000003', id,
  'I love talking to people and solving their problems. Customer success sounds like my dream job!',
  'reviewed'
FROM opportunities WHERE title = 'Customer Success Intern'
  AND company_id = '20000000-0000-0000-0000-000000000001';

-- Lucas applies for finance/data roles
INSERT INTO interests (student_id, opportunity_id, note, status)
SELECT '10000000-0000-0000-0000-000000000004', id,
  'I tutor AP Statistics and love working with numbers. QuickBooks would be a great skill to learn.',
  'pending'
FROM opportunities WHERE title = 'Finance & Bookkeeping Intern'
  AND company_id = '20000000-0000-0000-0000-000000000001';

INSERT INTO interests (student_id, opportunity_id, note, status)
SELECT '10000000-0000-0000-0000-000000000004', id,
  'Data entry is something I''m fast at — I type 80+ WPM and am very meticulous.',
  'accepted'
FROM opportunities WHERE title = 'Data Entry & Quality Assurance Intern'
  AND company_id = '20000000-0000-0000-0000-000000000001';

INSERT INTO interests (student_id, opportunity_id, note, status)
SELECT '10000000-0000-0000-0000-000000000004', id,
  'I want to understand how products are built. UX research seems like a great way in.',
  'pending'
FROM opportunities WHERE title = 'UX Research Intern'
  AND company_id = '20000000-0000-0000-0000-000000000001';

-- Sophia applies broadly
INSERT INTO interests (student_id, opportunity_id, note, status)
SELECT '10000000-0000-0000-0000-000000000005', id,
  'I''ve been managing our school''s online community on Discord — would love to do it professionally.',
  'pending'
FROM opportunities WHERE title = 'Community Manager Intern'
  AND company_id = '20000000-0000-0000-0000-000000000001';

INSERT INTO interests (student_id, opportunity_id, note, status)
SELECT '10000000-0000-0000-0000-000000000005', id,
  'SEO fascinates me — I helped my mom''s small business rank on Google and saw real results.',
  'reviewed'
FROM opportunities WHERE title = 'SEO & Analytics Intern'
  AND company_id = '20000000-0000-0000-0000-000000000001';

INSERT INTO interests (student_id, opportunity_id, note, status)
SELECT '10000000-0000-0000-0000-000000000005', id,
  'I love writing emails that people actually read. Would love to learn A/B testing!',
  'pending'
FROM opportunities WHERE title = 'Email Marketing Intern'
  AND company_id = '20000000-0000-0000-0000-000000000001';

INSERT INTO interests (student_id, opportunity_id, note, status)
SELECT '10000000-0000-0000-0000-000000000005', id,
  'I help my family with all their tech issues — this internship is right up my alley!',
  'pending'
FROM opportunities WHERE title = 'IT Help Desk & Support Intern'
  AND company_id = '20000000-0000-0000-0000-000000000001';

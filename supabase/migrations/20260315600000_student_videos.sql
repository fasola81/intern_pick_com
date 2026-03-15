-- ==========================================
-- Student Videos table for video applications
-- ==========================================

CREATE TABLE student_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'My Introduction',
  storage_path TEXT NOT NULL,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by student
CREATE INDEX idx_student_videos_student_id ON student_videos(student_id);

-- RLS: permissive for dev
ALTER TABLE student_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all inserts on student_videos" ON student_videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all selects on student_videos" ON student_videos FOR SELECT USING (true);

-- Add video_id to interests table for attaching videos to applications
ALTER TABLE interests ADD COLUMN IF NOT EXISTS video_id UUID;

-- Create storage bucket for student videos
INSERT INTO storage.buckets (id, name, public) VALUES ('student-videos', 'student-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public uploads to the bucket
CREATE POLICY "Allow public uploads to student-videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'student-videos');
CREATE POLICY "Allow public reads from student-videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'student-videos');

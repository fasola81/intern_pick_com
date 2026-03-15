-- Add logo_url and status columns to companies table
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Create storage policies for company-logos bucket
CREATE POLICY "Allow authenticated uploads" ON storage.objects 
  FOR INSERT TO authenticated 
  WITH CHECK (bucket_id = 'company-logos');

CREATE POLICY "Allow public reads on company logos" ON storage.objects 
  FOR SELECT TO public
  USING (bucket_id = 'company-logos');

CREATE POLICY "Allow users to update their own logos" ON storage.objects 
  FOR UPDATE TO authenticated 
  USING (bucket_id = 'company-logos')
  WITH CHECK (bucket_id = 'company-logos');

-- Run this in Supabase SQL Editor to fix storage RLS policies

-- Allow public uploads to car-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('car-images', 'car-images', true, 5242880, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/*'];

-- Create storage policy to allow uploads
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'car-images');

-- Create storage policy to allow public reads
CREATE POLICY "Allow public reads" ON storage.objects
FOR SELECT USING (bucket_id = 'car-images');
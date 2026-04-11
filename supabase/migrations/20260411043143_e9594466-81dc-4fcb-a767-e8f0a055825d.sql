
-- Create storage bucket for match recordings
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('match-recordings', 'match-recordings', false, 107374182400);

-- Allow academy members to upload recordings
CREATE POLICY "Authenticated users can upload match recordings"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'match-recordings');

-- Allow authenticated users to view recordings
CREATE POLICY "Authenticated users can view match recordings"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'match-recordings');

-- Allow users to delete their own recordings
CREATE POLICY "Users can delete own recordings"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'match-recordings');

-- Add recording_url column to match_reports table
ALTER TABLE public.match_reports ADD COLUMN IF NOT EXISTS recording_url text;

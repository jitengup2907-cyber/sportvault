
-- Add plan columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS subscription_start timestamptz,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id text;

-- Create user_usage table
CREATE TABLE public.user_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  month text NOT NULL,
  player_reports_count integer NOT NULL DEFAULT 0,
  match_reports_count integer NOT NULL DEFAULT 0,
  contracts_count integer NOT NULL DEFAULT 0,
  ai_messages_count integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, month)
);

ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage"
  ON public.user_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage"
  ON public.user_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage"
  ON public.user_usage FOR UPDATE
  USING (auth.uid() = user_id);

-- Academy logos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('academy-logos', 'academy-logos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view academy logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'academy-logos');

CREATE POLICY "Authenticated users can upload academy logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'academy-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own academy logos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'academy-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own academy logos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'academy-logos' AND auth.role() = 'authenticated');

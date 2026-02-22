-- Interactive needs: acceptances, creator display name, people needed, status
-- Run once in Supabase SQL Editor (Dashboard → SQL Editor → New query → paste → Run).
-- Requires: hunger_feed table already exists (see SUPABASE_INSTRUCTIONS.md).

-- Add columns to hunger_feed
ALTER TABLE hunger_feed
  ADD COLUMN IF NOT EXISTS people_needed INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS creator_display_name TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open' CHECK (status IN ('open', 'filled', 'cancelled'));

-- Allow creators to update their own needs (e.g. mark as filled)
CREATE POLICY "Users can update own needs"
  ON hunger_feed FOR UPDATE
  USING (auth.uid() = user_id);

-- need_acceptances: who accepted which need
CREATE TABLE IF NOT EXISTS need_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id UUID NOT NULL REFERENCES hunger_feed(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(need_id, user_id)
);

ALTER TABLE need_acceptances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view acceptances"
  ON need_acceptances FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own acceptance"
  ON need_acceptances FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own acceptance"
  ON need_acceptances FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

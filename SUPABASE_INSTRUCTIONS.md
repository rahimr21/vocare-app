# Supabase Setup Instructions

This document describes the database schema to create in Supabase when moving beyond the AsyncStorage MVP.

## Prerequisites

1. Create a Supabase project at https://supabase.com
2. Copy your project URL and anon key to `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## Tables

### `profiles`

Stores user profile data (gladness drivers, onboarding state).

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  gladness_drivers TEXT[] DEFAULT '{}',
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### `missions`

Stores generated missions, their status, and reflection responses.

```sql
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  estimated_minutes INTEGER DEFAULT 15,
  mood TEXT NOT NULL CHECK (mood IN ('anxious', 'bored', 'energized', 'content')),
  gladness_drivers TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'skipped')),
  felt_alive BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- RLS policies
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own missions"
  ON missions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own missions"
  ON missions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own missions"
  ON missions FOR UPDATE
  USING (auth.uid() = user_id);
```

### `hunger_feed`

Community-submitted campus needs that feed into AI mission generation.

```sql
CREATE TABLE hunger_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  location TEXT,
  category TEXT NOT NULL CHECK (category IN ('service', 'organization', 'support')),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE hunger_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active needs"
  ON hunger_feed FOR SELECT
  USING (active = true);

CREATE POLICY "Users can submit needs"
  ON hunger_feed FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### `journal_entries`

Optional journaling data linked to missions.

```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,
  time_of_day TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own entries"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries"
  ON journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Production Notes

- **OpenAI proxy:** Move the OpenAI API call to a Supabase Edge Function to avoid exposing the API key in the client bundle.
- **Trigger:** Create a trigger on `auth.users` insert to auto-create a `profiles` row.
- **Indexes:** Add indexes on `missions.user_id` and `hunger_feed.active` for query performance.
- **Realtime:** Enable Supabase Realtime on `hunger_feed` for live need updates.

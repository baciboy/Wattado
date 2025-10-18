-- Create favourites table
CREATE TABLE IF NOT EXISTS favourites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  event_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_favourites_user_id ON favourites(user_id);
CREATE INDEX IF NOT EXISTS idx_favourites_created_at ON favourites(created_at DESC);

-- Enable Row Level Security
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only read their own favourites
CREATE POLICY "Users can view their own favourites"
  ON favourites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own favourites
CREATE POLICY "Users can insert their own favourites"
  ON favourites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own favourites
CREATE POLICY "Users can delete their own favourites"
  ON favourites FOR DELETE
  USING (auth.uid() = user_id);

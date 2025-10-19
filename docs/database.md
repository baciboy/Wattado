# Database Documentation

## Overview

Wattado uses **Supabase** as its backend database and authentication provider. Supabase is built on PostgreSQL and provides:
- PostgreSQL database
- Built-in authentication
- Row Level Security (RLS)
- RESTful API
- Real-time subscriptions

## Connection Details

**Supabase Project URL**: `https://mfwgeqcedsmmfawcosge.supabase.co`

### Environment Variables

```env
VITE_SUPABASE_URL=https://mfwgeqcedsmmfawcosge.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

These are **public keys** that are safe to expose in the browser. They are used by the Supabase client to connect to your project.

## Database Schema

### Built-in Tables (Managed by Supabase)

#### `auth.users`
This table is automatically created and managed by Supabase Auth. **Do not modify this table directly.**

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Unique user identifier (primary key) |
| `email` | text | User's email address |
| `encrypted_password` | text | Hashed password |
| `email_confirmed_at` | timestamp | When email was verified |
| `created_at` | timestamp | Account creation timestamp |
| `updated_at` | timestamp | Last update timestamp |
| ... | ... | Additional auth metadata |

**Features**:
- Email/password authentication
- Email verification
- Password reset
- Session management

### Custom Tables (Created by You)

#### `public.favourites`

Stores user's favourite events.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `user_id` | uuid | NOT NULL, REFERENCES auth.users(id) ON DELETE CASCADE | User who favourited the event |
| `event_id` | text | NOT NULL | Ticketmaster event ID |
| `event_data` | jsonb | NOT NULL | Full event object (title, date, venue, etc.) |
| `created_at` | timestamp with time zone | DEFAULT NOW() | When event was favourited |

**Constraints**:
- `UNIQUE(user_id, event_id)` - Prevents duplicate favourites

**Indexes**:
- `idx_favourites_user_id` on `user_id` - Fast lookup of user's favourites
- `idx_favourites_event_id` on `event_id` - Fast lookup of who favourited an event

## Row Level Security (RLS)

RLS ensures users can only access their own data.

### `favourites` Table Policies

#### 1. **SELECT Policy**: "Users can view their own favourites"
```sql
CREATE POLICY "Users can view their own favourites"
  ON favourites
  FOR SELECT
  USING (auth.uid() = user_id);
```
- Users can only SELECT rows where `user_id` matches their authenticated user ID

#### 2. **INSERT Policy**: "Users can insert their own favourites"
```sql
CREATE POLICY "Users can insert their own favourites"
  ON favourites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```
- Users can only INSERT rows with their own `user_id`

#### 3. **DELETE Policy**: "Users can delete their own favourites"
```sql
CREATE POLICY "Users can delete their own favourites"
  ON favourites
  FOR DELETE
  USING (auth.uid() = user_id);
```
- Users can only DELETE their own favourites

**Result**: Users cannot access or modify other users' favourites, even with direct API calls.

## SQL Scripts

### Create `favourites` Table

```sql
-- Create favourites table
CREATE TABLE favourites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id TEXT NOT NULL,
  event_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Prevent duplicate favourites
  UNIQUE(user_id, event_id)
);

-- Enable Row Level Security
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own favourites
CREATE POLICY "Users can view their own favourites"
  ON favourites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own favourites
CREATE POLICY "Users can insert their own favourites"
  ON favourites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own favourites
CREATE POLICY "Users can delete their own favourites"
  ON favourites
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX idx_favourites_user_id ON favourites(user_id);
CREATE INDEX idx_favourites_event_id ON favourites(event_id);
```

### Query Examples

#### Get all favourites for a user
```sql
SELECT * FROM favourites
WHERE user_id = 'user-uuid-here'
ORDER BY created_at DESC;
```

#### Check if event is favourited
```sql
SELECT EXISTS(
  SELECT 1 FROM favourites
  WHERE user_id = 'user-uuid-here'
  AND event_id = 'event-id-here'
);
```

#### Count favourites per user
```sql
SELECT user_id, COUNT(*) as favourite_count
FROM favourites
GROUP BY user_id;
```

#### Most favourited events
```sql
SELECT event_id, event_data->>'title' as title, COUNT(*) as favourite_count
FROM favourites
GROUP BY event_id, event_data->>'title'
ORDER BY favourite_count DESC
LIMIT 10;
```

## Database Access

### Via Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project (`mfwgeqcedsmmfawcosge`)
3. Click **"Table Editor"** to view/edit tables
4. Click **"SQL Editor"** to run SQL queries
5. Click **"Authentication"** to manage users

### Via Supabase Client (Application Code)

Located in `src/services/supabaseClient.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

All database operations use this client and respect RLS policies.

## Backup and Migrations

### Backup
Supabase automatically backs up your database daily. Access backups via:
1. Supabase Dashboard → Project Settings → Backups

### Migrations
For future schema changes, create migration files:
1. Supabase Dashboard → SQL Editor
2. Write migration SQL
3. Save as a named migration
4. Migrations are tracked in `supabase/migrations/` (if using Supabase CLI)

## Future Tables (Planned)

Based on the PRD, you may need these tables in the future:

### `user_profiles`
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `event_lists`
```sql
CREATE TABLE event_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `event_list_items`
```sql
CREATE TABLE event_list_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID REFERENCES event_lists(id) ON DELETE CASCADE NOT NULL,
  event_id TEXT NOT NULL,
  event_data JSONB NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `social_connections`
```sql
CREATE TABLE social_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);
```

## Performance Considerations

1. **Indexes**: Already created on `user_id` and `event_id` for fast lookups
2. **JSONB**: Using JSONB for `event_data` allows flexible storage and querying
3. **Cascade Deletes**: `ON DELETE CASCADE` ensures favourites are removed when user is deleted
4. **Unique Constraints**: Prevent duplicate favourites at the database level

## Troubleshooting

### Issue: Can't insert into favourites
**Solution**: Check that:
1. User is authenticated (`auth.uid()` is not null)
2. RLS policies are enabled
3. User is trying to insert with their own `user_id`

### Issue: Can't see favourites in application
**Solution**: Check that:
1. User is logged in
2. Supabase environment variables are set correctly
3. RLS policies allow SELECT for the user
4. Browser console for errors

### Issue: Duplicate favourites error
**Solution**: This is expected behavior. The UNIQUE constraint prevents duplicates. Handle error code `23505` in application code.

## Monitoring

### Via Supabase Dashboard
- **Database**: View table sizes, connection counts
- **API Logs**: View all API requests and responses
- **Auth Logs**: View login attempts and errors
- **Usage**: Monitor database size, bandwidth, and API calls

### Query Performance
Use the SQL Editor to run `EXPLAIN ANALYZE` on slow queries:

```sql
EXPLAIN ANALYZE
SELECT * FROM favourites WHERE user_id = 'uuid-here';
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

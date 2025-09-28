# EventFinder - Product Requirements Document

## Executive Summary
EventFinder is an event discovery platform that aggregates events from multiple sources (Ticketmaster, Eventbrite, etc.) with AI-powered personalization and social features. Users can browse events without authentication, create accounts when they want to save favorites, and get personalized recommendations through AI chatbot integration.

## Current State
- ✅ Ticketmaster API integration
- ✅ Event browsing and filtering
- ✅ Responsive UI with Tailwind CSS
- ✅ Event detail modals
- ✅ Platform-specific styling

## Phase 1: Core User Management & Favorites

### 1. Authentication System

#### User Stories
- **US1.1**: As a visitor, I can browse events without creating an account
- **US1.2**: As a visitor, when I try to favorite an event, I'm prompted to create an account
- **US1.3**: As a user, I can sign up with email/password, phone number, or Facebook
- **US1.4**: As a user, I can log in with my chosen authentication method
- **US1.5**: As a user, I can reset my password via email

#### Technical Requirements
```typescript
// Authentication Types
interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  username: string;
  location: string;
  preferences: string[];
  interests: string[];
  avatar?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

#### UI Components Needed
1. **Login Modal** (`src/components/auth/LoginModal.tsx`)
   - Email/password form
   - Phone number input with country code
   - Facebook login button
   - "Sign up instead" link

2. **Signup Modal** (`src/components/auth/SignupModal.tsx`)
   - Personal info form (name, username, location)
   - Interest selection checkboxes
   - Preference selection (music genres, event types, etc.)

3. **Auth Prompt Modal** (`src/components/auth/AuthPromptModal.tsx`)
   - Triggered when non-authenticated user tries to favorite
   - Quick signup/login options

#### Supabase Schema
```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  location TEXT,
  preferences JSONB DEFAULT '[]',
  interests JSONB DEFAULT '[]',
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Auth providers
CREATE TABLE user_auth_providers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'email', 'phone', 'facebook'
  provider_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Favorites System

#### User Stories
- **US2.1**: As a user, I can favorite events by clicking a heart icon on event cards
- **US2.2**: As a user, I can see my favorited events in a dedicated "My Favorites" section
- **US2.3**: As a user, I can create multiple custom lists for organizing events
- **US2.4**: As a user, I can add events to specific lists
- **US2.5**: As a user, I can remove events from favorites/lists

#### Technical Requirements
```typescript
interface FavoriteEvent {
  id: string;
  userId: string;
  eventId: string;
  listId?: string; // null for default favorites
  eventData: Event; // Cached event data
  createdAt: Date;
}

interface EventList {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### UI Components Needed
1. **Heart Button** (`src/components/events/HeartButton.tsx`)
   - Animated heart icon
   - Filled when favorited, outline when not
   - Click handler with auth check

2. **Favorites Page** (`src/pages/FavoritesPage.tsx`)
   - Grid view of favorited events
   - List management interface
   - Filter by lists

3. **List Management** (`src/components/favorites/ListManager.tsx`)
   - Create new list modal
   - Add to list dropdown
   - List settings

#### Supabase Schema
```sql
-- Event lists
CREATE TABLE event_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorite events
CREATE TABLE favorite_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL, -- External event ID
  list_id UUID REFERENCES event_lists(id) ON DELETE SET NULL,
  event_data JSONB NOT NULL, -- Cached event information
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_favorite_events_user_id ON favorite_events(user_id);
CREATE INDEX idx_favorite_events_event_id ON favorite_events(event_id);
```

### 3. Header & Navigation Updates

#### User Stories
- **US3.1**: As a user, I can see my profile picture/avatar in the header
- **US3.2**: As a user, I can access "My Account" from a dropdown menu
- **US3.3**: As a user, I can quickly access "My Favorites" from the header
- **US3.4**: As a user, I can see login/signup buttons when not authenticated

#### UI Components Needed
1. **User Menu** (`src/components/header/UserMenu.tsx`)
   - Profile dropdown with avatar
   - Links to account, favorites, lists
   - Logout option

2. **Updated Header** (modify `src/components/Header.tsx`)
   - Authentication-aware content
   - Quick access to key features

### 4. Event Deduplication

#### User Stories
- **US4.1**: As a user, I see one card per unique event, regardless of multiple showtimes
- **US4.2**: As a user, I can see the date range for events with multiple dates
- **US4.3**: As a user, I can select specific dates when favoriting multi-date events

#### Technical Requirements
```typescript
interface EventGroup {
  id: string; // Generated group ID
  title: string;
  baseEvent: Event;
  dates: EventDate[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
}

interface EventDate {
  date: string;
  time: string;
  eventId: string; // Original event ID
  venue?: string; // If different venues
  price?: { min: number; max: number; currency: string };
}
```

#### Processing Logic
```typescript
// Event grouping service
class EventGroupingService {
  groupEvents(events: Event[]): EventGroup[] {
    // Group by title + venue similarity
    // Handle date ranges and price aggregation
  }
}
```

## Phase 2: Social Features

### 5. Social Sharing

#### User Stories
- **US5.1**: As a user, I can share events via social media (Facebook, Twitter, Instagram)
- **US5.2**: As a user, I can share events via WhatsApp
- **US5.3**: As a user, I can copy event links to share manually

#### UI Components Needed
1. **Share Button** (`src/components/events/ShareButton.tsx`)
   - Share modal with platform options
   - WhatsApp deep linking
   - Copy link functionality

### 6. Friends & Social Features

#### User Stories
- **US6.1**: As a user, I can add friends by username or email
- **US6.2**: As a user, I can see what events my friends are interested in
- **US6.3**: As a user, I can create groups for event planning
- **US6.4**: As a user, I can invite friends to events

#### Supabase Schema
```sql
-- Friends relationships
CREATE TABLE friendships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Event groups
CREATE TABLE event_groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group members
CREATE TABLE group_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES event_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'invited', -- 'invited', 'joined', 'declined'
  joined_at TIMESTAMP WITH TIME ZONE
);
```

## Phase 3: AI Integration

### 7. AI Chatbot & Recommendations

#### User Stories
- **US7.1**: As a user, I can chat with an AI assistant to find events
- **US7.2**: As a user, I can use natural language to search ("Find me concerts this weekend under $50")
- **US7.3**: As a user, I get personalized event recommendations based on my preferences
- **US7.4**: As a user, I see an AI recommendations section on the homepage

#### UI Components Needed
1. **AI Chat Widget** (`src/components/ai/ChatWidget.tsx`)
   - Floating chat button
   - Chat interface with message history
   - Quick action suggestions

2. **Recommendations Section** (`src/components/ai/RecommendationsSection.tsx`)
   - Personalized event suggestions
   - "Why we recommend this" explanations

3. **Natural Language Search** (enhance existing search)
   - AI-powered query parsing
   - Smart filters based on intent

#### AI Integration
```typescript
interface AIRecommendation {
  event: Event;
  score: number;
  reason: string;
  tags: string[];
}

interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  intent: string;
  extractedFilters?: FilterState;
  createdAt: Date;
}
```

## Phase 4: Analytics & Tracking

### 8. User Behavior Analytics

#### Events to Track
```typescript
interface AnalyticsEvent {
  eventType: 'page_view' | 'event_view' | 'event_favorite' | 'event_share' | 'search' | 'filter_applied';
  userId?: string;
  sessionId: string;
  metadata: Record<string, any>;
  timestamp: Date;
}
```

#### Supabase Schema
```sql
-- Analytics events
CREATE TABLE analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
```

## Implementation Priority

### Sprint 1 (Week 1-2): Core Authentication
- [ ] Authentication modals and flows
- [ ] User registration with preferences
- [ ] Basic user menu in header
- [ ] Supabase auth setup

### Sprint 2 (Week 3-4): Favorites System
- [ ] Heart buttons on event cards
- [ ] Favorites page
- [ ] Basic list management
- [ ] Auth prompts for favorites

### Sprint 3 (Week 5-6): Event Deduplication & UX
- [ ] Event grouping logic
- [ ] Enhanced event cards with date ranges
- [ ] Multi-date selection for favorites
- [ ] Improved filtering

### Sprint 4 (Week 7-8): Social Sharing
- [ ] Share buttons and modals
- [ ] WhatsApp integration
- [ ] Social media sharing
- [ ] Copy link functionality

### Sprint 5 (Week 9-10): Friends & Groups
- [ ] Friend system implementation
- [ ] Group creation and management
- [ ] Event invitations

### Sprint 6 (Week 11-12): AI Integration
- [ ] Basic chatbot interface
- [ ] Recommendation engine
- [ ] Natural language search

## Technical Implementation Notes

### Environment Variables Needed
```bash
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Social Auth
VITE_FACEBOOK_APP_ID=your_facebook_app_id

# AI Integration (future)
VITE_OPENAI_API_KEY=your_openai_key
```

### Key Dependencies to Add
```json
{
  "@supabase/supabase-js": "^2.57.4",
  "react-hook-form": "^7.48.2",
  "zod": "^3.22.4",
  "react-query": "^3.39.3",
  "react-share": "^4.4.1",
  "date-fns": "^2.30.0"
}
```

### File Structure Updates
```
src/
├── components/
│   ├── auth/
│   │   ├── LoginModal.tsx
│   │   ├── SignupModal.tsx
│   │   └── AuthPromptModal.tsx
│   ├── events/
│   │   ├── HeartButton.tsx
│   │   └── ShareButton.tsx
│   ├── favorites/
│   │   ├── FavoritesList.tsx
│   │   └── ListManager.tsx
│   ├── header/
│   │   └── UserMenu.tsx
│   └── ai/
│       ├── ChatWidget.tsx
│       └── RecommendationsSection.tsx
├── pages/
│   ├── FavoritesPage.tsx
│   └── ProfilePage.tsx
├── services/
│   ├── supabaseService.ts
│   ├── authService.ts
│   ├── favoritesService.ts
│   └── analyticsService.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useFavorites.ts
│   └── useAnalytics.ts
└── types/
    ├── Auth.ts
    ├── Favorites.ts
    └── Analytics.ts
```

## Acceptance Criteria

### Authentication
- [ ] Users can browse without authentication
- [ ] Favorite prompt triggers auth flow
- [ ] All auth methods work (email, phone, Facebook)
- [ ] User preferences saved during signup
- [ ] Persistent login sessions

### Favorites
- [ ] Heart animation works smoothly
- [ ] Favorites persist across sessions
- [ ] Multiple lists can be created and managed
- [ ] Events can be added/removed from lists

### Event Deduplication
- [ ] Multi-date events show as single card
- [ ] Date ranges display correctly
- [ ] Price ranges aggregate properly
- [ ] Specific dates can be selected for favorites

### Social Features
- [ ] Share buttons work for all platforms
- [ ] WhatsApp sharing includes event details
- [ ] Friend requests can be sent and accepted
- [ ] Groups can be created and managed

This PRD provides a comprehensive roadmap for building out EventFinder. Each section includes specific technical requirements, UI components, and database schemas that you can implement incrementally using VSCode Copilot.
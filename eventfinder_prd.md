# EventFinder - Product Requirements Document

## Executive Summary
EventFinder is an event discovery platform that aggregates events from multiple sources (Ticketmaster, Eventbrite, etc.) with AI-powered personalization and social features. Users can browse events without authentication, create accounts when they want to save favorites, and get personalized recommendations through AI chatbot integration.

## Current State (Updated: 2025-10-28)
- ✅ Ticketmaster API integration
- ✅ Event browsing and filtering
- ✅ Responsive UI with Tailwind CSS
- ✅ Event detail modals
- ✅ Platform-specific styling
- ✅ Email/password authentication with Supabase
- ✅ Favorites system with Supabase backend
- ✅ **AI-powered natural language search with AWS Bedrock + Claude 3.5 Sonnet**
- ✅ Mock events dataset (30 diverse events for testing)

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

#### Implementation Status
- ✅ **US7.2 IMPLEMENTED**: Natural language search with AWS Bedrock + Claude 3.5 Sonnet
  - Parses queries like "romantic date night under $50"
  - Extracts category, location, dateRange, priceRange, keywords, and mood
  - Time reference parsing ("this weekend", "tonight", "next week")
  - Mood-based event ranking (romantic, stylish, fun, cultural, energetic, relaxing, family, elegant)
  - User-friendly query explanations
  - Graceful fallback to regular search

#### Remaining User Stories
- **US7.1**: As a user, I can chat with an AI assistant to find events (chatbot widget UI)
- **US7.3**: As a user, I get personalized event recommendations based on my preferences
- **US7.4**: As a user, I see an AI recommendations section on the homepage

#### UI Components Status
1. **AI Chat Widget** (`src/components/ai/ChatWidget.tsx`) - ❌ NOT IMPLEMENTED
   - Floating chat button
   - Chat interface with message history
   - Quick action suggestions

2. **Recommendations Section** (`src/components/ai/RecommendationsSection.tsx`) - ❌ NOT IMPLEMENTED
   - Personalized event suggestions
   - "Why we recommend this" explanations

3. **Natural Language Search** - ✅ **IMPLEMENTED** (in `src/components/Header.tsx`)
   - ✅ AI-powered query parsing via `src/services/aiService.ts`
   - ✅ Backend API at `api/ai/search.ts` using AWS Bedrock
   - ✅ Smart filters based on intent
   - ✅ Auto-detects natural language queries (3+ words)
   - ✅ Shows "AI thinking..." spinner
   - ✅ Displays query explanation to user

#### AI Integration

**Implemented** (`src/services/aiService.ts` & `api/ai/search.ts`):
```typescript
interface AISearchParams {
  category?: string;
  location?: string;
  dateRange?: { start: string; end: string };
  priceRange?: { min: number; max: number };
  keywords?: string[];
  mood?: string;
}

interface AISearchResult {
  success: boolean;
  searchParams: AISearchParams;
  explanation: string;
}
```

**To Be Implemented**:
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

**Technology Stack**:
- AWS Bedrock with Claude 3.5 Sonnet (primary model)
- Claude 3.5 Haiku (fallback for faster/cheaper queries)
- Vercel AI SDK (`@ai-sdk/amazon-bedrock`, `ai`)
- Deployed via Vercel Serverless Functions

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

### Sprint 1 (Week 1-2): Core Authentication - ✅ COMPLETE
- [x] Authentication modals and flows
- [x] User registration with preferences
- [x] Basic user menu in header
- [x] Supabase auth setup

### Sprint 2 (Week 3-4): Favorites System - ✅ COMPLETE
- [x] Heart buttons on event cards
- [x] Favorites page
- [x] Supabase favorites table integration
- [ ] Custom list management (in progress)

### Sprint 3 (Week 5-6): Event Deduplication & UX - ✅ COMPLETE
- [x] Event grouping logic
- [x] Enhanced event cards with date ranges
- [x] Improved filtering
- [x] Mock events dataset (30 events)

### Sprint 4 (Week 7-8): Social Sharing - ❌ NOT STARTED
- [ ] Share buttons and modals
- [ ] WhatsApp integration
- [ ] Social media sharing
- [ ] Copy link functionality

### Sprint 5 (Week 9-10): Friends & Groups - ❌ NOT STARTED
- [ ] Friend system implementation
- [ ] Group creation and management
- [ ] Event invitations

### Sprint 6 (Week 11-12): AI Integration - 🟡 PARTIALLY COMPLETE
- [x] **Natural language search** (AWS Bedrock + Claude 3.5 Sonnet)
- [x] AI query parsing with mood, time, price extraction
- [x] Event ranking based on AI parameters
- [ ] Chatbot widget UI
- [ ] Recommendation engine
- [ ] Personalized suggestions section

## Technical Implementation Notes

### Environment Variables Needed
```bash
# Ticketmaster API
VITE_TICKETMASTER_API_KEY=your_ticketmaster_api_key

# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Social Auth (not yet implemented)
VITE_FACEBOOK_APP_ID=your_facebook_app_id

# AI Integration - AWS Bedrock (IMPLEMENTED - server-side only, no VITE_ prefix)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
BEDROCK_FAST_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
```

### Key Dependencies
**Already Installed**:
```json
{
  "@supabase/supabase-js": "^2.57.4",
  "@ai-sdk/amazon-bedrock": "^1.0.8",
  "ai": "^4.0.0",
  "react-router-dom": "^7.0.2",
  "lucide-react": "^0.468.0"
}
```

**To Add for Future Features**:
```json
{
  "react-hook-form": "^7.48.2",
  "zod": "^3.22.4",
  "react-query": "^3.39.3",
  "react-share": "^4.4.1",
  "date-fns": "^2.30.0"
}
```

### File Structure (Current + Planned)

**Current Implementation**:
```
src/
├── components/
│   ├── header/
│   │   └── UserMenu.tsx ✅
│   ├── EventCard.tsx ✅
│   ├── EventModal.tsx ✅
│   ├── FilterSidebar.tsx ✅
│   └── Header.tsx ✅ (with AI search integration)
├── pages/
│   ├── HomePage.tsx ✅
│   ├── LoginPage.tsx ✅
│   ├── SignupPage.tsx ✅
│   ├── FavouritesPage.tsx ✅
│   └── UserAccountPage.tsx ✅
├── services/
│   ├── supabaseClient.ts ✅
│   ├── ticketmasterService.ts ✅
│   └── aiService.ts ✅ (AI query parsing & event ranking)
├── hooks/
│   ├── useAuth.ts ✅
│   └── useEventFilters.ts ✅
├── types/
│   └── Event.ts ✅
└── data/
    └── mockEvents.ts ✅ (30 diverse test events)
api/
└── ai/
    └── search.ts ✅ (AWS Bedrock serverless function)
```

**To Be Added**:
```
src/
├── components/
│   ├── auth/
│   │   └── AuthPromptModal.tsx ❌
│   ├── events/
│   │   └── ShareButton.tsx ❌
│   ├── favorites/
│   │   └── ListManager.tsx ❌
│   └── ai/
│       ├── ChatWidget.tsx ❌
│       └── RecommendationsSection.tsx ❌
├── services/
│   ├── favoritesService.ts ❌ (for custom lists)
│   └── analyticsService.ts ❌
└── hooks/
    ├── useFavorites.ts ❌
    └── useAnalytics.ts ❌
```

## Acceptance Criteria

### Authentication
- [x] Users can browse without authentication
- [x] User account system with Supabase
- [x] Email/password authentication works
- [ ] Favorite prompt triggers auth flow
- [ ] Phone authentication (UI exists but not implemented)
- [ ] Facebook OAuth (button exists but not connected)
- [x] Persistent login sessions

### Favorites
- [x] Heart buttons on event cards
- [x] Favorites persist across sessions via Supabase
- [x] Favorites page displays saved events
- [ ] Multiple custom lists can be created and managed
- [x] Events can be added/removed from favorites

### AI Natural Language Search
- [x] Natural language queries are auto-detected (3+ words)
- [x] AI parses queries for category, location, date, price, mood
- [x] Time references work ("this weekend", "tonight", "next week")
- [x] Mood-based event ranking (romantic, stylish, fun, etc.)
- [x] User-friendly query explanations displayed
- [x] Graceful fallback to regular search if AI fails
- [x] AWS Bedrock integration with Claude 3.5 Sonnet
- [ ] Chatbot widget for conversational search
- [ ] Personalized recommendations based on user preferences

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
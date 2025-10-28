# Wattado - Event Discovery Platform

## Project Overview

Wattado is an event discovery platform that aggregates events from multiple sources (Ticketmaster, Eventbrite, etc.) with plans for AI-powered personalization and social features. Users can browse events without authentication, create accounts to save favorites, and get personalized recommendations.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Event Data**: Ticketmaster API
- **AI/ML**: AWS Bedrock with Claude 3.5 Sonnet (via Vercel AI SDK)

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── header/          # Header-specific components
│   │   └── UserMenu.tsx # User authentication menu
│   ├── EventCard.tsx    # Event card display
│   ├── EventModal.tsx   # Event details modal
│   ├── FilterSidebar.tsx # Event filtering sidebar
│   └── Header.tsx       # Main header component with AI search
├── pages/               # Page-level components
│   ├── HomePage.tsx     # Main event listing page
│   ├── LoginPage.tsx    # User login page
│   └── SignupPage.tsx   # User registration page
├── services/            # External service integrations
│   ├── supabaseClient.ts      # Supabase client setup
│   ├── ticketmasterService.ts # Ticketmaster API integration
│   └── aiService.ts           # AI query parsing and event ranking
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hook
│   └── useEventFilters.ts # Event filtering logic
├── types/               # TypeScript type definitions
│   └── Event.ts         # Event-related types
├── data/                # Mock/static data
│   └── mockEvents.ts    # Mock event data (30 diverse events)
├── App.tsx             # Main app component with routing
└── main.tsx            # App entry point
api/
└── ai/
    └── search.ts        # Serverless function for AI query parsing
```

## Environment Variables

Required environment variables (create a `.env` file):

```env
# Ticketmaster API
VITE_TICKETMASTER_API_KEY=your_ticketmaster_api_key

# Supabase (for authentication)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AWS Bedrock (for AI query parsing - server-side only, no VITE_ prefix)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
BEDROCK_FAST_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0

# Alternative Supabase variable names (fallbacks)
# VITE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL=...
# VITE_SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Key Features

### Current Implementation (Phase 1)
- ✅ Ticketmaster API integration with event fetching
- ✅ Event browsing and filtering (by city, date, category)
- ✅ Event deduplication and grouping (same event, multiple dates/times)
- ✅ Responsive UI with Tailwind CSS
- ✅ Event detail modals
- ✅ Platform-specific styling
- ✅ Email/password authentication with Supabase
- ✅ User menu with login/logout
- ✅ React Router navigation
- ✅ **AI-powered natural language search with AWS Bedrock + Claude 3.5 Sonnet**
- ✅ Favorites system with Supabase integration
- ✅ Mock events dataset (30 diverse events for testing)

### AI Query Features (Phase 4 - Partially Implemented)
- ✅ Natural language query parsing ("romantic date night under $50")
- ✅ Mood-based event ranking (romantic, stylish, fun, cultural, energetic, relaxing, family, elegant)
- ✅ Time reference parsing ("this weekend", "tonight", "next week")
- ✅ Price constraint extraction
- ✅ Category inference from context
- ✅ User-friendly query explanations
- ✅ Graceful fallback to regular search

### Planned Features (from PRD)
- Phase 2: Custom event lists and list management
- Phase 3: Social features (sharing, friends, groups)
- Phase 4: AI chatbot widget and advanced recommendations
- Phase 5: Analytics and user behavior tracking

## Important Code Patterns

### Event Grouping Logic
Events from Ticketmaster are grouped by name and venue to prevent duplicate cards:
- Location: `App.tsx:54-172`
- Groups events with same normalized name and venue
- Aggregates multiple dates, times, and price ranges
- Displays date ranges for multi-date events

### Authentication Flow
- `useAuth` hook manages authentication state
- Error handling with try-catch and error state
- React Router navigation (no `window.location` usage)
- Session persistence via Supabase

### AI Natural Language Query System
**Architecture**: User Input → Frontend Service → Backend API → AWS Bedrock (Claude) → Structured Response → Event Ranking

**Components**:
1. **Frontend Service** (`src/services/aiService.ts`)
   - `parseNaturalLanguageQuery(query)`: Sends query to backend API
   - `rankEventsByRelevance(events, aiParams)`: Scores events based on AI-detected keywords and mood
   - Interfaces: `AISearchParams`, `AISearchResult`

2. **Backend API** (`api/ai/search.ts`)
   - Serverless function using AWS Bedrock + Claude 3.5 Sonnet
   - Parses natural language into structured search parameters
   - Returns: category, location, dateRange, priceRange, keywords, mood, explanation

3. **UI Integration** (`src/components/Header.tsx`)
   - Auto-detects natural language queries (3+ words)
   - Shows "AI thinking..." spinner during processing
   - Displays user-friendly explanation of parsed query
   - Falls back to regular search if AI fails

**Mood Keywords Mapping**:
- **romantic**: intimate, candlelit, wine, romantic, date
- **stylish**: stylish, chic, fashion, elegant, sophisticated
- **fun**: fun, entertainment, exciting, lively
- **cultural**: cultural, heritage, traditional, art, museum
- **energetic**: energetic, high-energy, dynamic, intense
- **relaxing**: relaxing, peaceful, calm, mindfulness, wellness
- **family**: family, kids, children, family-friendly
- **elegant**: elegant, gala, formal, upscale, luxury

### Environment Variable Validation
- Development mode warnings for missing API keys
- Graceful degradation (app doesn't crash without keys)
- Locations: `supabaseClient.ts:17-26`, `ticketmasterService.ts:24-31`, `api/ai/search.ts`

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Code Quality Standards

### TypeScript
- Strict mode enabled
- No unused locals or parameters
- Proper type definitions for all props and state

### React Best Practices
- Use React Router's `useNavigate()` and `<Link>` for navigation
- Proper cleanup in `useEffect` hooks (isMounted flags, unsubscribe)
- Error boundaries and loading states
- No direct DOM manipulation

### Error Handling
- Try-catch blocks for async operations
- User-friendly error messages
- Console warnings for configuration issues
- Fallback UI for error states

## API Integration Notes

### Ticketmaster API
- Rate limits apply (check Ticketmaster docs)
- Proxy configured in Vite for `/api/discovery` routes
- Event deduplication handles multiple showtimes
- Filters: city, date range, classification (event type)

### Supabase
- Authentication with email/password
- Favorites system with `favorites` table
- Plans for user profiles and custom lists in future phases
- See `eventfinder_prd.md` for complete database schema plans

### AWS Bedrock (AI Service)
- Claude 3.5 Sonnet for natural language query parsing
- Claude 3.5 Haiku as fallback for faster/cheaper queries
- Deployed via Vercel Serverless Functions
- Rate limits and costs apply per AWS Bedrock pricing

## Known Limitations

1. **Phone authentication**: UI exists but not implemented yet
2. **Facebook OAuth**: Button present but not connected
3. **Custom event lists**: Favorites work but custom list management not implemented yet
4. **Past events**: Filtered out by default (startDateTime set to now)
5. **UK-focused**: Default country code is GB, cities list is UK cities
6. **AI chatbot widget**: Natural language search works, but interactive chatbot UI not yet implemented
7. **Mock events**: Using 30 test events until full API integrations are ready

## Future Development Priorities

According to the PRD (`eventfinder_prd.md`):
1. ✅ ~~Complete favorites system with Supabase backend~~ (DONE)
2. ✅ ~~Build natural language event search~~ (DONE)
3. Custom event lists management UI
4. AI chatbot widget with conversation history
5. AI-powered recommendations section
6. Social sharing features (WhatsApp, social media)
7. Friends and group planning features
8. Analytics tracking system

## Testing Considerations

- Test with and without environment variables
- Test event grouping with multi-date events
- Test authentication flows (signup, login, logout)
- Test responsive design (mobile, tablet, desktop)
- Test filter combinations
- Test with various Ticketmaster event types
- **Test AI natural language queries**:
  - Mood-based queries: "romantic date night", "stylish art shows"
  - Time-based queries: "this weekend", "tonight", "next week"
  - Price-based queries: "under $50", "free events"
  - Category inference: "concerts", "sports games", "family activities"
  - Combined queries: "fun outdoor events this weekend under $30"
- Test favorites functionality (add, remove, persistence)
- Test with mock events dataset (30 diverse events)

## Troubleshooting

**Events not loading?**
- Check `VITE_TICKETMASTER_API_KEY` is set correctly
- Check browser console for API errors
- Verify network requests in DevTools

**Authentication not working?**
- Check Supabase credentials are set
- Verify Supabase project is active
- Check console for Supabase errors

**Build failures?**
- Run `npm install` to ensure dependencies are up to date
- Check for TypeScript errors with `npm run typecheck`
- Check for linting issues with `npm run lint`

**AI search not working?**
- Check AWS Bedrock credentials are set correctly (without VITE_ prefix)
- Verify AWS IAM permissions for Bedrock access
- Check browser console for API errors from `/api/ai/search`
- Test with simple queries first ("concerts tonight")
- Falls back to regular search if AI fails

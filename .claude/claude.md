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

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── header/          # Header-specific components
│   │   └── UserMenu.tsx # User authentication menu
│   ├── EventCard.tsx    # Event card display
│   ├── EventModal.tsx   # Event details modal
│   ├── FilterSidebar.tsx # Event filtering sidebar
│   └── Header.tsx       # Main header component
├── pages/               # Page-level components
│   ├── HomePage.tsx     # Main event listing page
│   ├── LoginPage.tsx    # User login page
│   └── SignupPage.tsx   # User registration page
├── services/            # External service integrations
│   ├── supabaseClient.ts      # Supabase client setup
│   └── ticketmasterService.ts # Ticketmaster API integration
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hook
│   └── useEventFilters.ts # Event filtering logic
├── types/               # TypeScript type definitions
│   └── Event.ts         # Event-related types
├── data/                # Mock/static data
│   └── mockEvents.ts    # Mock event data
├── App.tsx             # Main app component with routing
└── main.tsx            # App entry point
```

## Environment Variables

Required environment variables (create a `.env` file):

```env
# Ticketmaster API
VITE_TICKETMASTER_API_KEY=your_ticketmaster_api_key

# Supabase (for authentication)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

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

### Planned Features (from PRD)
- Phase 2: Favorites system, custom event lists
- Phase 3: Social features (sharing, friends, groups)
- Phase 4: AI chatbot and recommendations
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

### Environment Variable Validation
- Development mode warnings for missing API keys
- Graceful degradation (app doesn't crash without keys)
- Locations: `supabaseClient.ts:17-26`, `ticketmasterService.ts:24-31`

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
- Authentication only (no database tables yet)
- Plans for user profiles, favorites, and lists in future phases
- See `eventfinder_prd.md` for database schema plans

## Known Limitations

1. **Phone authentication**: UI exists but not implemented yet
2. **Facebook OAuth**: Button present but not connected
3. **Event favorites**: UI exists but backend not implemented
4. **Past events**: Filtered out by default (startDateTime set to now)
5. **UK-focused**: Default country code is GB, cities list is UK cities

## Future Development Priorities

According to the PRD (`eventfinder_prd.md`):
1. Complete favorites system with Supabase backend
2. Add event deduplication improvements
3. Implement social sharing features
4. Build AI chatbot for natural language event search
5. Add analytics tracking

## Testing Considerations

- Test with and without environment variables
- Test event grouping with multi-date events
- Test authentication flows (signup, login, logout)
- Test responsive design (mobile, tablet, desktop)
- Test filter combinations
- Test with various Ticketmaster event types

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

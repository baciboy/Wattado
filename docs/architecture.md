# Architecture Documentation

## Overview

Wattado is a modern web application built with React and TypeScript, following a component-based architecture with clear separation of concerns.

## Technology Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript 5
- **Build Tool**: Vite 5
- **Router**: React Router v7
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect, useContext)

### Backend / Services
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Event Data**: Ticketmaster Discovery API
- **Hosting**: Vercel (Frontend)
- **Database Hosting**: Supabase Cloud

### Development Tools
- **Package Manager**: npm
- **Linter**: ESLint
- **Type Checker**: TypeScript Compiler (tsc)
- **Version Control**: Git

## Project Structure

```
Wattado/
├── public/                 # Static assets
│   └── vite.svg           # Favicon
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── header/        # Header-related components
│   │   │   └── UserMenu.tsx
│   │   ├── EventCard.tsx
│   │   ├── EventModal.tsx
│   │   ├── FeaturedCarousel.tsx
│   │   ├── FilterSidebar.tsx
│   │   └── Header.tsx
│   ├── pages/             # Page-level components (routes)
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   └── AccountPage.tsx
│   ├── services/          # External service integrations
│   │   ├── supabaseClient.ts
│   │   ├── ticketmasterService.ts
│   │   └── favouritesService.ts
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useEventFilters.ts
│   │   └── useFavourites.ts
│   ├── types/             # TypeScript type definitions
│   │   └── Event.ts
│   ├── data/              # Static/mock data
│   │   └── mockEvents.ts
│   ├── App.tsx            # Main app component with routing
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles (Tailwind imports)
├── docs/                  # Technical documentation
│   ├── database.md
│   ├── deployment.md
│   ├── api-integrations.md
│   └── architecture.md
├── .env                   # Environment variables (local)
├── .gitignore             # Git ignore patterns
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vercel.json            # Vercel deployment config
└── README.md              # Project overview

```

## Architecture Layers

### 1. Presentation Layer (Components)

**Purpose**: UI rendering and user interaction

**Components**:
- `EventCard.tsx` - Individual event display
- `EventModal.tsx` - Event details modal
- `FeaturedCarousel.tsx` - Hero carousel with featured events
- `FilterSidebar.tsx` - Event filtering controls
- `Header.tsx` - Main navigation and search
- `UserMenu.tsx` - User authentication menu

**Pattern**: Presentational components receive props and render UI

**Example**:
```typescript
interface EventCardProps {
  event: Event;
  onEventClick: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onEventClick }) => {
  // Render event card UI
};
```

### 2. Page Layer (Routes)

**Purpose**: Route-level components that compose smaller components

**Pages**:
- `HomePage.tsx` - Main event listing page
- `LoginPage.tsx` - User login
- `SignupPage.tsx` - User registration
- `AccountPage.tsx` - User profile and settings

**Pattern**: Pages fetch data, manage state, and compose components

**Example**:
```typescript
const HomePage: React.FC<HomePageProps> = ({
  filteredEvents,
  filters,
  onFiltersChange,
  handleEventClick
}) => {
  // Categorize events, render layout
  return (
    <div>
      <Header />
      <FeaturedCarousel events={filteredEvents} />
      {/* Category sections */}
    </div>
  );
};
```

### 3. Service Layer

**Purpose**: External API and service integrations

**Services**:
- `supabaseClient.ts` - Supabase client singleton
- `favouritesService.ts` - Favourites CRUD operations
- `ticketmasterService.ts` - Event data fetching (placeholder)

**Pattern**: Pure functions that return promises

**Example**:
```typescript
export async function addFavourite(event: Event) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  const { error } = await supabase
    .from('favourites')
    .insert({ user_id: user.id, event_id: event.id, event_data: event });

  return { success: !error, error: error?.message };
}
```

### 4. Hook Layer

**Purpose**: Reusable stateful logic

**Hooks**:
- `useAuth.ts` - Authentication state management
- `useFavourites.ts` - Favourites state and operations
- `useEventFilters.ts` - Filter state management (currently unused)

**Pattern**: Custom hooks encapsulate state and side effects

**Example**:
```typescript
export function useFavourites() {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) loadFavourites();
  }, [user]);

  const toggleFavourite = async (event: Event) => {
    // Optimistic update + API call
  };

  return { favourites, isLoading, toggleFavourite };
}
```

### 5. Type Layer

**Purpose**: TypeScript type definitions for type safety

**Types**:
- `Event` - Internal event representation
- `TicketmasterEvent` - Ticketmaster API response
- `FilterState` - Filter state shape
- `FavouriteRecord` - Database record type

**Pattern**: Interface definitions for all data structures

## Data Flow

### Event Data Flow

```
Ticketmaster API
    ↓
App.tsx (fetchEvents)
    ↓
Event Grouping & Transformation
    ↓
Client-side Filtering (filteredEvents)
    ↓
HomePage (categorization)
    ↓
EventCard / FeaturedCarousel (display)
    ↓
EventModal (details)
```

### Authentication Flow

```
User Action (Login/Signup)
    ↓
LoginPage / SignupPage
    ↓
supabase.auth.signInWithPassword()
    ↓
useAuth hook (onAuthStateChange)
    ↓
Update user state
    ↓
Navigate to HomePage
    ↓
UserMenu shows logged-in state
```

### Favourites Flow

```
User clicks Heart Icon
    ↓
EventCard.handleFavouriteClick()
    ↓
useFavourites.toggleFavourite()
    ↓
Optimistic UI Update
    ↓
favouritesService.addFavourite() / removeFavourite()
    ↓
Supabase API (with RLS)
    ↓
Success: Keep UI state | Error: Revert UI state
```

## State Management

### Global State
Currently using **React Context** (implicit via hooks):
- `useAuth` - User authentication state (shared across components)
- `useFavourites` - Favourites state (shared across components)

### Local State
Using `useState` for component-specific state:
- Filter state in `App.tsx`
- Modal open/close state
- Form input state
- Carousel index state

### Server State
Using async functions + `useEffect` for server data:
- Events from Ticketmaster API
- Favourites from Supabase
- User session from Supabase Auth

**Pattern**:
```typescript
useEffect(() => {
  let isMounted = true;

  const fetchData = async () => {
    setLoading(true);
    const result = await apiCall();
    if (isMounted) {
      setState(result);
      setLoading(false);
    }
  };

  fetchData();

  return () => { isMounted = false; };
}, [dependencies]);
```

## Routing

Using **React Router v7** with `BrowserRouter`:

```typescript
<Router basename={import.meta.env.BASE_URL}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/account" element={<AccountPage />} />
  </Routes>
</Router>
```

**Navigation**:
- Use `useNavigate()` hook for programmatic navigation
- Use `<Link>` component for navigation links
- Never use `window.location` (breaks SPA behavior)

**Example**:
```typescript
import { useNavigate, Link } from 'react-router-dom';

const navigate = useNavigate();
navigate('/account'); // Programmatic

<Link to="/login">Login</Link> // Declarative
```

## Styling Strategy

### Tailwind CSS

**Approach**: Utility-first CSS framework

**Configuration**: `tailwind.config.js`
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Custom colors, fonts, etc.
    }
  }
}
```

**Usage**:
```tsx
<div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all">
  <h3 className="font-bold text-lg text-gray-900">Event Title</h3>
</div>
```

**Benefits**:
- No CSS files to manage per component
- Consistent design system
- Automatic purging of unused styles
- Responsive design with breakpoint utilities

### Custom Styles

**Global styles**: `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom global styles */
```

## Performance Optimizations

### Current Optimizations

1. **Event Grouping**: Reduces duplicate cards by ~70%
2. **Debounced City Search**: Prevents excessive API calls (500ms delay)
3. **Code Splitting**: Vite automatically splits code
4. **Tree Shaking**: Unused code removed during build
5. **Optimistic UI Updates**: Instant feedback for favourites
6. **Image Optimization**: Lazy loading images (browser native)

### Future Optimizations

1. **React.memo**: Memoize expensive components
2. **useMemo**: Cache expensive computations
3. **useCallback**: Prevent function recreation
4. **Virtual Scrolling**: For long event lists
5. **Service Worker**: Offline support and caching
6. **Image CDN**: Optimize event images

**Example**:
```typescript
import { memo, useMemo, useCallback } from 'react';

const EventCard = memo(({ event, onEventClick }) => {
  const handleClick = useCallback(() => {
    onEventClick(event);
  }, [event, onEventClick]);

  return <div onClick={handleClick}>{event.title}</div>;
});
```

## Error Handling

### Patterns

1. **Try-Catch for async operations**:
```typescript
try {
  const result = await apiCall();
  setState(result);
} catch (error) {
  console.error('Error:', error);
  setError('User-friendly message');
}
```

2. **Conditional rendering for errors**:
```tsx
{error && (
  <div className="text-red-600">
    {error}
  </div>
)}
```

3. **Graceful degradation**:
```typescript
const image = event.image || 'https://via.placeholder.com/400';
```

4. **Loading states**:
```tsx
{isLoading ? (
  <div>Loading...</div>
) : (
  <EventList events={events} />
)}
```

## Security Considerations

### Client-Side Security

1. **Environment Variables**: Only expose public keys with `VITE_` prefix
2. **Input Validation**: Validate user input before API calls
3. **XSS Prevention**: React automatically escapes content
4. **HTTPS Only**: Enforced by Vercel
5. **No Secrets in Client**: Never include service role keys

### Server-Side Security (Supabase)

1. **Row Level Security**: Users can only access their own data
2. **Email Verification**: Required for account activation
3. **Password Hashing**: Handled by Supabase Auth
4. **Session Management**: JWT tokens with expiration
5. **CORS Configuration**: Controlled via Supabase dashboard

## Testing Strategy (Future)

### Unit Tests
- Test utility functions
- Test custom hooks
- Test service functions

**Tools**: Vitest, React Testing Library

### Integration Tests
- Test component interactions
- Test API integrations
- Test authentication flows

### End-to-End Tests
- Test critical user journeys
- Test cross-browser compatibility

**Tools**: Playwright, Cypress

## Scalability Considerations

### Current Scale
- Single region (UK events)
- ~200 events per API call
- Client-side filtering

### Future Scale
- Multi-region support
- Pagination for large result sets
- Server-side filtering
- Database caching
- CDN for static assets

## Development Workflow

### Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run typecheck    # Check TypeScript errors
npm run lint         # Check linting errors
```

### Code Quality
- TypeScript strict mode enabled
- ESLint rules enforced
- Consistent code formatting
- Git hooks for pre-commit checks (future)

### Deployment
```bash
npm run build        # Build for production
npm run preview      # Preview production build
git push             # Auto-deploy via Vercel
```

## Design Patterns

### 1. Container/Presenter Pattern
- Pages (containers) manage state
- Components (presenters) render UI

### 2. Custom Hooks Pattern
- Extract reusable stateful logic
- Examples: `useAuth`, `useFavourites`

### 3. Service Layer Pattern
- Centralize API calls
- Easy to mock for testing

### 4. Composition Pattern
- Build complex UI from simple components
- Example: HomePage composes Header, Carousel, EventCard

### 5. Render Props Pattern (Future)
- Share code between components
- Example: `<DataFetcher render={(data) => <UI data={data} />} />`

## Browser Support

### Target Browsers
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

### Polyfills
Not currently needed. Modern browsers support all features used.

## Accessibility (A11y)

### Current Implementation
- Semantic HTML elements
- ARIA labels for icon buttons
- Keyboard navigation support
- Focus states for interactive elements

### Future Improvements
- Screen reader testing
- Color contrast validation
- Keyboard-only navigation testing
- ARIA live regions for dynamic content

## Monitoring and Observability

### Current Monitoring
- Vercel deployment logs
- Browser console errors
- Supabase API logs

### Future Monitoring
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- User analytics (Plausible/GA4)
- Custom event tracking

## Documentation

### Code Documentation
- Inline comments for complex logic
- JSDoc comments for public APIs (future)
- README.md for project overview

### Technical Documentation (this folder)
- `database.md` - Database schema and queries
- `deployment.md` - Deployment and CI/CD
- `api-integrations.md` - API documentation
- `architecture.md` - This document

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com)

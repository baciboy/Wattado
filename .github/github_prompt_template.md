# EventFinder - GitHub Copilot Prompt Template

Use this template when working with GitHub Copilot/VSCode Copilot to ensure consistency across the EventFinder project.

## Project Context

**EventFinder** is an event discovery platform that aggregates events from multiple sources (Ticketmaster, Eventbrite, etc.) with AI-powered personalization and social features.

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom utilities
- **Icons**: Lucide React
- **Backend**: Supabase (Auth, Database, Real-time)
- **APIs**: Ticketmaster Discovery API (primary), other event platforms
- **State Management**: React hooks + custom hooks
- **HTTP Client**: Native fetch API
- **Deployment**: Vercel (planned)

### Key Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "@supabase/supabase-js": "^2.57.4",
  "lucide-react": "^0.344.0",
  "lodash.debounce": "^4.0.8",
  "tailwindcss": "^3.4.1"
}
```

## Coding Standards & Conventions

### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use proper typing for all props and function parameters
- Prefer `interface` over `type` for object shapes
- Use generic types where appropriate

### React Patterns
- **Components**: Functional components with hooks only
- **Props**: Always define TypeScript interfaces for props
- **State**: Use `useState` and `useReducer` for local state
- **Effects**: Use `useEffect` with proper dependency arrays
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Error Boundaries**: Implement for error handling

### Component Structure
```typescript
// Standard component template
import React from 'react';
import { IconName } from 'lucide-react';
import { ComponentProps } from '../types/ComponentTypes';

interface ComponentNameProps {
  // Props interface here
}

export const ComponentName: React.FC<ComponentNameProps> = ({ 
  prop1, 
  prop2,
  ...props 
}) => {
  // Hooks at the top
  const [state, setState] = useState();
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // Early returns for loading/error states
  if (loading) return <LoadingComponent />;
  
  // Main render
  return (
    <div className="component-styles">
      {/* Component content */}
    </div>
  );
};
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `EventCard.tsx`, `FilterSidebar.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`, `useEventFilters.ts`)
- **Services**: camelCase with `Service` suffix (e.g., `authService.ts`, `ticketmasterService.ts`)
- **Types**: PascalCase (e.g., `Event.ts`, `Auth.ts`)
- **Utils**: camelCase (e.g., `dateUtils.ts`, `formatters.ts`)

### Project Structure
```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── events/        # Event-related components
│   ├── favorites/     # Favorites functionality
│   ├── header/        # Header/navigation components
│   ├── ai/           # AI/chatbot components
│   └── ui/           # Reusable UI components
├── hooks/            # Custom React hooks
├── services/         # API services and external integrations
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── data/             # Mock data and constants
└── pages/            # Page components (if using routing)
```

### Styling Guidelines
- **Tailwind CSS**: Use utility classes for styling
- **Responsive Design**: Mobile-first approach with responsive utilities
- **Color Palette**: Purple primary (`purple-600`), Gray neutrals
- **Spacing**: Use Tailwind's spacing scale consistently
- **Typography**: Inter font family, consistent text sizes
- **Interactive States**: Always include hover, focus, and active states

#### Common Styling Patterns
```typescript
// Button styles
const buttonStyles = {
  primary: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500",
  secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  ghost: "text-purple-600 hover:bg-purple-50"
};

// Card styles
const cardStyles = "bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200";

// Input styles
const inputStyles = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent";
```

## Data Models & Interfaces

### Core Event Interface
```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: {
    venue: string;
    city: string;
    state: string;
    address: string;
    coordinates?: { latitude: number; longitude: number; };
  };
  price: { min: number; max: number; currency: string; };
  category: string;
  platform: 'eventbrite' | 'ticketmaster' | 'stubhub' | 'seatgeek' | 'vivid-seats';
  image: string;
  url: string;
  availability: 'available' | 'low' | 'sold-out';
  rating?: number;
  attendees?: number;
  // Platform-specific fields
  ticketmasterId?: string;
  genre?: string;
  subGenre?: string;
  promoter?: string;
}
```

### User Interface
```typescript
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
```

### Filter State Interface
```typescript
interface FilterState {
  search: string;
  dateRange: { start: string; end: string; };
  location: string;
  categories: string[];
  priceRange: { min: number; max: number; };
  platforms: string[];
  availability: string[];
}
```

## Component Patterns

### Error Handling
```typescript
// Always handle loading and error states
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// Error display pattern
if (error) {
  return (
    <div className="text-center py-16">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Title</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button onClick={retryAction} className="btn-primary">
        Try Again
      </button>
    </div>
  );
}
```

### Loading States
```typescript
// Loading pattern
if (loading) {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );
}
```

### Modal Pattern
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
};
```

## API Integration Patterns

### Service Pattern
```typescript
class ServiceName {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = 'API_BASE_URL';
  }
  
  async methodName(params: ParamsType): Promise<ReturnType> {
    try {
      const response = await fetch(`${this.baseUrl}/endpoint`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformData(data);
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }
  
  private transformData(data: any): ReturnType {
    // Transform API data to internal format
  }
}
```

### Custom Hook Pattern
```typescript
export const useCustomHook = (dependency: string) => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await service.getData(dependency);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [dependency]);
  
  return { data, loading, error, refetch: fetchData };
};
```

## Testing Patterns

### Component Testing
```typescript
// Test structure for components
describe('ComponentName', () => {
  it('renders correctly with required props', () => {
    // Test basic rendering
  });
  
  it('handles user interactions', () => {
    // Test click handlers, form submissions, etc.
  });
  
  it('displays loading state', () => {
    // Test loading states
  });
  
  it('handles error states', () => {
    // Test error handling
  });
});
```

## Environment Variables

```bash
# API Keys
VITE_TICKETMASTER_API_KEY=your_ticketmaster_key

# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Social Auth
VITE_FACEBOOK_APP_ID=your_facebook_app_id

# AI Integration (future)
VITE_OPENAI_API_KEY=your_openai_key
```

## Git Commit Convention

Use conventional commits:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting, missing semicolons, etc.
- `refactor:` code changes that neither fix bugs nor add features
- `test:` adding or updating tests
- `chore:` updating build tasks, package manager configs, etc.

Example: `feat: add user authentication with email and social login`

## Accessibility Requirements

- Use semantic HTML elements
- Include proper ARIA labels
- Ensure keyboard navigation works
- Maintain color contrast ratios
- Provide alt text for images
- Use focus indicators

## Performance Considerations

- Implement lazy loading for components
- Use React.memo for expensive components
- Debounce search inputs
- Optimize images
- Minimize API calls
- Use proper loading states

## When Creating New Components

Always consider:
1. **Reusability**: Can this be used elsewhere?
2. **Props Interface**: What props does it need?
3. **Error Handling**: How does it handle errors?
4. **Loading States**: Does it need loading indicators?
5. **Responsive Design**: How does it look on mobile?
6. **Accessibility**: Is it accessible to all users?
7. **Testing**: What should be tested?

## Example Prompt for Copilot

"Create a React component following the EventFinder project patterns. Use TypeScript, Tailwind CSS, and Lucide React icons. Include proper error handling, loading states, and follow the established file structure and naming conventions. Make it responsive and accessible."

---

**Always reference this template when working on EventFinder to maintain consistency across the codebase.**
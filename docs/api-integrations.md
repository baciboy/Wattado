# API Integrations Documentation

## Overview

Wattado integrates with multiple external services to provide event discovery, user authentication, and data management.

## Current Integrations

### 1. Ticketmaster Discovery API

**Purpose**: Fetch event data (concerts, sports, theater, etc.)

**Documentation**: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/

#### Configuration

**API Key**: Set in `.env` as `VITE_TICKETMASTER_API_KEY`

```env
VITE_TICKETMASTER_API_KEY=your_key_here
```

#### Service Location

`src/services/ticketmasterService.ts`

Currently, the API integration is handled directly in `App.tsx:39-195` for event grouping and deduplication logic.

#### API Endpoints Used

##### Get Events
```
GET https://app.ticketmaster.com/discovery/v2/events.json
```

**Query Parameters**:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `apikey` | string | Required. Your API key | `ZfQDOXOCj5PXmOQ4fEkNTJkczaRY4UHZ` |
| `size` | number | Number of results per page | `200` (max) |
| `countryCode` | string | ISO 3166-1 country code | `GB` (United Kingdom) |
| `city` | string | City name for filtering | `London`, `Manchester` |
| `startDateTime` | string | ISO 8601 datetime for filtering | `2025-10-19T00:00:00Z` |
| `classificationName` | string | Event category/genre | `Music`, `Sports` |

**Response Format**:
```json
{
  "_embedded": {
    "events": [
      {
        "id": "Z698xZC2Za4U0",
        "name": "Event Name",
        "type": "event",
        "url": "https://www.ticketmaster.com/...",
        "images": [
          {
            "url": "https://s1.ticketm.net/dam/a/...",
            "width": 2048,
            "height": 1152,
            "ratio": "16_9"
          }
        ],
        "dates": {
          "start": {
            "localDate": "2025-11-15",
            "localTime": "19:30:00",
            "dateTime": "2025-11-15T19:30:00Z"
          }
        },
        "classifications": [
          {
            "segment": { "name": "Music" },
            "genre": { "name": "Rock" },
            "subGenre": { "name": "Alternative Rock" }
          }
        ],
        "priceRanges": [
          {
            "type": "standard",
            "currency": "GBP",
            "min": 25.00,
            "max": 75.00
          }
        ],
        "_embedded": {
          "venues": [
            {
              "name": "O2 Arena",
              "city": { "name": "London" },
              "state": { "name": "England" },
              "address": { "line1": "Peninsula Square" },
              "location": {
                "latitude": "51.5033",
                "longitude": "-0.0031"
              }
            }
          ]
        }
      }
    ]
  },
  "page": {
    "size": 20,
    "totalElements": 1000,
    "totalPages": 50,
    "number": 0
  }
}
```

#### Data Transformation

Events are transformed from Ticketmaster format to internal `Event` type:

**Ticketmaster → Wattado Mapping**:

| Ticketmaster Field | Wattado Field | Transformation |
|-------------------|---------------|----------------|
| `id` | `ticketmasterId` | Direct mapping |
| `name` | `title` | Cleaned (remove day/time patterns) |
| `classifications[0].segment.name` | `category` | Direct mapping |
| `images[0].url` | `image` | Direct mapping |
| `dates.start.localDate` | `date` | Grouped events: date range |
| `dates.start.localTime` | `time` | Grouped events: comma-separated times |
| `priceRanges[0]` | `price` | Aggregated min/max across grouped events |
| `_embedded.venues[0]` | `location` | Mapped to location object |
| `url` | `url` | Direct mapping |
| - | `platform` | Set to `'ticketmaster'` |
| - | `availability` | Set to `'available'` |

#### Event Grouping Logic

Events are grouped by normalized name + venue to prevent duplicates:

**Process** (`App.tsx:87-185`):
1. Normalize event name (remove day/time patterns)
2. Create key: `${normalizedName}__${venue}`
3. Group events by key
4. Aggregate dates, times, and price ranges
5. Display date range for multi-date events

**Example**:
```
Input Events:
- "Concert - Friday 7:00PM" at O2 Arena on 2025-11-15
- "Concert - Saturday 8:00PM" at O2 Arena on 2025-11-16

Output Event:
- "Concert" at O2 Arena
- Date: "2025-11-15 - 2025-11-16"
- Times: "7:00PM, 8:00PM"
```

#### Rate Limits

**Discovery API Limits**:
- 5,000 API calls per day (free tier)
- 5 requests per second

**Best Practices**:
- Cache results when possible
- Use debouncing for search (already implemented: 500ms delay)
- Fetch maximum results per request (`size=200`)

#### Error Handling

```typescript
try {
  const res = await fetch(baseUrl);
  const data = await res.json();

  if (!data._embedded?.events) {
    setError('No events found. Try a different search.');
    return;
  }

  // Process events...
} catch {
  setError('Failed to fetch events. Please try again later.');
}
```

#### Future Improvements

1. **Caching**: Cache API responses in localStorage or IndexedDB
2. **Pagination**: Implement "Load More" for results beyond 200
3. **Advanced Filters**: Use more Ticketmaster query parameters
4. **Multiple Countries**: Support international events beyond UK

---

### 2. Supabase Authentication & Database

**Purpose**: User authentication and data storage

**Documentation**: https://supabase.com/docs

#### Configuration

**Environment Variables**:
```env
VITE_SUPABASE_URL=https://mfwgeqcedsmmfawcosge.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

#### Client Setup

`src/services/supabaseClient.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

#### Authentication API

##### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});
```

##### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

##### Sign Out
```typescript
const { error } = await supabase.auth.signOut();
```

##### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

##### Listen to Auth Changes
```typescript
const { data: subscription } = supabase.auth.onAuthStateChange(
  (event, session) => {
    console.log(event, session);
  }
);

// Unsubscribe
subscription.subscription.unsubscribe();
```

#### Database API

##### Insert Favourite
```typescript
const { data, error } = await supabase
  .from('favourites')
  .insert({
    user_id: user.id,
    event_id: 'event-123',
    event_data: { title: 'Concert', date: '2025-11-15' }
  });
```

##### Query Favourites
```typescript
const { data, error } = await supabase
  .from('favourites')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

##### Delete Favourite
```typescript
const { error } = await supabase
  .from('favourites')
  .delete()
  .eq('user_id', user.id)
  .eq('event_id', 'event-123');
```

##### Check if Favourite Exists
```typescript
const { data, error } = await supabase
  .from('favourites')
  .select('id')
  .eq('user_id', user.id)
  .eq('event_id', 'event-123')
  .single();

const isFavourite = !!data;
```

#### Error Handling

Common error codes:

| Code | Meaning | Solution |
|------|---------|----------|
| `23505` | Unique constraint violation | Already favourited (duplicate) |
| `PGRST116` | Row not found | Expected for "not favourite" checks |
| `401` | Unauthorized | User not authenticated |
| `403` | Forbidden | RLS policy violation |

**Example**:
```typescript
if (error) {
  if (error.code === '23505') {
    return { success: false, error: 'Event already in favourites' };
  }
  console.error('Error:', error);
  return { success: false, error: error.message };
}
```

---

## Planned Future Integrations

Based on the PRD (`eventfinder_prd.md`), these integrations are planned:

### 1. Eventbrite API

**Purpose**: Additional event source

**Documentation**: https://www.eventbrite.com/platform/api

**Setup Required**:
1. Create Eventbrite developer account
2. Get OAuth token
3. Create `eventbriteService.ts`
4. Merge with Ticketmaster events

### 2. OpenAI API (for AI Chatbot)

**Purpose**: Natural language event search

**Documentation**: https://platform.openai.com/docs

**Setup Required**:
1. Get OpenAI API key
2. Create chatbot service
3. Implement conversation history
4. Parse user intent → search parameters

**Example Flow**:
```
User: "Find me rock concerts in London next weekend"
  ↓
OpenAI parses intent:
- Category: Music / Rock
- Location: London
- Date: Next weekend
  ↓
Search Ticketmaster with parameters
  ↓
Return results to user
```

### 3. Analytics Tracking

**Options**:
- Google Analytics 4
- Plausible Analytics (privacy-focused)
- Vercel Analytics

**Events to Track**:
- Page views
- Event card clicks
- Favourite additions/removals
- Search queries
- Filter usage
- Sign ups / logins

---

## Environment Variables Summary

All API credentials and configuration:

```env
# Ticketmaster
VITE_TICKETMASTER_API_KEY=your_ticketmaster_key

# Supabase
VITE_SUPABASE_URL=https://mfwgeqcedsmmfawcosge.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Future: Eventbrite
# VITE_EVENTBRITE_API_KEY=your_eventbrite_key

# Future: OpenAI
# VITE_OPENAI_API_KEY=your_openai_key (DO NOT USE VITE_ prefix - use server-side)
```

**Security Note**:
- `VITE_` prefixed variables are exposed to the browser
- Never use `VITE_` for secret keys (like OpenAI API key)
- For server-side APIs, use Vercel Serverless Functions or Supabase Edge Functions

---

## API Testing

### Ticketmaster API Testing

**Using curl**:
```bash
curl -X GET "https://app.ticketmaster.com/discovery/v2/events.json?apikey=YOUR_KEY&size=10&countryCode=GB&city=London"
```

**Using Postman**:
1. Create new GET request
2. URL: `https://app.ticketmaster.com/discovery/v2/events.json`
3. Add query params: `apikey`, `size`, `countryCode`, `city`
4. Send request

### Supabase API Testing

**Using Supabase Dashboard**:
1. Go to SQL Editor
2. Run queries directly against database
3. View results in table editor

**Using Postman**:
```bash
# Get favourites
curl -X GET "https://mfwgeqcedsmmfawcosge.supabase.co/rest/v1/favourites?user_id=eq.USER_ID" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_USER_JWT"
```

---

## API Best Practices

1. **Always use environment variables** - Never hardcode API keys
2. **Handle errors gracefully** - Provide user-friendly error messages
3. **Implement loading states** - Show spinners during API calls
4. **Cache when possible** - Reduce API calls and improve performance
5. **Respect rate limits** - Implement debouncing and throttling
6. **Validate responses** - Check for expected data structure
7. **Use TypeScript types** - Define interfaces for API responses
8. **Log errors** - Use console.error for debugging
9. **Test error scenarios** - Test with invalid API keys, network failures
10. **Monitor API usage** - Track API call counts and costs

---

## Troubleshooting

### Ticketmaster API Issues

**No events returned**:
- Check API key is correct
- Verify query parameters are valid
- Try broader search (remove filters)
- Check Ticketmaster API status page

**Rate limit exceeded**:
- Implement caching
- Reduce API call frequency
- Consider upgrading API tier

### Supabase API Issues

**401 Unauthorized**:
- User not logged in
- Session expired (redirect to login)

**403 Forbidden**:
- RLS policy blocking access
- User trying to access another user's data

**Network errors**:
- Check Supabase project is active (not paused)
- Verify internet connection
- Check CORS settings

---

## Resources

- [Ticketmaster Discovery API Docs](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)
- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

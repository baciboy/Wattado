# AI Integration Documentation

## Overview

Wattado uses AI to enhance event discovery through natural language search, trending event detection, and personalized recommendations. The AI system is powered by **Vercel AI SDK** with **Amazon Bedrock** as the LLM provider.

## AI Use Cases

### 1. Natural Language Event Search
**Goal**: Allow users to search for events using natural language queries

**Examples**:
- "Find me a stylish art show in London"
- "What concerts are happening this weekend?"
- "I want something romantic for date night"
- "Show me family-friendly events under £30"

**Implementation**: Search bar with AI-powered query parsing

### 2. Trending & Cultural Context Detection
**Goal**: Highlight culturally significant events and trends

**Examples**:
- During Frieze Week → Highlight art galleries and exhibitions
- During Fashion Week → Highlight fashion shows and parties
- Local festivals → Promote related events
- Seasonal trends → Christmas markets, summer festivals

**Implementation**: Background AI analysis of event data + cultural calendar

### 3. Personalized Recommendations (Future)
**Goal**: Suggest events based on user preferences and history

**Examples**:
- "You liked jazz concerts, check out this week's shows"
- "Events similar to ones you've favourited"
- "Friends are going to this event"

**Implementation**: User behavior analysis + collaborative filtering

---

## Architecture

### High-Level Flow

```
User Input (Natural Language)
    ↓
Frontend (Search Bar / Chat)
    ↓
API Route (/api/ai/search)
    ↓
Vercel AI SDK + Amazon Bedrock
    ↓
Parse Intent & Extract Parameters
    ↓
Query Ticketmaster API with Parameters
    ↓
AI Ranks & Filters Results
    ↓
Return Enhanced Results to Frontend
```

### Why Amazon Bedrock?

1. **Cost-Effective**: Pay-per-use, no base fees
2. **Multiple Models**: Access to Claude, Llama, Titan models
3. **Enterprise-Ready**: AWS security and compliance
4. **Serverless**: No infrastructure management
5. **Low Latency**: Fast inference for real-time search

### Why Vercel AI SDK?

1. **Framework Agnostic**: Works with React/Next.js
2. **Streaming Support**: Real-time responses
3. **Edge Runtime**: Fast edge execution
4. **Built-in Caching**: Reduces API costs
5. **Type Safety**: Full TypeScript support

---

## Setup Guide

### Prerequisites

1. **AWS Account** with Bedrock access
2. **Vercel Account** for deployment
3. **IAM User** with Bedrock permissions

### Step 1: Enable Amazon Bedrock

1. Go to [AWS Console](https://console.aws.amazon.com) → **Amazon Bedrock**
2. Navigate to **Model access** (left sidebar)
3. Click **Manage model access**
4. Enable models:
   - ✅ **Anthropic Claude 3.5 Sonnet** (recommended for quality)
   - ✅ **Anthropic Claude 3 Haiku** (recommended for speed/cost)
   - ✅ **Amazon Titan Text** (optional, cheaper alternative)
5. Submit request (usually instant approval for Claude)
6. Wait for status to show "Access granted"

### Step 2: Create IAM User for Bedrock

1. Go to **IAM** → **Users** → **Create user**
2. User name: `wattado-bedrock-user`
3. Attach policy: `AmazonBedrockFullAccess` (or create custom policy below)
4. Click **Create user**
5. Go to **Security credentials** → **Create access key**
6. Select **Application running outside AWS**
7. **Save** Access Key ID and Secret Access Key

**Custom IAM Policy (More Secure)**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0",
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0"
      ]
    }
  ]
}
```

### Step 3: Install Dependencies

```bash
npm install ai @ai-sdk/amazon-bedrock
```

**Packages**:
- `ai` - Vercel AI SDK core
- `@ai-sdk/amazon-bedrock` - Amazon Bedrock provider

### Step 4: Set Environment Variables

Add to `.env`:
```env
# Amazon Bedrock (Server-side only - DO NOT prefix with VITE_)
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1

# Bedrock Model IDs
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0

# Optional: For faster/cheaper queries
BEDROCK_FAST_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
```

**Important**: These are **server-side only**. Never prefix with `VITE_` or they'll be exposed to the browser.

Add to Vercel environment variables:
1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add all AWS variables above
3. Set for **Production**, **Preview**, and **Development**

### Step 5: Create API Routes

Since you're using **Vite** (not Next.js), you need to create API routes using **Vercel Serverless Functions**.

Create `/api` folder structure:
```
api/
├── ai/
│   ├── search.ts          # Natural language search
│   ├── trending.ts        # Trending events detection
│   └── recommendations.ts # Future: personalized recommendations
```

---

## Implementation

### Option 1: AI-Enhanced Search Bar (Recommended)

**Pros**:
- Seamless UX (users already use search)
- No UI changes needed
- Fast and direct

**Cons**:
- No conversation history
- Single query at a time

**User Experience**:
```
User types: "romantic date night events this weekend"
    ↓
AI parses: {
  category: "Arts & Theatre",
  priceRange: { min: 20, max: 80 },
  dateRange: { start: "2025-10-25", end: "2025-10-27" },
  mood: "romantic",
  keywords: ["dinner", "concert", "theatre"]
}
    ↓
Search events with parameters
    ↓
AI ranks by relevance
    ↓
Display results with explanation: "Here are romantic events this weekend..."
```

### Option 2: Chatbot Sidebar

**Pros**:
- Conversational refinement
- Can ask clarifying questions
- More engaging

**Cons**:
- Requires new UI component
- More complex state management
- Slower (back-and-forth)

**User Experience**:
```
User: "I want something artsy"
Bot: "Great! Are you interested in modern art, theatre, or museums?"
User: "Modern art"
Bot: "Perfect! Here are 5 contemporary art exhibitions in London..."
```

### Recommended Approach: Hybrid

1. **Phase 1**: AI-enhanced search bar (quick win)
2. **Phase 2**: Add optional chatbot for exploration

---

## Code Implementation

### 1. Create Vercel Serverless Function

**File**: `/api/ai/search.ts`

```typescript
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { generateText } from 'ai';

// Initialize Bedrock client
const bedrock = createAmazonBedrock({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});

// Define the model
const model = bedrock('anthropic.claude-3-5-sonnet-20240620-v1:0');

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    // Generate structured output from natural language query
    const { text } = await generateText({
      model,
      prompt: `You are an event search assistant. Parse this natural language query into structured search parameters.

Query: "${query}"

Return a JSON object with these fields (only include fields that are mentioned or implied):
{
  "category": string (one of: "Music", "Sports", "Arts & Theatre", "Family", or null),
  "location": string (city name or null),
  "dateRange": {
    "start": string (ISO date or null),
    "end": string (ISO date or null)
  },
  "priceRange": {
    "min": number (or null),
    "max": number (or null)
  },
  "keywords": string[] (descriptive words like "romantic", "outdoor", "jazz"),
  "mood": string (overall vibe: "romantic", "fun", "cultural", "energetic", etc.)
}

Current date: ${new Date().toISOString().split('T')[0]}

Examples:
- "romantic date night" → category: "Arts & Theatre", mood: "romantic", keywords: ["romantic", "intimate"]
- "jazz concerts in London" → category: "Music", location: "London", keywords: ["jazz"]
- "family events under £30" → category: "Family", priceRange: {max: 30}

Return ONLY the JSON object, no other text.`,
    });

    // Parse AI response
    const searchParams = JSON.parse(text);

    return res.status(200).json({
      success: true,
      searchParams,
      explanation: generateExplanation(query, searchParams)
    });

  } catch (error) {
    console.error('AI Search Error:', error);
    return res.status(500).json({
      error: 'Failed to process search query',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function generateExplanation(query: string, params: any): string {
  const parts = [];

  if (params.category) parts.push(`${params.category} events`);
  if (params.location) parts.push(`in ${params.location}`);
  if (params.mood) parts.push(`with a ${params.mood} vibe`);
  if (params.priceRange?.max) parts.push(`under £${params.priceRange.max}`);

  return `Searching for ${parts.join(' ')}...`;
}
```

### 2. Create Frontend Service

**File**: `/src/services/aiService.ts`

```typescript
export interface AISearchParams {
  category?: string;
  location?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  keywords?: string[];
  mood?: string;
}

export interface AISearchResult {
  success: boolean;
  searchParams: AISearchParams;
  explanation: string;
}

/**
 * Parse natural language query using AI
 */
export async function parseNaturalLanguageQuery(
  query: string
): Promise<AISearchResult> {
  try {
    const response = await fetch('/api/ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`AI search failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
}

/**
 * Convert AI search params to Ticketmaster API params
 */
export function convertToTicketmasterParams(
  aiParams: AISearchParams
): Record<string, string> {
  const params: Record<string, string> = {};

  if (aiParams.category) {
    params.classificationName = aiParams.category;
  }

  if (aiParams.location) {
    params.city = aiParams.location;
  }

  if (aiParams.dateRange?.start) {
    params.startDateTime = aiParams.dateRange.start + 'T00:00:00Z';
  }

  if (aiParams.dateRange?.end) {
    params.endDateTime = aiParams.dateRange.end + 'T23:59:59Z';
  }

  return params;
}

/**
 * Rank events by relevance to AI-detected keywords and mood
 */
export function rankEventsByRelevance(
  events: any[],
  aiParams: AISearchParams
): any[] {
  if (!aiParams.keywords && !aiParams.mood) {
    return events; // No ranking needed
  }

  return events.map(event => {
    let score = 0;
    const searchText = `${event.title} ${event.description} ${event.genre} ${event.category}`.toLowerCase();

    // Score based on keywords
    if (aiParams.keywords) {
      aiParams.keywords.forEach(keyword => {
        if (searchText.includes(keyword.toLowerCase())) {
          score += 10;
        }
      });
    }

    // Score based on mood
    if (aiParams.mood) {
      const moodKeywords: Record<string, string[]> = {
        romantic: ['romantic', 'intimate', 'date', 'dinner', 'wine'],
        fun: ['party', 'festival', 'club', 'dance', 'comedy'],
        cultural: ['museum', 'gallery', 'theatre', 'opera', 'classical'],
        energetic: ['rock', 'club', 'dance', 'party', 'festival'],
        relaxing: ['acoustic', 'jazz', 'spa', 'yoga', 'meditation'],
      };

      const moodWords = moodKeywords[aiParams.mood.toLowerCase()] || [];
      moodWords.forEach(word => {
        if (searchText.includes(word)) {
          score += 5;
        }
      });
    }

    return { ...event, relevanceScore: score };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore);
}
```

### 3. Integrate into Search Bar

**File**: `/src/components/Header.tsx`

Add AI-powered search:

```typescript
import { parseNaturalLanguageQuery, convertToTicketmasterParams, rankEventsByRelevance } from '../services/aiService';

// Inside Header component
const [isAISearching, setIsAISearching] = useState(false);
const [aiExplanation, setAiExplanation] = useState('');

const handleAISearch = async (query: string) => {
  if (!query.trim()) return;

  setIsAISearching(true);
  setAiExplanation('');

  try {
    // Parse query with AI
    const aiResult = await parseNaturalLanguageQuery(query);

    // Show explanation to user
    setAiExplanation(aiResult.explanation);

    // Update filters based on AI params
    const newFilters = {
      ...filters,
      search: query,
      location: aiResult.searchParams.location || filters.location,
      categories: aiResult.searchParams.category
        ? [aiResult.searchParams.category]
        : filters.categories,
      priceRange: aiResult.searchParams.priceRange || filters.priceRange,
      dateRange: aiResult.searchParams.dateRange || filters.dateRange,
    };

    onFiltersChange(newFilters);

    // Store AI params for ranking (you'll need to pass this to App.tsx)
    // This allows ranking events by relevance after fetching

  } catch (error) {
    console.error('AI search failed:', error);
    // Fall back to regular search
    onFiltersChange({ ...filters, search: query });
  } finally {
    setIsAISearching(false);
  }
};

// In the search input
<div className="relative">
  <input
    type="text"
    placeholder="Try: 'romantic date night events' or 'jazz concerts this weekend'"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    onKeyPress={(e) => {
      if (e.key === 'Enter') {
        handleAISearch(searchQuery);
      }
    }}
    className="..."
  />
  {isAISearching && (
    <div className="absolute right-3 top-3">
      <span className="animate-spin">🤖</span>
    </div>
  )}
</div>

{aiExplanation && (
  <div className="mt-2 text-sm text-blue-600">
    ✨ {aiExplanation}
  </div>
)}
```

---

## Trending Events Detection

### Approach 1: Cultural Calendar + AI

Create a cultural calendar of known events:

**File**: `/src/data/culturalCalendar.ts`

```typescript
export interface CulturalEvent {
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  keywords: string[];
  categories: string[];
}

export const culturalCalendar: CulturalEvent[] = [
  {
    name: "Frieze London",
    startDate: "2025-10-09",
    endDate: "2025-10-13",
    location: "London",
    keywords: ["contemporary art", "gallery", "exhibition", "art fair"],
    categories: ["Arts & Theatre"]
  },
  {
    name: "London Fashion Week",
    startDate: "2025-09-13",
    endDate: "2025-09-17",
    location: "London",
    keywords: ["fashion", "runway", "designer", "style"],
    categories: ["Arts & Theatre"]
  },
  {
    name: "Christmas Markets",
    startDate: "2025-11-15",
    endDate: "2025-12-24",
    location: "Various",
    keywords: ["christmas", "market", "festive", "winter"],
    categories: ["Family"]
  },
  // Add more...
];

export function getCurrentCulturalEvents(): CulturalEvent[] {
  const now = new Date();
  return culturalCalendar.filter(event => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return now >= start && now <= end;
  });
}
```

### Approach 2: AI-Powered Trending Detection

**File**: `/api/ai/trending.ts`

```typescript
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { generateText } from 'ai';

const bedrock = createAmazonBedrock({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});

const model = bedrock('anthropic.claude-3-haiku-20240307-v1:0'); // Use faster model

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { events, location = 'London' } = req.body;

  try {
    const { text } = await generateText({
      model,
      prompt: `You are a cultural events expert. Analyze these events and identify what's trending or culturally significant right now.

Location: ${location}
Current Date: ${new Date().toISOString().split('T')[0]}

Events (titles only): ${events.slice(0, 50).map((e: any) => e.title).join(', ')}

Identify:
1. Cultural events happening now (festivals, art weeks, fashion weeks, etc.)
2. Trending themes (genres, artists, types of events)
3. Seasonal trends

Return JSON:
{
  "trendingThemes": ["theme1", "theme2"],
  "culturalEvents": ["event name1", "event name2"],
  "seasonalHighlight": "description",
  "recommendations": ["event title that matches trends"]
}`,
    });

    const trending = JSON.parse(text);
    return res.status(200).json({ success: true, trending });

  } catch (error) {
    console.error('Trending detection error:', error);
    return res.status(500).json({ error: 'Failed to detect trends' });
  }
}
```

### Display Trending Section

**File**: `/src/components/TrendingSection.tsx`

```typescript
import { useEffect, useState } from 'react';
import { Event } from '../types/Event';
import { Sparkles } from 'lucide-react';

interface TrendingData {
  trendingThemes: string[];
  culturalEvents: string[];
  seasonalHighlight: string;
  recommendations: string[];
}

export const TrendingSection = ({ events }: { events: Event[] }) => {
  const [trending, setTrending] = useState<TrendingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectTrending = async () => {
      try {
        const response = await fetch('/api/ai/trending', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events }),
        });

        const result = await response.json();
        setTrending(result.trending);
      } catch (error) {
        console.error('Failed to detect trending:', error);
      } finally {
        setLoading(false);
      }
    };

    if (events.length > 0) {
      detectTrending();
    }
  }, [events]);

  if (loading || !trending) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-200">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
      </div>

      {trending.seasonalHighlight && (
        <p className="text-gray-700 mb-4">{trending.seasonalHighlight}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {trending.trendingThemes.map(theme => (
          <span
            key={theme}
            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
          >
            {theme}
          </span>
        ))}
      </div>
    </div>
  );
};
```

---

## Cost Estimation

### Amazon Bedrock Pricing (Claude 3.5 Sonnet)

- **Input**: $3.00 per million tokens
- **Output**: $15.00 per million tokens

**Per Search Query**:
- Input: ~200 tokens (prompt + query) = $0.0006
- Output: ~100 tokens (JSON response) = $0.0015
- **Total: ~$0.002 per search**

**At Scale**:
- 1,000 searches/day = $2/day = $60/month
- 10,000 searches/day = $20/day = $600/month

### Cost Optimization

1. **Use Claude 3 Haiku for simple tasks** (10x cheaper)
2. **Cache frequent queries** (same query = no API call)
3. **Batch trending detection** (once per hour, not per user)
4. **Use shorter prompts** (fewer input tokens)

---

## Testing

### Test AI Search Locally

```bash
# Start dev server
npm run dev

# Test API endpoint
curl -X POST http://localhost:5173/api/ai/search \
  -H "Content-Type: application/json" \
  -d '{"query": "romantic date night events this weekend"}'
```

### Test Cases

1. **Basic query**: "concerts in London"
2. **Complex query**: "romantic date night events under £50 this weekend"
3. **Mood-based**: "something fun and energetic"
4. **Vague query**: "I want something cool"
5. **Time-based**: "what's happening tonight?"

---

## Deployment Checklist

- [ ] AWS Bedrock access enabled for Claude models
- [ ] IAM user created with Bedrock permissions
- [ ] AWS credentials added to Vercel environment variables
- [ ] Vercel AI SDK dependencies installed
- [ ] API routes created in `/api` folder
- [ ] Frontend service layer created
- [ ] Search bar integration completed
- [ ] Trending section implemented
- [ ] Error handling and fallbacks in place
- [ ] Cost monitoring set up (AWS CloudWatch)

---

## Next Steps

### Phase 1: Basic AI Search (Week 1-2)
1. Set up AWS Bedrock and IAM
2. Install Vercel AI SDK
3. Create `/api/ai/search.ts` endpoint
4. Integrate into search bar
5. Test and deploy

### Phase 2: Trending Detection (Week 3)
1. Create cultural calendar
2. Build trending detection API
3. Create trending section UI
4. Test and refine

### Phase 3: Chatbot (Week 4-5)
1. Design chat UI component
2. Create streaming chat API
3. Implement conversation history
4. Add to homepage sidebar

### Phase 4: Personalization (Future)
1. Collect user interaction data
2. Build recommendation engine
3. Train on user preferences
4. Create personalized feed

---

## Resources

- [Vercel AI SDK Docs](https://ai-sdk.dev/docs/introduction)
- [Amazon Bedrock Docs](https://docs.aws.amazon.com/bedrock/)
- [Bedrock Pricing](https://aws.amazon.com/bedrock/pricing/)
- [Claude 3.5 Sonnet Guide](https://docs.anthropic.com/claude/docs)

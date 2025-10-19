import { Event } from '../types/Event';

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
      const errorData = await response.json();
      throw new Error(errorData.error || `AI search failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
}

/**
 * Rank events by relevance to AI-detected keywords and mood
 */
export function rankEventsByRelevance(
  events: Event[],
  aiParams: AISearchParams
): Event[] {
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
        romantic: ['romantic', 'intimate', 'date', 'dinner', 'wine', 'candlelight'],
        stylish: ['stylish', 'elegant', 'sophisticated', 'chic', 'fashion', 'art', 'gallery'],
        fun: ['party', 'festival', 'club', 'dance', 'comedy', 'celebration'],
        cultural: ['museum', 'gallery', 'theatre', 'opera', 'classical', 'art', 'exhibition'],
        energetic: ['rock', 'club', 'dance', 'party', 'festival', 'electronic', 'edm'],
        relaxing: ['acoustic', 'jazz', 'spa', 'yoga', 'meditation', 'ambient'],
        family: ['family', 'kids', 'children', 'children\'s', 'friendly'],
        elegant: ['elegant', 'sophisticated', 'formal', 'gala', 'black tie'],
      };

      const moodWords = moodKeywords[aiParams.mood.toLowerCase()] || [];
      moodWords.forEach(word => {
        if (searchText.includes(word)) {
          score += 5;
        }
      });
    }

    return { ...event, relevanceScore: score };
  }).sort((a: any, b: any) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
}

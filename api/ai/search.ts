import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { generateText } from 'ai';

// Initialize Bedrock client
const bedrock = createAmazonBedrock({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});

// Use Claude 3.5 Sonnet for best quality
const model = bedrock(
  process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20240620-v1:0'
);

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
    "start": string (ISO date YYYY-MM-DD or null),
    "end": string (ISO date YYYY-MM-DD or null)
  },
  "priceRange": {
    "min": number (or null),
    "max": number (or null)
  },
  "keywords": string[] (descriptive words like "romantic", "outdoor", "jazz", "stylish"),
  "mood": string (overall vibe: "romantic", "fun", "cultural", "energetic", "stylish", "elegant", etc.)
}

Current date: ${new Date().toISOString().split('T')[0]}

Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

Time references:
- "this weekend" = next Saturday and Sunday
- "tonight" = today
- "this week" = next 7 days
- "next week" = 7-14 days from now

Examples:
- "romantic date night" → category: "Arts & Theatre", mood: "romantic", keywords: ["romantic", "intimate", "date"]
- "stylish art show" → category: "Arts & Theatre", mood: "stylish", keywords: ["art", "stylish", "elegant", "gallery"]
- "jazz concerts in London" → category: "Music", location: "London", keywords: ["jazz"]
- "family events under £30" → category: "Family", priceRange: {max: 30}, keywords: ["family", "kids"]
- "something fun this weekend" → mood: "fun", dateRange: {start: next Saturday, end: next Sunday}

Return ONLY valid JSON, no markdown, no code blocks, no other text.`,
    });

    // Parse AI response - handle potential markdown code blocks
    let cleanedText = text.trim();

    // Remove markdown code blocks if present
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const searchParams = JSON.parse(cleanedText);

    // Generate user-friendly explanation
    const explanation = generateExplanation(query, searchParams);

    return res.status(200).json({
      success: true,
      searchParams,
      explanation
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

  if (params.category) {
    parts.push(`${params.category} events`);
  } else {
    parts.push('events');
  }

  if (params.location) {
    parts.push(`in ${params.location}`);
  }

  if (params.mood) {
    parts.push(`with a ${params.mood} vibe`);
  }

  if (params.keywords && params.keywords.length > 0) {
    const keywordStr = params.keywords.slice(0, 2).join(' and ');
    if (keywordStr && !parts.some(p => p.includes(keywordStr))) {
      parts.push(`featuring ${keywordStr}`);
    }
  }

  if (params.priceRange?.max) {
    parts.push(`under £${params.priceRange.max}`);
  }

  if (params.dateRange?.start && params.dateRange?.end) {
    const start = new Date(params.dateRange.start);
    const end = new Date(params.dateRange.end);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    parts.push(`from ${startStr} to ${endStr}`);
  } else if (params.dateRange?.start) {
    const start = new Date(params.dateRange.start);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    parts.push(`starting ${startStr}`);
  }

  return `Searching for ${parts.join(' ')}`;
}

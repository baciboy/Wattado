import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// Initialize Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface EventSummary {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  price: {
    min: number;
    max: number;
    currency: string;
  };
  description?: string;
  platform: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversationHistory = [], availableEvents = [] }: {
    message: string;
    conversationHistory: ConversationMessage[];
    availableEvents: EventSummary[];
  } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Check for AWS credentials
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.warn('AWS Bedrock credentials not configured');
    return res.status(500).json({ error: 'AI service not configured' });
  }

  try {
    // Prepare event context for Claude
    const eventContext = availableEvents.length > 0
      ? `\n\nAvailable Events (${availableEvents.length} total):\n${availableEvents.slice(0, 30).map((e, i) =>
          `${i + 1}. "${e.title}" - ${e.category} | ${e.location} | ${e.date} | ${e.price.min === 0 && e.price.max === 0 ? 'Free' : `${e.price.currency} ${e.price.min}-${e.price.max}`} | ID: ${e.id} | Platform: ${e.platform}${e.description ? ` | ${e.description.slice(0, 100)}` : ''}`
        ).join('\n')}`
      : '';

    // Build conversation for Claude
    const systemPrompt = `You are a helpful and enthusiastic event discovery assistant for Wattado, an event aggregation platform. Your role is to help users find the perfect events based on their preferences, mood, budget, and schedule.

Guidelines:
1. Be conversational, friendly, and enthusiastic about events
2. Ask clarifying questions if the user's request is vague
3. When recommending events, mention specific details like date, location, and price
4. If suggesting events, ALWAYS include their IDs in your response using this format at the end: [EVENT_IDS: id1, id2, id3]
5. Consider user preferences like mood (romantic, fun, cultural, energetic, etc.), budget, date preferences, and location
6. Explain WHY you're recommending specific events based on their query
7. Keep responses concise but informative
8. If no events match their criteria, suggest alternatives or ask them to broaden their search
9. You can discuss general event topics, but always try to guide users to discover events from the available list

Current Context:${eventContext}

Remember: When you recommend events, include [EVENT_IDS: eventId1, eventId2, eventId3] at the very end of your response.`;

    // Format conversation history for Claude
    const claudeMessages = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ];

    // Call Claude via Bedrock
    const modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20240620-v1:0';

    const bedrockRequest = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1500,
      system: systemPrompt,
      messages: claudeMessages,
      temperature: 0.7,
    };

    const command = new InvokeModelCommand({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(bedrockRequest),
    });

    const bedrockResponse = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(bedrockResponse.body));

    let assistantMessage = responseBody.content[0].text;

    // Extract event IDs if present
    const eventIdsMatch = assistantMessage.match(/\[EVENT_IDS:\s*([^\]]+)\]/);
    let suggestedEventIds: string[] = [];

    if (eventIdsMatch) {
      // Extract and clean event IDs
      suggestedEventIds = eventIdsMatch[1]
        .split(',')
        .map((id: string) => id.trim())
        .filter((id: string) => id.length > 0)
        .slice(0, 5); // Limit to 5 events

      // Remove the [EVENT_IDS: ...] tag from the message
      assistantMessage = assistantMessage.replace(/\[EVENT_IDS:\s*[^\]]+\]/, '').trim();
    }

    return res.status(200).json({
      message: assistantMessage,
      suggestedEventIds: suggestedEventIds.length > 0 ? suggestedEventIds : undefined,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Failed to process chat request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

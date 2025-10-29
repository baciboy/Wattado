# AI Chatbot Integration Guide

## Overview

The Wattado chatbot is an AI-powered conversational assistant that helps users discover events based on their preferences, mood, budget, and schedule. It uses AWS Bedrock with Claude 3.5 Sonnet to provide intelligent, context-aware recommendations.

## Architecture

```
User Input
    ↓
ChatBot Component (Frontend)
    ↓
/api/ai/chat (Serverless Function)
    ↓
AWS Bedrock + Claude 3.5 Sonnet
    ↓
Response + Event Recommendations
    ↓
Display to User (with clickable event cards)
```

## Features

### 1. **Conversational Interface**
- Floating chat bubble in bottom-right corner
- Expandable chat window (400x600px)
- Smooth animations and transitions
- Mobile-responsive design

### 2. **AI-Powered Recommendations**
- Natural language understanding
- Context-aware responses
- Personalized event suggestions
- Mood-based recommendations (romantic, fun, cultural, etc.)
- Budget-conscious suggestions
- Date and location filtering

### 3. **Event Cards**
- Inline event recommendations within chat
- Clickable cards that open event details
- Shows event image, title, date, location, and price
- Direct integration with existing event modal

### 4. **Conversation History**
- Maintains context throughout the conversation
- All messages stored in component state
- Can reference previous messages for better recommendations

## Files Created

1. **`src/components/ChatBot.tsx`** - Frontend chat UI component
2. **`api/ai/chat.ts`** - Backend API endpoint for AI processing
3. **Updated `src/App.tsx`** - Integrated ChatBot into main app

## How It Works

### Frontend (ChatBot.tsx)

The ChatBot component manages:
- **UI State**: Open/closed, messages, loading states
- **Message Handling**: User input, sending messages, displaying responses
- **Event Display**: Renders suggested events as clickable cards
- **Conversation Flow**: Maintains message history for context

**Key Features:**
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestedEvents?: Event[];  // Optional event recommendations
}
```

### Backend (api/ai/chat.ts)

The API endpoint:
1. **Receives**: User message, conversation history, available events
2. **Prepares**: Event context for Claude (top 30 events)
3. **Calls**: AWS Bedrock with Claude 3.5 Sonnet
4. **Extracts**: Event IDs from Claude's response using `[EVENT_IDS: id1, id2, id3]` format
5. **Returns**: Cleaned message + list of recommended event IDs

**System Prompt:**
The AI is instructed to:
- Be conversational and enthusiastic
- Ask clarifying questions when needed
- Recommend events with specific details
- Include event IDs using `[EVENT_IDS: ...]` format
- Consider mood, budget, date, and location preferences

## Usage Examples

### User Queries the Chatbot Can Handle:

1. **Mood-Based Searches**
   - "Find romantic date night events"
   - "Show me something fun and energetic"
   - "I want a cultural experience"

2. **Budget Queries**
   - "What free events are happening?"
   - "Show me events under £50"
   - "Recommend something affordable for a family"

3. **Date & Time**
   - "What's happening this weekend?"
   - "Show me concerts next week"
   - "Events tonight in London"

4. **Category-Specific**
   - "Find music festivals"
   - "Sports events near me"
   - "Art exhibitions this month"

5. **Conversational**
   - "I'm bored, what should I do?"
   - "Planning a date night, any suggestions?"
   - "What's popular right now?"

## Configuration

### Environment Variables Required

```env
# AWS Bedrock
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# Bedrock Model
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
```

### AWS IAM Permissions

Your AWS IAM user/role needs:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0"
    }
  ]
}
```

## Customization

### Changing the Chat Bubble Position

In `ChatBot.tsx`, modify the `bottom-6 right-6` classes:
```tsx
<button className="fixed bottom-6 right-6 ...">
```

### Adjusting Chat Window Size

In `ChatBot.tsx`:
```tsx
<div className="... w-[400px] h-[600px] ...">
```

### Limiting Event Recommendations

In `api/ai/chat.ts`, change the slice limit:
```typescript
availableEvents: events.slice(0, 50)  // Send top 50 instead of 30
```

### Modifying AI Personality

Edit the `systemPrompt` in `api/ai/chat.ts` to change tone, style, or behavior:
```typescript
const systemPrompt = `You are a [your custom personality]...`;
```

## Advanced Features to Add (Future)

1. **User Preferences Storage**
   - Save user's preferred event types
   - Remember past conversations
   - Store location and budget preferences

2. **Event Booking Integration**
   - Direct ticket purchase from chat
   - Price comparison across platforms
   - Availability checking

3. **Calendar Integration**
   - Add events to Google/Apple Calendar
   - Set reminders
   - Share events with friends

4. **Multi-Language Support**
   - Detect user language
   - Respond in user's preferred language

5. **Voice Input**
   - Speech-to-text for messages
   - Voice responses

6. **Proactive Suggestions**
   - "Events you might like" notifications
   - Trending events alerts
   - Friend recommendations

## Troubleshooting

### Chatbot not responding
1. Check AWS credentials in `.env`
2. Verify IAM permissions for Bedrock
3. Check browser console for errors
4. Ensure `/api/ai/chat` endpoint is accessible

### Event recommendations not showing
1. Verify events are being passed to ChatBot component
2. Check that Claude is including `[EVENT_IDS: ...]` in response
3. Ensure event IDs match actual event IDs in database

### Slow responses
1. Consider using Claude 3.5 Haiku for faster responses:
   ```typescript
   const modelId = 'anthropic.claude-3-haiku-20240307-v1:0';
   ```
2. Reduce number of events sent in context (currently 30)
3. Optimize conversation history length

## Cost Considerations

### AWS Bedrock Pricing (as of 2025)

**Claude 3.5 Sonnet:**
- Input: ~$3 per million tokens
- Output: ~$15 per million tokens

**Estimated costs per conversation:**
- Average conversation: 5-10 messages
- Each message: ~1,000-2,000 tokens
- Cost per conversation: $0.02 - $0.05

**Monthly estimates (1000 users, 5 conversations each):**
- Total conversations: 5,000
- Estimated monthly cost: $100 - $250

### Cost Optimization Tips:

1. **Use Claude 3.5 Haiku for simple queries** (~10x cheaper)
2. **Limit conversation history** to last 10 messages
3. **Cache event data** instead of sending full list each time
4. **Implement rate limiting** to prevent abuse
5. **Add user authentication** to track usage

## Testing

### Manual Testing Queries:

```
1. "Find romantic events under £30"
2. "What's happening this weekend?"
3. "Show me concerts in London"
4. "I'm feeling adventurous, surprise me!"
5. "Family-friendly events this month"
```

### Expected Behavior:
- Should respond within 2-3 seconds
- Should recommend 1-5 relevant events
- Event cards should be clickable
- Should maintain conversation context

## Support

For issues or questions:
1. Check AWS CloudWatch logs for backend errors
2. Check browser console for frontend errors
3. Review conversation history in chat component state
4. Test with simple queries first before complex ones

## Related Documentation

- [AI Search Documentation](./AI_SEARCH.md)
- [Event Filtering Guide](./FILTERS.md)
- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Claude API Guide](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)

# Chatbot Quick Start Guide

## What Was Added

✅ **AI-powered chatbot widget** - Floating button in bottom-right corner
✅ **Natural language conversation** - Talk naturally about what events you want
✅ **Smart recommendations** - AI suggests events based on mood, budget, date, location
✅ **Clickable event cards** - Recommended events appear as cards in chat
✅ **Full integration** - Works with existing event modal and filtering

## How to Use

### 1. Open the Chatbot

On the home page, click the purple chat bubble in the bottom-right corner.

### 2. Ask Questions

Try questions like:
- "Find romantic date night events under £50"
- "What's happening this weekend in London?"
- "Show me fun concerts"
- "I'm bored, surprise me with something cultural"

### 3. Get Recommendations

The AI will:
1. Understand your request
2. Search through available events
3. Recommend 1-5 perfect matches
4. Show event cards you can click

### 4. View Events

Click any recommended event card to open the full event details modal.

## Example Conversation

**You:** "Find romantic events this weekend"

**AI:** "I'd love to help you find a romantic weekend experience! I found some perfect options:
- A candlelit classical music concert on Saturday
- An intimate jazz night on Sunday
- A sunset rooftop dining event

These range from £25-£45. Would you like more details about any of these?"

*(Event cards appear below the message)*

## Features

### Conversational Memory
The chatbot remembers your conversation, so you can ask follow-up questions:
- "What about something cheaper?"
- "Show me more like that"
- "Any free alternatives?"

### Smart Understanding
The AI understands:
- **Moods**: romantic, fun, energetic, cultural, relaxing, family-friendly
- **Budget**: free, under £X, affordable, luxury
- **Time**: tonight, this weekend, next week, this month
- **Categories**: concerts, sports, arts, festivals, food events
- **Location**: London, Manchester, by city name

### Event Cards
Each recommended event shows:
- Event image
- Title and category
- Date and location
- Price range
- Click to view full details

## Setup (For Deployment)

### Required Environment Variables

Already configured if you have AWS Bedrock working:
```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
```

### Deployment

The chatbot is a serverless function that will auto-deploy with Vercel:
- `api/ai/chat.ts` → `/api/ai/chat` endpoint
- Frontend component already integrated in `App.tsx`

## Files Added

```
src/components/ChatBot.tsx          # Chat UI component
api/ai/chat.ts                      # AI conversation endpoint
docs/CHATBOT.md                     # Full documentation
docs/CHATBOT_QUICK_START.md         # This file
```

## Customization

### Change Chat Position
Edit `ChatBot.tsx` line ~150:
```tsx
className="fixed bottom-6 right-6 ..."
// Change to: bottom-4 left-6 for bottom-left
```

### Change Colors
Find the gradient classes and modify:
```tsx
from-blue-600 to-purple-600  // Current gradient
from-pink-600 to-red-600     // Example: pink-red
```

### Adjust Response Style
Edit system prompt in `api/ai/chat.ts` to change AI personality:
- More formal: "You are a professional event curator..."
- More casual: "You are a fun, enthusiastic party planner..."
- More concise: "Provide brief, to-the-point recommendations..."

## Tips for Best Results

1. **Be specific**: "Show me jazz concerts under £30 this weekend" is better than "show me music"
2. **Describe mood**: "I want something romantic and intimate" helps the AI understand
3. **Set budget**: Always mention if you have a price limit
4. **Ask follow-ups**: "What about something cheaper?" or "Any family options?"
5. **Give feedback**: "That's too far away" or "Perfect, more like this!"

## Troubleshooting

### Chatbot button not showing
- Only appears on home page (not login/signup pages)
- Check browser console for errors
- Verify `ChatBot.tsx` imported in `App.tsx`

### Not getting responses
- Check AWS credentials in `.env`
- Verify IAM permissions for Bedrock
- Look at browser Network tab for `/api/ai/chat` errors

### Slow responses
- Normal: 2-3 seconds per response
- If slower, consider switching to Claude Haiku (faster, cheaper)

### No event recommendations
- AI will explain if no events match criteria
- Try broader search terms
- Check that events are loaded on home page

## Cost Estimates

**Per conversation (5-10 messages):**
- Claude 3.5 Sonnet: ~$0.02-$0.05
- Claude 3.5 Haiku: ~$0.002-$0.005

**For 1000 users/month (5 chats each):**
- Sonnet: ~$100-250/month
- Haiku: ~$10-25/month

## Next Steps

Want to enhance the chatbot? See `docs/CHATBOT.md` for:
- Adding user preference storage
- Implementing voice input
- Calendar integration
- Multi-language support
- Proactive notifications

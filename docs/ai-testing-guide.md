# AI Search Testing Guide

## ✅ Setup Complete

Your AI integration is now ready to test! Here's what has been implemented:

### What Was Installed
- ✅ `ai` - Vercel AI SDK core (v3.4.33)
- ✅ `@ai-sdk/amazon-bedrock` - Amazon Bedrock provider (v1.0.4)

### What Was Created
1. ✅ `/api/ai/search.ts` - Serverless function for AI query parsing
2. ✅ `/src/services/aiService.ts` - Frontend service layer
3. ✅ Enhanced search bar in `Header.tsx` with AI integration

---

## 🧪 Testing the AI Search

### Step 1: Open the App

The development server is running at: http://localhost:5173

Open your browser and navigate to the app.

### Step 2: Test Natural Language Queries

Try these example queries in the search bar:

#### Example 1: Romantic Events
**Query**: `romantic date night events`

**Expected Result**:
- AI detects: category = "Arts & Theatre", mood = "romantic"
- Shows message: "✨ Searching for Arts & Theatre events with a romantic vibe"
- Filters events to Arts category
- Ranks results by romantic keywords

#### Example 2: Stylish Art Show
**Query**: `stylish art show this weekend`

**Expected Result**:
- AI detects: category = "Arts & Theatre", mood = "stylish", dateRange = this weekend
- Shows message: "✨ Searching for Arts & Theatre events with a stylish vibe from Oct 26 to Oct 27"
- Filters to Arts category and weekend dates

#### Example 3: Price-Based
**Query**: `family events under £30`

**Expected Result**:
- AI detects: category = "Family", priceRange.max = 30
- Shows message: "✨ Searching for Family events under £30"
- Filters to Family category with max price £30

#### Example 4: Location + Genre
**Query**: `jazz concerts in London`

**Expected Result**:
- AI detects: category = "Music", location = "London", keywords = ["jazz"]
- Shows message: "✨ Searching for Music events in London featuring jazz"
- Filters to Music category in London

#### Example 5: Vague Query
**Query**: `something fun and cool`

**Expected Result**:
- AI detects: mood = "fun", keywords = ["fun", "cool"]
- Shows message: "✨ Searching for events with a fun vibe"
- Shows events ranked by "fun" keywords

---

## 🔍 What to Look For

### Visual Indicators

1. **AI Thinking State**
   - When you type a natural language query and hit Enter
   - You should see: "✨ AI thinking..." with a pulsing sparkle icon
   - Input should be disabled during this time

2. **AI Explanation**
   - After AI processes the query (1-2 seconds)
   - Purple/blue gradient box appears below search bar
   - Shows: "✨ Searching for [interpreted query]"
   - Automatically disappears after 5 seconds

3. **Filter Updates**
   - Check the filter dropdown - it should update based on AI interpretation
   - Category chips should reflect detected category
   - Location should update if mentioned

### Browser Console

Open DevTools (F12) → Console tab:

**Success Indicators**:
```
✅ No errors
✅ You might see: POST /api/ai/search 200 OK
```

**Potential Issues**:
```
❌ 500 Error → AWS credentials issue
❌ 405 Error → API route not found
❌ CORS Error → Vercel routing issue
```

---

## 🐛 Troubleshooting

### Issue 1: "AI thinking..." Never Completes

**Possible Causes**:
1. AWS credentials not set correctly
2. Bedrock model not enabled
3. Network error

**How to Fix**:
1. Check `.env` file has correct AWS credentials:
   ```env
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=...
   AWS_REGION=us-east-1
   ```

2. Verify credentials format:
   - Access Key ID should start with `AKIA`
   - Secret Access Key is ~40 characters
   - No quotes around values

3. Check browser Network tab:
   - Look for `/api/ai/search` request
   - Check response for error details

### Issue 2: API Route Returns 500 Error

**Check**:
1. AWS Bedrock is enabled in your region
2. IAM user has correct permissions
3. Model ID is correct: `anthropic.claude-3-5-sonnet-20240620-v1:0`

**Debug**:
```bash
# Check if API route exists
ls -la /Users/iuliamidus/Projects/Wattado1/Wattado/api/ai/search.ts

# Check environment variables
cat .env | grep AWS
```

### Issue 3: Regular Search Instead of AI

**This is expected behavior!**

AI search only triggers for:
- Queries with 3+ words, OR
- Queries containing keywords: "find", "show", "looking for", "want", "need", "romantic", "stylish", "fun", "cool"

**Examples**:
- ✅ "romantic events" → Uses AI (has "romantic" keyword)
- ✅ "show me concerts" → Uses AI (has "show" keyword)
- ✅ "something fun tonight" → Uses AI (3+ words)
- ❌ "jazz London" → Regular search (only 2 words, no keywords)

This is intentional to save AI costs for simple searches.

### Issue 4: CORS Error

If you see CORS errors in console:

**Fix**: The API route includes CORS headers, but if it persists:

1. Restart dev server:
   ```bash
   # Stop: Ctrl+C
   npm run dev
   ```

2. Clear browser cache and reload

---

## 📊 Testing Checklist

Go through this checklist to ensure everything works:

- [ ] Simple query (e.g., "jazz") → Regular search, no AI indicator
- [ ] Natural language query (e.g., "romantic date night") → Shows "AI thinking..."
- [ ] AI explanation appears after 1-2 seconds
- [ ] Filters update based on AI interpretation
- [ ] Events are filtered correctly
- [ ] AI explanation disappears after 5 seconds
- [ ] No errors in browser console
- [ ] Can search again after first query
- [ ] Fallback works if AI fails (still shows results)

---

## 🚀 Testing in Production (Vercel)

Once you deploy to Vercel, AI search will work automatically **if**:

1. ✅ AWS environment variables are set in Vercel Dashboard
2. ✅ `/api` folder is deployed with your code
3. ✅ Vercel automatically detects serverless functions

**To deploy**:
```bash
git add .
git commit -m "feat: add AI-powered search with Amazon Bedrock"
git push origin main
```

**After deployment**:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify AWS credentials are set
3. Redeploy if needed

---

## 💡 Advanced Testing

### Test AI with Different Scenarios

1. **Time-based queries**:
   - "events tonight"
   - "this weekend"
   - "next week"

2. **Mood-based queries**:
   - "something energetic"
   - "relaxing events"
   - "cultural experiences"

3. **Combined queries**:
   - "romantic jazz concerts under £50 this weekend in London"
   - "stylish art shows with elegant vibe"

4. **Vague queries**:
   - "something cool"
   - "fun things to do"
   - "I want something interesting"

### Monitor AI Behavior

Watch how AI interprets ambiguous queries:

**Query**: "something artsy"
- Should detect: category = "Arts & Theatre", keywords = ["art", "artsy"]

**Query**: "date night ideas"
- Should detect: mood = "romantic", keywords = ["date", "romantic"]

**Query**: "energetic party"
- Should detect: mood = "energetic", keywords = ["party", "energetic"]

---

## 📈 Performance Expectations

### Response Times

- **Simple query** (no AI): < 100ms
- **AI-powered query**: 1-3 seconds (waiting for Bedrock response)
- **Fallback**: < 200ms (if AI fails, uses regular search)

### Cost Per Query

- **Claude 3.5 Sonnet**: ~$0.002 per search
- **Daily usage (1000 searches)**: ~$2
- **Monthly estimate**: ~$60

---

## 🎯 Next Steps

Once basic AI search is working:

1. **Add Trending Detection** (Phase 2)
   - Create `/api/ai/trending.ts`
   - Detect cultural events like Frieze Week
   - Display trending section

2. **Optimize Costs** (Phase 3)
   - Use Claude 3 Haiku for simple queries (10x cheaper)
   - Cache frequent queries
   - Batch trending analysis

3. **Add Chatbot** (Phase 4)
   - Create chat sidebar UI
   - Implement streaming responses
   - Add conversation history

---

## 📚 Quick Reference

### Environment Variables
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
```

### API Endpoint
```
POST /api/ai/search
Body: { "query": "romantic date night events" }
Response: { "success": true, "searchParams": {...}, "explanation": "..." }
```

### Key Files
- `/api/ai/search.ts` - AI search endpoint
- `/src/services/aiService.ts` - Frontend service
- `/src/components/Header.tsx` - Search bar UI

---

## ❓ Need Help?

**Check AWS Credentials**:
```bash
# Verify credentials are set
cat .env | grep AWS
```

**Check Bedrock Status**:
1. Go to AWS Console → Bedrock
2. Check "Model access" - Claude should show "Access granted"

**Check API Route**:
```bash
curl -X POST http://localhost:5173/api/ai/search \
  -H "Content-Type: application/json" \
  -d '{"query": "romantic events"}'
```

**Still stuck?**
- Check browser console for detailed errors
- Check Network tab for API response
- Verify `.env` file is in project root
- Restart dev server

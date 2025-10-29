# Chatbot Local Development Setup

## The Issue

The chatbot uses Vercel serverless functions (`/api/ai/chat`), which don't work with the standard `npm run dev` command in local development.

## Solution: Use Vercel CLI

### 1. Install Vercel CLI (Already Done ✅)

```bash
npm install -g vercel
```

### 2. Stop Current Dev Server

Stop the server running `npm run dev` (press Ctrl+C in the terminal)

### 3. Start with Vercel Dev

```bash
vercel dev
```

This will:
- Ask you to log in to Vercel (if first time)
- Link your project to Vercel (follow prompts)
- Start the dev server with API routes working
- Usually runs on http://localhost:3000

### 4. Access Your App

- Open http://localhost:3000 (or whatever port Vercel shows)
- The chatbot will now work correctly!

## Alternative: Production Testing

If you don't want to use Vercel CLI locally, you can:

1. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

2. Test the chatbot on the production URL

## Environment Variables

Make sure your `.env` file has:
```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
```

For Vercel deployment, also add these as environment variables in the Vercel dashboard.

## Troubleshooting

**"Please login to Vercel"**
- Run `vercel login` and follow the prompts

**Port already in use**
- Stop other dev servers or use: `vercel dev --listen 3001`

**API still not working**
- Check browser console for errors
- Verify AWS credentials are set correctly
- Make sure you're accessing the Vercel dev URL, not localhost:5173

## Back to Regular Development

When you want to work on non-chatbot features:
- You can use `npm run dev` normally
- Chatbot just won't work (shows error message)
- Everything else works fine

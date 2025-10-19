# Deployment Documentation

## Overview

Wattado is deployed on **Vercel**, a cloud platform optimized for frontend frameworks and static sites. The application is built with Vite and React, resulting in a static build that Vercel serves globally via CDN.

## Current Deployment Setup

### Platform
- **Hosting**: Vercel
- **Backend**: Supabase (managed separately)
- **Domain**: Configured via Vercel (if custom domain is set)

### Vercel Configuration

The project includes a `vercel.json` configuration file:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
```

**Explanation**:
- `builds`: Tells Vercel to run the build script from `package.json` and serve from the `dist` folder
- `routes`:
  - First tries to serve static files (CSS, JS, images)
  - Falls back to `index.html` for all other routes (enables client-side routing)

## Build Process

### Local Build

```bash
# Install dependencies
npm install

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run preview
```

The build script in `package.json`:
```json
{
  "scripts": {
    "build": "tsc -b && vite build"
  }
}
```

This:
1. Compiles TypeScript (`tsc -b`)
2. Bundles the application with Vite (`vite build`)
3. Outputs to the `dist/` directory

### Build Output

After running `npm run build`, the `dist/` folder contains:

```
dist/
├── index.html           # Main HTML file
├── assets/
│   ├── index-[hash].js  # Bundled JavaScript
│   ├── index-[hash].css # Bundled CSS
│   └── [images]         # Optimized images
└── vite.svg             # Favicon
```

Vite automatically:
- Minifies JavaScript and CSS
- Adds content hashes to filenames for cache busting
- Optimizes images
- Tree-shakes unused code
- Code-splits for better performance

## Deployment Methods

### Method 1: Git Integration (Recommended)

Vercel automatically deploys when you push to your repository.

#### Initial Setup
1. Go to https://vercel.com/
2. Click **"Add New Project"**
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (or leave blank)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables (see below)
6. Click **"Deploy"**

#### Automatic Deployments
- **Production**: Deploys automatically when you push to `main` branch
- **Preview**: Deploys automatically for pull requests and other branches
- Each commit gets a unique URL for testing

### Method 2: Vercel CLI

Deploy manually using the Vercel CLI.

#### Setup
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Link project (first time only)
vercel link
```

#### Deploy
```bash
# Deploy to preview (test deployment)
vercel

# Deploy to production
vercel --prod
```

### Method 3: GitHub Actions (CI/CD)

Automate deployments with GitHub Actions.

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run type checking
        run: npm run typecheck

      - name: Run linting
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Environment Variables

### Required Variables

Set these in Vercel Dashboard (Project Settings → Environment Variables):

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_TICKETMASTER_API_KEY` | Your API key | Ticketmaster API key for fetching events |
| `VITE_SUPABASE_URL` | `https://mfwgeqcedsmmfawcosge.supabase.co` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your anon key | Supabase anonymous key (public, safe to expose) |

**Important**:
- Variables must be prefixed with `VITE_` to be exposed to the browser
- These are public keys and will be visible in the client-side bundle
- Never put service role keys or secrets in environment variables prefixed with `VITE_`

### Setting Variables in Vercel

1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: Variable name (e.g., `VITE_SUPABASE_URL`)
   - **Value**: The actual value
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**
5. Redeploy for changes to take effect

### Local Development

Create a `.env` file in the project root (already exists):

```env
# Ticketmaster API Key
VITE_TICKETMASTER_API_KEY=your_key_here

# Supabase
VITE_SUPABASE_URL=https://mfwgeqcedsmmfawcosge.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Note**: `.env` is in `.gitignore` and won't be committed to Git.

## Deployment Checklist

Before deploying to production:

- [ ] All environment variables are set in Vercel
- [ ] `npm run build` succeeds locally
- [ ] `npm run typecheck` passes with no errors
- [ ] `npm run lint` passes with no errors
- [ ] Test the production build locally with `npm run preview`
- [ ] Verify Supabase connection works
- [ ] Verify Ticketmaster API connection works
- [ ] Test authentication (login/signup) works
- [ ] Test favourites functionality works
- [ ] Check browser console for errors
- [ ] Test on mobile devices

## Deployment Workflow

### Standard Development Flow

```
Local Development
    ↓ (git push to feature branch)
Preview Deployment (Vercel)
    ↓ (create pull request)
Review & Test
    ↓ (merge to main)
Production Deployment (Vercel)
```

### Branch Strategy

- **`main`**: Production-ready code, auto-deploys to production
- **Feature branches**: Auto-deploy to preview URLs for testing
- **Pull requests**: Get unique preview URLs for review

## Monitoring and Analytics

### Vercel Dashboard

Access deployment information:

1. **Deployments**: View all deployments, logs, and build output
2. **Analytics**: Traffic, performance metrics (requires Vercel Pro)
3. **Logs**: Runtime logs and errors
4. **Speed Insights**: Core Web Vitals and performance data

### Key Metrics to Monitor

- **Build Time**: Should be < 2 minutes
- **Deployment Status**: Check for failed deployments
- **Error Logs**: Monitor for runtime errors
- **Performance**: Lighthouse scores, Core Web Vitals

## Custom Domain Setup

### Add a Custom Domain

1. Go to Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Enter your domain name (e.g., `wattado.com`)
3. Follow DNS configuration instructions:
   - **Option A**: Use Vercel nameservers (easiest)
   - **Option B**: Add A/CNAME records to your DNS provider

### DNS Configuration (Option B)

Add these records to your DNS provider:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

**SSL Certificate**: Automatically provisioned by Vercel (Let's Encrypt)

## Rollbacks

If a deployment breaks production:

### Method 1: Via Vercel Dashboard
1. Go to **Deployments**
2. Find the last working deployment
3. Click **⋮** → **Promote to Production**

### Method 2: Via Git
```bash
# Revert the last commit
git revert HEAD

# Push to main
git push origin main
```

### Method 3: Via Vercel CLI
```bash
# List deployments
vercel ls

# Rollback to a specific deployment
vercel rollback [deployment-url]
```

## Build Optimization

### Current Optimizations

Already configured in `vite.config.ts`:
- Code splitting
- Tree shaking
- Minification
- CSS optimization

### Further Optimizations

#### 1. Image Optimization
Consider using Vercel's image optimization:

```typescript
// Use next/image or sharp for image optimization
import { Image } from '@unpic/react';

<Image src={event.image} alt={event.title} />
```

#### 2. Lazy Loading
Lazy load routes for better performance:

```typescript
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/HomePage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));

// Wrap in Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/account" element={<AccountPage />} />
  </Routes>
</Suspense>
```

#### 3. CDN Caching
Already handled by Vercel:
- Static assets cached at the edge
- Automatic cache invalidation on new deployments

## Troubleshooting

### Build Fails on Vercel

**Check**:
1. Build succeeds locally (`npm run build`)
2. All dependencies are in `package.json` (not just `devDependencies`)
3. TypeScript errors (`npm run typecheck`)
4. Node version matches (Vercel uses Node 18 by default)

**Fix**: Check build logs in Vercel Dashboard → Deployments → [Failed Deployment] → Build Logs

### Environment Variables Not Working

**Check**:
1. Variables are prefixed with `VITE_`
2. Variables are set for the correct environment (Production/Preview)
3. Redeploy after adding variables
4. Variables are not hardcoded in code

**Fix**: Redeploy the project after setting environment variables

### 404 Errors on Routes

**Check**:
1. `vercel.json` includes the fallback route to `index.html`
2. React Router is using `BrowserRouter` (not `HashRouter`)

**Fix**: Ensure `vercel.json` routes configuration is correct

### Supabase Connection Fails

**Check**:
1. Supabase URL and anon key are correct
2. Supabase project is active (not paused)
3. CORS is enabled in Supabase (should be by default)

**Fix**: Verify credentials in Vercel environment variables

## Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use anon key, not service role key** - Service role bypasses RLS
3. **Enable RLS on all tables** - Already done for favourites
4. **Use HTTPS only** - Vercel enforces HTTPS automatically
5. **Validate user input** - Always validate on client and server
6. **Keep dependencies updated** - Run `npm audit` regularly

## Performance Benchmarks

Target metrics:
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Total Bundle Size**: < 500KB (gzipped)

Check with:
```bash
# Build and analyze bundle
npm run build

# Preview and test with Lighthouse
npm run preview
# Open Chrome DevTools → Lighthouse → Run audit
```

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Environment Variables Guide](https://vercel.com/docs/projects/environment-variables)

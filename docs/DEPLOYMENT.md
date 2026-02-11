# Vercel Deployment Guide

This guide covers deploying YardCrop to Vercel after Supabase integration is complete.

## Prerequisites

- Supabase project set up with database and authentication
- Mapbox account with access token
- GitHub repository connected to Vercel

## Environment Variables

Add these in **Vercel Project Settings → Environment Variables**:

| Variable | Type | Source |
|----------|------|--------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Public | Mapbox Dashboard (generate new for production) |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase Project Settings → API |

Set variables for **Production**, **Preview**, and **Development** environments as needed.

## Mapbox Token Security

For production, create a new Mapbox token with URL restrictions:

1. Go to [Mapbox Account → Tokens](https://account.mapbox.com/access-tokens/)
2. Create a new token for production
3. Under "URL restrictions", add:
   - `https://your-app.vercel.app`
   - `https://your-custom-domain.com` (if applicable)

This prevents unauthorized usage of your token from other domains.

## Supabase Configuration

Ensure these settings in your Supabase project:

### Authentication Redirect URLs

In **Supabase Dashboard → Authentication → URL Configuration**, add:

```
https://your-app.vercel.app/**
https://*-your-username.vercel.app/**
```

The wildcard pattern allows Vercel preview deployments to work with auth.

### Row Level Security

Ensure RLS policies are enabled on all tables before going to production.

## Deployment Steps

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com) and click "New Project"
2. Import the GitHub repository
3. Vercel auto-detects Next.js settings

### 2. Configure Build Settings

Vercel will auto-detect these from `package.json`:

- **Build Command:** `next build --webpack`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

No changes needed - the `--webpack` flag is already in package.json.

### 3. Add Environment Variables

Add all required environment variables before the first deploy.

### 4. Deploy

Click "Deploy" - Vercel handles the rest automatically.

## Post-Deployment Verification

After deployment, verify these features work:

1. **Home page** - Map loads correctly
2. **Geocoding** - Search for "92024" and map pans to Encinitas
3. **Authentication** - Sign up/login flow completes
4. **Create listing** - Form submits and listing appears
5. **Data persistence** - Refresh page, listings remain visible

## Preview Deployments

Vercel automatically creates preview deployments for pull requests.

For previews to work properly:
- Set environment variables for the "Preview" environment
- Ensure Supabase auth allows preview URLs (wildcard pattern above)

## Optional: Security Headers

Create `vercel.json` in the project root for additional security headers:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

## Troubleshooting

### Map doesn't load

- Check `NEXT_PUBLIC_MAPBOX_TOKEN` is set in Vercel environment variables
- Verify the token has correct URL restrictions for your domain

### Authentication redirects fail

- Add your Vercel URLs to Supabase Authentication → URL Configuration
- Include both production and preview URL patterns

### Build fails

- The project uses `--webpack` flag due to mapbox-gl compatibility
- This is already configured in `package.json`, no action needed

## Related Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Webpack mode, mapbox-gl transpilation |
| `package.json` | Build scripts with --webpack flag |
| `.env.example` | Template for required environment variables |

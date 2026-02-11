# YardCrop Implementation Plan

## Overview

YardCrop is a map-based web platform for sharing surplus homegrown produce in North County San Diego. This plan breaks the MVP into pragmatic, incrementally deployable milestones, prioritizing getting the map visible early.

---

## External Services Setup

### Supabase

**Free Tier Limits** (sufficient for development and early MVP):
- 500 MB database storage
- 1 GB file storage
- 50,000 monthly active users
- 500,000 edge function invocations/month
- Unlimited API requests and realtime connections

**Key Limitation:** Projects auto-pause after 7 days of inactivity. For production, you'll need the **Pro plan ($25/month)** which removes the pause and adds daily backups.

**Setup:** Create account at [supabase.com](https://supabase.com) → New project → Save the project URL and anon key.

### Mapbox

**Free Tier:** 50,000 free map loads/month (more than enough for MVP).

**Setup:** Create account at [mapbox.com](https://mapbox.com) → Copy your default public token from the dashboard.

---

## Milestone 1: Foundation + Map (Pure Frontend)

**Goal:** A working map on screen as fast as possible, with the responsive layout structure. No backend needed.

### Tasks
1. Initialize Next.js 14+ project with App Router and TypeScript
2. Configure Tailwind CSS with YardCrop theme:
   - Garden Green: `#4A7C59`
   - Soil Brown: `#8B6F47`
   - Cream: `#FFF8F0`
   - Harvest Gold: `#D4A843`
   - Charcoal: `#2D2D2D`
   - Warm Gray: `#6B6B6B`
3. Set up Nunito font from Google Fonts
4. Integrate Mapbox GL JS via `react-map-gl`
5. Create responsive layout:
   - Desktop: 40% left panel + 60% map
   - Tablet: Full-screen map with toggle button
   - Mobile: Full-screen map with bottom tab bar (Map/List)
6. Build top navigation bar (logo placeholder, account buttons)
7. Add filter chips component (Fruit, Vegetables, Herbs, Eggs, All) - UI only, no functionality
8. Add search bar component - UI only
9. Center map on North County San Diego (lat: 33.13, lng: -117.27)
10. Add placeholder ListingCard component with hardcoded mock data (to validate card layout)

### Key Files
- `/app/layout.tsx` - Root layout with Nunito font
- `/app/page.tsx` - Home page with map
- `/components/Map.tsx` - Mapbox map component
- `/components/Layout/` - Desktop/Tablet/Mobile layouts
- `/components/FilterChips.tsx`
- `/components/SearchBar.tsx`
- `/components/ListingCard.tsx` - Static mock card
- `/tailwind.config.ts` - Custom theme

### Deliverable
Responsive layout with an interactive map of North County San Diego. Mock cards visible in side panel. No backend connection.

---

## Milestone 2: Supabase + Listings Display

**Goal:** Connect to Supabase and display real listings from the database.

### Tasks
1. Create Supabase project and add env variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
2. Create Supabase database schema:
   - Enable PostGIS extension
   - Create `profiles` table
   - Create `listings` table with PostGIS `geography` column
   - Create `flags` and `contact_reveals` tables
   - Add indexes for spatial queries
3. Create seed script with 10-15 sample listings across North County SD
4. Set up Supabase client (`/lib/supabase.ts`)
5. Generate TypeScript types from schema (`supabase gen types`)
6. Upgrade `ListingCard` component to use real data (replace mock from Milestone 1)
7. Create `ProducePin` component (with category icons)
8. Create MapContext for bounds/zoom state
9. Fetch listings within map bounds (PostGIS bounding box query)
10. Set up TanStack Query for data fetching
11. Implement map-list synchronization (click pin → highlight card)
12. Create listing detail view (slide-up sheet on mobile, panel overlay on desktop)
13. Make filter chips functional (filter by produce category)
14. Build empty state component

### Key Files
- `/lib/supabase.ts` - Supabase client
- `/lib/database.types.ts` - Auto-generated types
- `/hooks/useListings.ts` - TanStack Query hook for listings
- `/hooks/useMapBounds.ts` - Map bounds context
- `/components/ListingCard.tsx`
- `/components/ProducePin.tsx`
- `/components/ListingDetail.tsx`
- `/supabase/migrations/001_initial_schema.sql`
- `/supabase/seed.sql`

### Deliverable
Map displays pins for seed listings. Cards show in the side panel. Clicking pins/cards shows detail view. Filters work.

---

## Milestone 3: Authentication

**Goal:** Users can create accounts and log in.

### Tasks
1. Configure Supabase Auth (enable email + Google providers)
2. Create signup page (`/signup`):
   - Email, password, display name, neighborhood fields
   - Community guidelines checkbox
   - Google OAuth button
3. Create login page (`/login`) with email/password and Google
4. Create auth callback handler (`/auth/callback`)
5. Build AuthContext for session state
6. Create database trigger: auto-create profile on auth.user insert
7. Set up Next.js middleware for protected routes
8. Configure Row Level Security (RLS) policies:
   - `listings`: anyone SELECT, owner INSERT/UPDATE/DELETE
   - `profiles`: anyone SELECT public fields, owner UPDATE own
9. Add "Log In / Sign Up" to navigation (conditional on auth state)
10. Add redirect logic: `/login` → previous page after success

### Key Files
- `/app/login/page.tsx`
- `/app/signup/page.tsx`
- `/app/auth/callback/route.ts`
- `/contexts/AuthContext.tsx`
- `/middleware.ts`
- `/supabase/migrations/002_rls_policies.sql`

### Deliverable
Working authentication with email and Google. Users have profiles. Protected routes redirect to login.

---

## Milestone 4: Listing Creation

**Goal:** Growers can post their produce.

### Tasks
1. Create listing form page (`/create`):
   - Produce type dropdown (predefined list + custom)
   - Produce name input
   - Description textarea (500 char limit with counter)
   - Photo upload with preview
   - Availability selector (Now / Date Range / Recurring)
   - Pickup instructions textarea
   - Contact method toggle (Phone / Email / Both)
   - Mini-map for pin placement
2. Implement photo upload to Supabase Storage
3. Create Edge Function for thumbnail generation (400px width)
4. Build Zod validation schema (shared client/server)
5. Create Server Action for listing creation
6. Set up Supabase Realtime subscription
7. Invalidate TanStack Query cache on new listing
8. Add "Post Your Produce" button to navigation/FAB
9. Success state: show listing on map with confirmation

### Key Files
- `/app/create/page.tsx`
- `/components/ListingForm/` - Form components
- `/actions/createListing.ts` - Server Action
- `/lib/validations/listing.ts` - Zod schema
- `/supabase/functions/upload-photo/index.ts`

### Deliverable
Growers can create listings with photos. New listings appear on the map in real-time for all users.

---

## Milestone 5: Grower Dashboard

**Goal:** Growers can manage their listings.

### Tasks
1. Create dashboard page (`/dashboard`)
2. Fetch grower's own listings with contact reveal counts
3. Display listing rows: thumbnail, name, status badge, reveal count
4. Add kebab menu actions: Edit, Deactivate/Reactivate, Delete
5. Create edit listing page (`/dashboard/edit/[id]`)
6. Implement status toggling (active ↔ deactivated)
7. Add delete confirmation dialog
8. Show "Contact Info Viewed" count per listing

### Key Files
- `/app/dashboard/page.tsx`
- `/app/dashboard/edit/[id]/page.tsx`
- `/components/DashboardListingRow.tsx`
- `/actions/updateListing.ts`
- `/actions/deleteListing.ts`

### Deliverable
Growers have full control over their listings. Can edit, deactivate, or delete.

---

## Milestone 6: Contact Reveal & Trust/Safety

**Goal:** Seekers can contact growers. Moderation is in place.

### Tasks
1. Create Edge Function: `reveal-contact`
   - Increment `contact_reveal_count`
   - Insert `contact_reveals` row
   - Rate limit: 10 reveals per IP per hour
   - Return contact info
2. Implement "Show Contact Info" button behavior
3. Display phone as `tel:` link, email as `mailto:` link
4. Create report/flag modal with reason selector
5. Create Edge Function: `flag-listing`
   - Insert flag record
   - Auto-hide listing if flags ≥ 3 from unique IPs
6. Build admin page (`/admin`):
   - Flagged listings queue
   - Approve (unflag) / Remove actions
   - Basic stats: total listings, new accounts this week
7. Add admin role to your profile via SQL
8. Protect `/admin` route (require admin role)

### Key Files
- `/supabase/functions/reveal-contact/index.ts`
- `/supabase/functions/flag-listing/index.ts`
- `/app/admin/page.tsx`
- `/components/ReportModal.tsx`
- `/components/ContactReveal.tsx`

### Deliverable
Complete contact flow with analytics. Flagging and admin moderation working.

---

## Milestone 7: Polish & Launch

**Goal:** Production-ready MVP.

### Tasks
1. Configure `next-pwa` for service worker
2. Add offline indicator banner
3. Implement loading skeletons for cards
4. Add error boundaries + Sentry integration
5. Create About page (`/about`) with community guidelines
6. Performance:
   - Lazy load listing photos
   - Map pin clustering when zoomed out
   - Progressive pin loading by region
7. Accessibility audit:
   - Keyboard navigation
   - Focus indicators
   - Screen reader labels
   - Color contrast verification
8. Mobile refinements:
   - Pull-to-refresh on list view
   - Collapsible search bar
9. Set up Vercel deployment
10. Configure Plausible analytics
11. Final cross-device testing

### Deliverable
Production MVP deployed to Vercel, ready for real users.

---

## Project Structure

```
/app
  /layout.tsx
  /page.tsx                 # Home with map
  /login/page.tsx
  /signup/page.tsx
  /auth/callback/route.ts
  /create/page.tsx          # Create listing (protected)
  /listing/[id]/page.tsx    # Listing detail (SSR for SEO)
  /dashboard/page.tsx       # Grower dashboard (protected)
  /dashboard/edit/[id]/page.tsx
  /admin/page.tsx           # Admin panel (protected)
  /about/page.tsx
/components
  /Layout/
  /Map.tsx
  /ListingCard.tsx
  /ListingDetail.tsx
  /ProducePin.tsx
  /FilterChips.tsx
  /SearchBar.tsx
  /ListingForm/
  /ContactReveal.tsx
  /ReportModal.tsx
/lib
  /supabase.ts
  /database.types.ts
  /validations/
/hooks
  /useListings.ts
  /useAuth.ts
  /useMapBounds.ts
/contexts
  /AuthContext.tsx
  /MapContext.tsx
/actions
  /createListing.ts
  /updateListing.ts
  /deleteListing.ts
/supabase
  /migrations/
  /functions/
  /seed.sql
```

---

## Verification Plan

After each milestone, verify with these checks:

| Milestone | Verification |
|-----------|-------------|
| 1 | Map renders, responsive layout works on desktop/tablet/mobile |
| 2 | Pins appear on map, cards in panel, detail view opens, filters work |
| 3 | Can sign up, log in, see user state in nav, protected routes redirect |
| 4 | Can create listing with photo, appears on map for all users |
| 5 | Dashboard shows listings, can edit/deactivate/delete |
| 6 | Contact reveal works, flagging works, admin can moderate |
| 7 | PWA installable, offline banner shows, loads fast, accessible |

---

## Cost Summary

| Service | Development | Production |
|---------|-------------|------------|
| Supabase | Free | $25/month Pro (avoids auto-pause) |
| Mapbox | Free (50K loads/mo) | Free until scale |
| Vercel | Free (Hobby) | Free until scale |
| **Total** | **$0** | **$25/month** |

---

## Notes

- Apple OAuth deferred (can add later if users request)
- Milestones 1-2 prioritized to get visual results quickly
- Each milestone is independently deployable
- Seed data in Milestone 2 lets you demo before auth is built

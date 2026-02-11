# YardCrop — Software Requirements Specification

**Version:** 1.0
**Date:** February 10, 2026

---

## System Design

- **Application Type:** Progressive Web App (PWA) built as a responsive single-codebase web application
- **Rendering Strategy:** Server-side rendering (SSR) for the landing/map page to support SEO and fast initial load; client-side rendering (CSR) for interactive map interactions, filtering, and dashboard views
- **Hosting Model:** Serverless — no dedicated backend servers to manage; all backend logic handled through Supabase (database, auth, storage, edge functions) and Next.js API routes / server actions
- **Geospatial Core:** All listing data is spatially indexed; the database handles proximity queries natively using PostGIS extensions rather than calculating distances in application code
- **Real-Time Updates:** Supabase Realtime subscriptions push new/updated/deleted listings to connected clients so the map and list stay current without manual refresh
- **Image Pipeline:** Produce photos are uploaded to Supabase Storage; thumbnails are generated on upload via an edge function or image transformation service for optimized card display
- **Offline Support:** Service worker caches the app shell, map tiles, and previously loaded listings for limited offline browsing with a visible offline indicator banner

---

## Architecture Pattern

- **Pattern:** Component-based frontend with Backend-as-a-Service (BaaS)
- **Frontend:** Next.js App Router with React Server Components for initial data fetching and Client Components for interactive elements (map, filters, forms)
- **Backend:** Supabase provides the entire backend layer:
  - **Database:** PostgreSQL with PostGIS extension for geospatial queries
  - **Auth:** Supabase Auth for email/password and social login (Google, Apple)
  - **Storage:** Supabase Storage for produce photos with public read access
  - **Edge Functions:** Supabase Edge Functions (Deno) for server-side logic that shouldn't live in the client (image processing, contact reveal counting, moderation triggers)
  - **Realtime:** Supabase Realtime for live listing updates
- **API Layer:** Direct Supabase client calls from the frontend using Row Level Security (RLS) policies to enforce access control at the database level, supplemented by Next.js Server Actions for operations requiring server-side validation
- **Separation of Concerns:**
  - `/app` — Next.js pages and layouts (routing, SSR)
  - `/components` — Reusable React UI components (cards, pins, forms, filters)
  - `/lib` — Supabase client initialization, utility functions, type definitions
  - `/hooks` — Custom React hooks (useListings, useMapBounds, useAuth)
  - `/actions` — Next.js Server Actions (createListing, revealContact, flagListing)

---

## State Management

- **Global State:** React Context for lightweight global concerns only:
  - `AuthContext` — current user session, login state, grower profile
  - `MapContext` — current map bounds, center coordinates, zoom level
- **Server State:** TanStack Query (React Query) for all data fetching, caching, and synchronization:
  - Listings within map bounds (refetches on map pan/zoom)
  - Individual listing detail
  - Grower's own listings (dashboard)
  - Filter and search results
- **Local Component State:** React useState/useReducer for:
  - Active filter chip selection
  - Search input value
  - Form field values and validation state
  - UI toggles (panel open/closed, detail view visible, contact revealed)
- **Real-Time Sync:** Supabase Realtime channel subscriptions invalidate TanStack Query caches when listings are created, updated, or deleted, triggering automatic UI refresh
- **URL State:** Filter selections and map position are reflected in URL query parameters (e.g., `?category=fruit&lat=33.12&lng=-117.32&zoom=13`) to support shareable links and browser back/forward navigation

---

## Data Flow

- **Map Browse Flow:**
  1. User opens app → Next.js SSR fetches initial listings near detected/default location via Supabase PostGIS query
  2. Map renders with pins; card panel renders with listing cards
  3. User pans/zooms map → MapContext updates bounds → TanStack Query refetches listings within new bounds → pins and cards update
  4. Supabase Realtime pushes new/changed listings → TanStack Query cache invalidates → UI updates automatically

- **Filter/Search Flow:**
  1. User taps filter chip or types in search bar → local state updates → URL params update
  2. TanStack Query fetches filtered results from Supabase (PostGIS spatial filter + category/text filter combined in one query)
  3. Map pins and card list re-render with filtered results

- **Listing Creation Flow:**
  1. Grower taps "Post Your Produce" → auth check (redirect to login if needed)
  2. Grower fills form → client-side validation on each field
  3. Submit triggers Next.js Server Action → validates server-side → uploads photo to Supabase Storage → inserts listing row with PostGIS point geometry into Supabase DB
  4. Supabase Realtime broadcasts new listing → all connected clients see the new pin appear

- **Contact Reveal Flow:**
  1. Seeker taps "Show Contact Info" → client calls Supabase Edge Function
  2. Edge Function increments the `contact_reveal_count` on the listing and returns contact details
  3. Client displays phone/email; analytics counter updates for grower dashboard

- **Flag/Report Flow:**
  1. User taps "Report this listing" → selects reason → client calls Supabase Edge Function
  2. Edge Function inserts a flag record linked to the listing
  3. If flag count exceeds threshold, listing is auto-hidden pending admin review

---

## Technical Stack

- **Frontend Framework:** Next.js 14+ (App Router)
- **UI Library:** React 18+
- **Language:** TypeScript
- **Styling:** Tailwind CSS (custom theme with YardCrop color palette)
- **Map Library:** Mapbox GL JS via react-map-gl (supports custom map styles for the earthy/organic aesthetic, marker clustering, and smooth interactions)
- **State/Data Fetching:** TanStack Query v5
- **Forms:** React Hook Form + Zod (schema validation shared between client and server)
- **Backend-as-a-Service:** Supabase
  - PostgreSQL 15+ with PostGIS extension
  - Supabase Auth
  - Supabase Storage
  - Supabase Realtime
  - Supabase Edge Functions (Deno runtime)
- **Image Optimization:** Next.js Image component + Supabase Storage image transformations
- **PWA:** next-pwa for service worker generation and caching strategies
- **Hosting/Deployment:** Vercel (Next.js optimized, automatic preview deploys, edge network)
- **Analytics:** Plausible or PostHog (privacy-friendly, no cookie banners needed)
- **Error Monitoring:** Sentry
- **Type Generation:** Supabase CLI `gen types` for auto-generated TypeScript types from the database schema

---

## Authentication Process

- **Provider:** Supabase Auth
- **Methods:**
  - Email + password (primary)
  - Google OAuth
  - Apple OAuth
- **Flow:**
  1. User taps "Sign Up" → presented with email/password form and social login buttons
  2. Email signup: user enters email, password, display name, neighborhood → Supabase creates auth user → trigger inserts a `profiles` row with display name and neighborhood
  3. Social signup: OAuth redirect → Supabase creates auth user → on first login, user is prompted to complete profile (display name, neighborhood) before they can post
  4. Email confirmation: Supabase sends verification email → user clicks link → account activated
  5. Login: email/password or social OAuth → Supabase returns JWT session token → stored in secure HTTP-only cookie via Next.js middleware
- **Session Management:**
  - Supabase client auto-refreshes JWT tokens
  - Next.js middleware checks session on protected routes (create listing, dashboard)
  - Session state exposed to client via AuthContext
- **Authorization (Row Level Security):**
  - `listings` table: anyone can SELECT; only authenticated owner can INSERT, UPDATE, DELETE their own rows
  - `profiles` table: anyone can SELECT public fields (display name, neighborhood); only owner can UPDATE their own row
  - `flags` table: anyone can INSERT (to report); only admins can SELECT
  - `contact_reveals` table: INSERT via Edge Function only; grower can SELECT counts for their own listings
- **Protected Actions:**
  - Creating a listing → requires authenticated session
  - Editing/deleting a listing → requires authenticated session + ownership match
  - Viewing grower dashboard → requires authenticated session
  - Browsing map, viewing listings, revealing contact info → no auth required

---

## Route Design

- **`/`** — Home page with map and listing panel (SSR with initial listings)
- **`/listing/[id]`** — Listing detail page (SSR for SEO; also accessible as an overlay from the map view)
- **`/create`** — Create new listing form (protected: requires auth)
- **`/dashboard`** — Grower dashboard with listing management (protected: requires auth)
- **`/dashboard/edit/[id]`** — Edit existing listing (protected: requires auth + ownership)
- **`/login`** — Login page with email/password and social options
- **`/signup`** — Sign up page with profile creation
- **`/auth/callback`** — OAuth callback handler (Supabase auth redirect)
- **`/admin`** — Admin moderation panel (protected: requires admin role)
- **`/about`** — Static page with community guidelines and project info
- **Middleware Protection:**
  - `/create`, `/dashboard`, `/dashboard/*` → redirect to `/login` if no session
  - `/admin` → redirect to `/` if no admin role
  - `/login`, `/signup` → redirect to `/` if already authenticated

---

## API Design

All data access uses the Supabase client library with RLS enforcement. Edge Functions handle operations requiring server-side logic.

### Supabase Client Queries (Frontend → Database via RLS)

- **`GET listings`** — Fetch listings within map bounds
  - Params: `sw_lat`, `sw_lng`, `ne_lat`, `ne_lng`, `category?`, `search?`
  - Uses PostGIS `ST_Within` to filter by bounding box
  - Returns: array of listing objects with grower profile joined
- **`GET listings/:id`** — Fetch single listing detail
  - Returns: full listing object with grower profile
- **`POST listings`** — Create new listing (via Server Action)
  - Body: `produce_type`, `description`, `photo_url`, `availability_type`, `availability_start`, `availability_end`, `availability_schedule`, `pickup_instructions`, `contact_method`, `contact_phone?`, `contact_email?`, `latitude`, `longitude`
  - Validates with Zod schema server-side
- **`PATCH listings/:id`** — Update listing (via Server Action)
  - Body: partial listing fields
  - RLS enforces ownership
- **`DELETE listings/:id`** — Delete listing
  - RLS enforces ownership
- **`GET profiles/me/listings`** — Fetch current grower's listings with contact reveal counts
  - Used by dashboard

### Supabase Edge Functions

- **`POST /functions/v1/reveal-contact`**
  - Body: `{ listing_id }`
  - Increments `contact_reveal_count` on listing
  - Returns: `{ contact_method, phone?, email? }`
  - Rate limited: max 10 reveals per IP per hour
- **`POST /functions/v1/flag-listing`**
  - Body: `{ listing_id, reason }`
  - Inserts flag record
  - If flags >= 3 from unique users, auto-hides listing (`status = 'flagged'`)
  - Returns: `{ success: true }`
- **`POST /functions/v1/upload-photo`**
  - Body: multipart form with image file
  - Resizes to max 1200px wide, generates 400px thumbnail
  - Uploads both to Supabase Storage
  - Returns: `{ photo_url, thumbnail_url }`

### Supabase Realtime Channels

- **`listings:map`** — Subscribe to INSERT, UPDATE, DELETE on listings table filtered by geographic region
  - Client subscribes with current map bounds
  - On event, TanStack Query cache is invalidated for the listings query

---

## Database Design ERD

### Tables

#### `auth.users` (Managed by Supabase Auth)
- `id` — UUID, PK
- `email` — text, unique
- `encrypted_password` — text
- `created_at` — timestamptz
- `updated_at` — timestamptz

#### `profiles`
- `id` — UUID, PK, FK → auth.users.id (ON DELETE CASCADE)
- `display_name` — text, NOT NULL
- `neighborhood` — text, NOT NULL
- `avatar_url` — text, nullable
- `role` — text, DEFAULT 'grower' (values: 'grower', 'admin')
- `created_at` — timestamptz, DEFAULT now()
- `updated_at` — timestamptz, DEFAULT now()

#### `listings`
- `id` — UUID, PK, DEFAULT gen_random_uuid()
- `grower_id` — UUID, FK → profiles.id (ON DELETE CASCADE)
- `produce_type` — text, NOT NULL (values: 'fruit', 'vegetable', 'herb', 'eggs', 'other')
- `produce_name` — text, NOT NULL
- `description` — text, max 500 chars
- `photo_url` — text, nullable
- `thumbnail_url` — text, nullable
- `availability_type` — text, NOT NULL (values: 'now', 'date_range', 'recurring')
- `availability_start` — date, nullable
- `availability_end` — date, nullable
- `availability_schedule` — text, nullable (free text for recurring, e.g., "Saturdays 9am-12pm")
- `pickup_instructions` — text, NOT NULL
- `contact_method` — text, NOT NULL (values: 'phone', 'email', 'both')
- `contact_phone` — text, nullable
- `contact_email` — text, nullable
- `location` — geography(Point, 4326), NOT NULL (PostGIS point)
- `latitude` — numeric, NOT NULL (denormalized for easy frontend access)
- `longitude` — numeric, NOT NULL (denormalized for easy frontend access)
- `status` — text, DEFAULT 'active' (values: 'active', 'deactivated', 'flagged', 'expired')
- `contact_reveal_count` — integer, DEFAULT 0
- `created_at` — timestamptz, DEFAULT now()
- `updated_at` — timestamptz, DEFAULT now()

#### `flags`
- `id` — UUID, PK, DEFAULT gen_random_uuid()
- `listing_id` — UUID, FK → listings.id (ON DELETE CASCADE)
- `reporter_ip` — text, NOT NULL (hashed for privacy)
- `reason` — text, NOT NULL (values: 'spam', 'inappropriate', 'misleading', 'safety', 'other')
- `notes` — text, nullable
- `resolved` — boolean, DEFAULT false
- `resolved_by` — UUID, FK → profiles.id, nullable
- `created_at` — timestamptz, DEFAULT now()

#### `contact_reveals`
- `id` — UUID, PK, DEFAULT gen_random_uuid()
- `listing_id` — UUID, FK → listings.id (ON DELETE CASCADE)
- `ip_hash` — text, NOT NULL
- `created_at` — timestamptz, DEFAULT now()

### Indexes

- `listings_location_idx` — GIST index on `listings.location` (spatial queries)
- `listings_grower_id_idx` — B-tree on `listings.grower_id` (dashboard queries)
- `listings_status_idx` — B-tree on `listings.status` (filter active listings)
- `listings_produce_type_idx` — B-tree on `listings.produce_type` (category filtering)
- `flags_listing_id_idx` — B-tree on `flags.listing_id` (flag count aggregation)
- `contact_reveals_listing_id_idx` — B-tree on `contact_reveals.listing_id` (count queries)

### Relationships

```
auth.users 1 ──── 1 profiles
profiles   1 ──── * listings
listings   1 ──── * flags
listings   1 ──── * contact_reveals
profiles   1 ──── * flags (resolved_by)
```

### Database Functions (PostgreSQL)

- **`listings_within_bounds(sw_lat, sw_lng, ne_lat, ne_lng)`** — Returns active listings within a geographic bounding box using PostGIS `ST_MakeEnvelope` and `ST_Within`
- **`listings_search(query, sw_lat, sw_lng, ne_lat, ne_lng, category?)`** — Full-text search on `produce_name` and `description` combined with spatial filtering
- **`increment_contact_reveal(listing_id)`** — Atomically increments `contact_reveal_count` and inserts a `contact_reveals` row
- **`auto_flag_listing()`** — Trigger function that sets `status = 'flagged'` when flag count from unique reporters reaches 3
- **`expire_stale_listings()`** — Scheduled cron function (pg_cron) that sets `status = 'expired'` on listings past their `availability_end` date

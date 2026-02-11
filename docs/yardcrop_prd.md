# YardCrop — Product Requirements Document

**Version:** 1.0
**Date:** February 9, 2026
**Product Owner:** Tom Schuck

---

## 1. Elevator Pitch

YardCrop is a free, map-based web platform that makes it effortless for residential growers to share surplus homegrown produce with their neighbors. Launching in North County San Diego, YardCrop turns the age-old problem of fruit rotting on the tree and tomatoes piling up on the counter into frictionless neighborhood generosity. Growers post what they have available, neighbors browse a live map to see what's growing nearby, and connections happen directly — no middleman, no fees, no friction. Think of it as a neighborhood produce stand that lives in your pocket.

---

## 2. Who Is This App For

### Primary Users

- **Growers (Posters):** Residential gardeners and fruit tree owners in North County San Diego who regularly have more produce than they can use. Many are retirees or long-time homeowners with established gardens. They need a dead-simple way to let neighbors know what's available without the overhead of Facebook groups or Nextdoor posts.

- **Seekers (Browsers):** Neighbors who want access to fresh, hyperlocal produce. They range from young families looking for organic fruit to curious neighbors who just want to know what's growing around them. They don't want to create an account just to look around.

### Key Demographics

- **Age range:** Skews older for growers (50+), broader for seekers
- **Tech comfort:** Varies widely — the platform must be simple enough for seniors who are not tech-savvy
- **Geography:** Year 1 targets five North County San Diego cities (Carlsbad, Encinitas, Oceanside, Vista, San Marcos)

### User Characteristics

- Motivated by generosity and community, not commerce
- Familiar with neighbor-to-neighbor exchange culture (Buy Nothing groups, fruit left on curbs)
- May access from phone while walking the neighborhood or from desktop at home

---

## 3. Functional Requirements

### 3.1 Map-Based Discovery

- Interactive map displays pins for all active produce listings
- Map auto-detects user's location on load with manual override (search bar or drag)
- Pins are color-coded or icon-coded by produce category (fruit, vegetables, herbs, etc.)
- Clicking a pin opens a listing detail card
- No account required to browse the map or view listings

### 3.2 Grower Accounts & Posting

- Growers must create an account to post (email + password, or social login)
- Account creation collects: display name, general neighborhood (not exact address), and optional profile photo
- Growers can create, edit, and deactivate their own listings

### 3.3 Listing Creation

Each listing includes:

- **Produce type** (selected from a predefined list + custom option)
- **Description** (free text — quantity, ripeness, variety, etc.)
- **Photo** (optional but encouraged)
- **Availability window** (e.g., "Available now," date range, or recurring like "Saturdays 9am–12pm")
- **Pickup instructions** (free text — "On the curb at 123 Oak St," "Text me first," etc.)
- **Preferred contact method** (grower chooses per listing: phone, email, or both)
- **Map pin location** (grower places pin; can be approximate for privacy)

### 3.4 Contact Flow

- Seekers view grower's chosen contact method on the listing detail card
- No in-app messaging for MVP — contact happens externally via phone or email
- Contact info is only revealed after a "Show Contact" tap (lightweight friction to reduce spam)

### 3.5 Trust & Safety (Lightweight)

- Growers can flag or remove inappropriate listings
- Simple reporting mechanism for seekers (flag a listing)
- Admin moderation queue for flagged content
- Community guidelines displayed during account creation
- Rate limiting on account creation to prevent spam

### 3.6 Search & Filtering

- Filter by produce category (fruit, vegetables, herbs, eggs, other)
- Filter by availability (available now vs. upcoming)
- Search by produce name (e.g., "avocado," "Meyer lemon")
- Distance radius filter from current/selected location

### 3.7 Notifications (Post-MVP Consideration)

- Optional email alerts when new produce is posted in a seeker's area
- Grower reminders to update or deactivate stale listings

---

## 4. User Stories

### Grower Stories

1. **As a grower**, I want to create an account quickly so I can start posting my surplus produce without a lengthy onboarding process.

2. **As a grower**, I want to create a listing with a photo, description, and my preferred contact method so neighbors know exactly what I have and how to reach me.

3. **As a grower**, I want to set an availability window on my listing so people don't show up when I'm not ready.

4. **As a grower**, I want to place my map pin at an approximate location so I can share produce without revealing my exact home address.

5. **As a grower**, I want to deactivate a listing when my produce runs out so I don't get contacted for something I no longer have.

6. **As a grower**, I want to manage multiple active listings because I might have oranges, tomatoes, and herbs available at the same time.

### Seeker Stories

7. **As a seeker**, I want to open the app and immediately see a map of nearby produce without creating an account or logging in.

8. **As a seeker**, I want to tap a map pin and see the produce details, photo, and pickup instructions so I can decide if I'm interested.

9. **As a seeker**, I want to filter by produce type so I can quickly find what I'm looking for.

10. **As a seeker**, I want to tap "Show Contact" to see the grower's phone number or email so I can arrange pickup.

11. **As a seeker**, I want to flag a listing that looks suspicious or inappropriate so the community stays trustworthy.

### Admin Stories

12. **As an admin**, I want to review flagged listings and take action (remove, warn, ban) to keep the platform safe and useful.

13. **As an admin**, I want to see basic analytics (active listings, new accounts, popular produce) to understand platform health.

---

## 5. User Interface

### 5.1 Design Philosophy

- **Earthy and organic** aesthetic — natural greens, warm browns, cream backgrounds, soft textures
- Typography that feels friendly and approachable (rounded sans-serif or handwritten accents)
- Photography-forward design that showcases real produce
- Senior-friendly: large tap targets, high contrast text, clear labels, minimal nesting
- Responsive design that works equally well on mobile and desktop

### 5.2 Key Screens

#### Home / Map View (Default)

- Full-screen interactive map with produce pins
- Floating search bar at top for location or produce search
- Filter chips below search bar (Fruit, Vegetables, Herbs, Eggs, All)
- Bottom sheet or sidebar (desktop) for listing cards when browsing
- "Post Your Produce" call-to-action button (prominent but not intrusive)
- Location auto-detect prompt on first visit

#### Listing Detail Card

- Produce photo (large, top of card)
- Produce name and type badge
- Grower display name and neighborhood
- Description text
- Availability window
- Pickup instructions
- "Show Contact Info" button (reveals phone/email based on grower preference)
- Flag/report link (small, bottom of card)

#### Create Listing (Growers Only)

- Simple single-page form (no multi-step wizard)
- Produce type dropdown with search
- Description text area with character limit and helper text
- Photo upload with camera option on mobile
- Availability selector (available now / date range / recurring schedule)
- Pickup instructions text area
- Contact method toggle (phone / email / both) with input fields
- Map pin placement (draggable pin on mini-map)
- "Post" button

#### Grower Dashboard

- List of active and past listings with status indicators
- Quick actions: edit, deactivate, reactivate, delete
- Basic stats: number of "Show Contact" taps per listing
- Account settings link

#### Sign Up / Log In

- Minimal form: email, password, display name, neighborhood
- Social login options (Google, Apple)
- Community guidelines acceptance checkbox
- No CAPTCHA unless spam is detected (progressive security)

### 5.3 Responsive Behavior

- **Mobile:** Map is full-screen, listings appear as bottom sheets, navigation via hamburger menu
- **Desktop:** Map takes 60% of screen, listing sidebar takes 40%, top navigation bar
- **Tablet:** Hybrid layout adapting between mobile and desktop

### 5.4 Brand Elements

- **Primary colors:** Garden green (#4A7C59), soil brown (#8B6F47), cream (#FFF8F0)
- **Accent:** Harvest gold (#D4A843) for CTAs and highlights
- **Logo:** "YardCrop" wordmark with a simple leaf or sprout motif
- **Tone of voice:** Neighborly, warm, casual — "What's growing near you?"

---

## Appendix: MVP Scope & Constraints

- **Geography:** Five North County San Diego cities (Carlsbad, Encinitas, Oceanside, Vista, San Marcos)
- **Platform:** Responsive web application (no native apps for MVP)
- **Year 1 goals:** 100+ active growers, 500+ seekers
- **User acquisition:** Founder-led grassroots distribution — business cards with QR codes to homes with visible gardens
- **Monetization:** None for MVP — free platform focused on adoption
- **No in-app messaging:** Contact happens externally to keep the platform simple and reduce moderation burden

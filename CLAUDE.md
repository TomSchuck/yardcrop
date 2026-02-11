# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (uses --webpack for Mapbox compatibility)
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Start production server
```

**Note:** This project uses `--webpack` flag instead of Turbopack due to compatibility issues with mapbox-gl and react-map-gl.

## Architecture Overview

YardCrop is a map-based produce sharing platform for North County San Diego, built with Next.js 16 App Router.

### State Management

All listing state is managed via React Context (`src/contexts/ListingsContext.tsx`):
- Provides `useListings()` hook for accessing/mutating listings
- Handles CRUD operations, filtering, and distance calculations
- Tracks user-created vs mock listings via `isUserCreated` flag
- Wrapped at app root via `src/app/providers.tsx`

### Routing

- `/` - Home (map + listing browser with responsive layout)
- `/create` - Create listing form
- `/dashboard` - User's listings (session-created only)
- `/dashboard/edit/[id]` - Edit listing

### Key Technical Decisions

**Mapbox Integration:** Uses `react-map-gl/mapbox` with dynamic import (`ssr: false`) to avoid SSR issues. Map centers on North County SD (33.13, -117.27). Geocoding for address/zip search uses Mapbox Geocoding API v5 via `src/lib/geocoding.ts`, with results bounded to San Diego County.

**Mock Data Layer:** Currently no backend. `src/lib/mock-data.ts` contains sample listings, `src/lib/mock-api.ts` provides async functions mimicking API calls. Context methods are designed for easy swap to real backend.

**Responsive Design:** Mobile uses tab bar navigation (Map/List views), desktop uses split-panel layout (40% sidebar + 60% map). Breakpoints: md (768px), lg (1024px).

### Type System

Core types in `src/lib/types.ts`:
- `Listing` - Full listing with all fields including dashboard flags (`isActive`, `isUserCreated`, `contactRevealCount`)
- `ListingCardData` - Subset for card/map display
- `CreateListingInput` - Form input type (omits auto-generated fields)
- `ProduceType` - "fruit" | "vegetables" | "herbs" | "eggs" | "other"

### Styling

Tailwind CSS v4 with custom theme colors defined in `src/app/globals.css`:
- Primary: `garden-green` (#4A7C59)
- Accent: `harvest-gold` (#D4A843)
- Background: `cream` (#FFF8F0), `soft-white` (#FFFFFF)
- Text: `charcoal` (#2D2D2D), `warm-gray` (#6B6B6B)

Font: Nunito (Google Fonts) configured in layout.tsx.

### Environment Variables

Required: `NEXT_PUBLIC_MAPBOX_TOKEN` - Mapbox public access token for map rendering.

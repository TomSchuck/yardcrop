# YardCrop — User Interface Design Document

**Version:** 1.0
**Date:** February 10, 2026
**Design Direction:** The Garden Grid

---

## Layout Structure

### Overall Architecture

The application follows a map-plus-panel layout inspired by Airbnb's search experience. The map is always present as the primary orientation tool, with a companion panel that displays listing cards. A persistent top navigation bar anchors the experience across all views.

### Desktop Layout (1024px+)

The screen is divided into two zones. The left panel occupies approximately 40% of the viewport and contains the search bar, filter chips, and a vertically scrollable grid of listing cards arranged in two columns. The right 60% is a full-height interactive map with produce pins. The top navigation bar spans the full width and contains the YardCrop logo on the left, a centered tagline area ("What's growing near you?"), and account actions on the right (Log In / Sign Up, or Grower Dashboard if logged in). The left panel and map are synchronized — scrolling through cards highlights the corresponding pin, and clicking a pin scrolls to and highlights the corresponding card.

### Tablet Layout (768px–1023px)

The layout shifts to a stacked toggle. The default view is the full-screen map with a floating "Show List" button at the bottom. Tapping it slides up a half-screen panel of listing cards in a single-column grid. The panel can be dragged to full screen or dismissed back to map-only. The top navigation bar condenses the tagline away but keeps logo and account actions visible.

### Mobile Layout (below 768px)

The default view is a full-screen map with a persistent bottom bar containing two tabs: Map and List. The Map tab shows the interactive map with a floating search bar at the top and filter chips below it. The List tab shows a single-column scrollable feed of listing cards sorted by distance. A floating "Post Your Produce" button sits above the bottom bar in the lower-right corner, styled as a circular action button with a plus icon. The top navigation bar simplifies to the logo on the left and a hamburger menu on the right containing account actions and settings.

### Listing Detail View

On desktop, clicking a listing card expands it into a wider detail panel that overlays the left sidebar, pushing the card grid behind it. The map remains visible and centers on the selected listing's pin. On mobile and tablet, the detail view slides up as a full-screen sheet over the map with a back arrow to return. The detail view stacks content vertically: large produce photo at top, produce name and type badge, grower display name with neighborhood label, description text, availability badge, pickup instructions, and a prominent "Show Contact Info" button. A small "Report this listing" text link sits at the bottom.

### Create Listing View

A single-page form accessed from the "Post Your Produce" button. On desktop it appears as a centered modal overlay (max-width 600px) over the dimmed map and panel. On mobile it is a full-screen view. The form flows top to bottom: produce type selector, description field, photo upload area, availability selector, pickup instructions field, contact method toggles with corresponding input fields, and a mini-map for pin placement at the bottom. A sticky "Post Listing" button sits at the bottom of the form on mobile, or at the bottom of the modal on desktop.

### Grower Dashboard

Accessible from the account menu. On desktop it replaces the left panel content while keeping the map visible showing only the grower's own listing pins. On mobile it is a full-screen view. The dashboard is a simple list of the grower's listings, each row showing a thumbnail photo, produce name, status badge (Active, Expired, Deactivated), and a count of "Show Contact" taps. Each row has a kebab menu (three dots) with options: Edit, Deactivate/Reactivate, Delete.

---

## Core Components

### Produce Pin

A circular map marker with a small icon representing the produce category (fruit, vegetable, herb, egg, other). The pin uses a white circle with a colored border matching the produce category. On hover (desktop) or tap, the pin elevates slightly and shows a mini tooltip with the produce name and a thumbnail photo.

### Listing Card

A white card with rounded corners (8px radius) containing: a landscape-oriented produce photo filling the top half, a produce type badge (small colored pill) overlaid on the lower-left corner of the photo, the produce name in bold below the photo, the grower's display name and neighborhood in lighter text, a distance indicator (e.g., "0.3 mi away"), and an availability badge. Cards have a subtle shadow that deepens on hover to indicate interactivity.

### Filter Chips

Horizontally scrollable row of pill-shaped buttons: All, Fruit, Vegetables, Herbs, Eggs, Other. The active filter uses a filled background in garden green with white text. Inactive filters use a cream background with dark text and a thin border. On mobile the row is swipeable; on desktop all chips are visible.

### Search Bar

A single input field with a magnifying glass icon on the left and a subtle location pin icon on the right. Placeholder text reads "Search produce or neighborhood..." The search bar has a cream background with rounded corners and a thin border that highlights in garden green on focus.

### Availability Badge

A small pill-shaped label on each listing card. "Available Now" uses a green background. A date range or schedule uses a harvest gold background. "Claimed" or expired listings use a muted gray background.

### Show Contact Button

The primary call-to-action on the listing detail view. A full-width button in harvest gold with dark text reading "Show Contact Info." After tapping, it reveals the grower's chosen contact method (phone number as a clickable tel: link, email as a clickable mailto: link, or both) and the button text changes to "Contact Info" with the details displayed below it.

### Post Your Produce Button

On desktop, a standard rectangular button in harvest gold sitting in the top navigation bar. On mobile, a circular floating action button (56px diameter) in harvest gold with a white plus icon, positioned in the lower-right corner above the bottom tab bar.

### Grower Profile Badge

A compact element shown on listing cards and detail views: a small circular avatar (or default leaf icon if no photo), the display name, and the neighborhood name. No ratings or verification badges for MVP.

---

## Interaction Patterns

### Map and List Synchronization

On desktop, the map and card panel are linked. Scrolling through cards does not move the map, but clicking a card centers the map on that pin and highlights it with an expanded state. Clicking a map pin scrolls the card panel to the corresponding card and highlights it with a green left-border accent. When the user pans or zooms the map, the card panel updates to show only listings visible within the current map bounds, with a subtle loading indicator during the refresh.

### Browse Without Account

The full map, all listing cards, and all listing details are accessible without any account. The only gated action is "Show Contact Info," which reveals contact details without requiring login but adds a single-tap friction barrier. Posting requires login, and tapping "Post Your Produce" while logged out redirects to the sign-up/login flow, then returns the user to the create listing form.

### Listing Creation Flow

The grower taps "Post Your Produce," fills out the single-page form top to bottom, places a pin on the mini-map by tapping/clicking the desired location (defaults to their detected location), and taps "Post Listing." A brief success confirmation appears ("Your listing is live!") with a link to view it on the map. The form validates in real-time: produce type is required, description has a 500-character limit with a visible counter, and at least one contact method must be provided.

### Contact Reveal

Tapping "Show Contact Info" on a listing detail immediately reveals the grower's contact info below the button with no login required. This tap is counted for the grower's dashboard analytics. On mobile, phone numbers are tappable to initiate a call, and email addresses open the default mail client.

### Filtering and Search

Tapping a filter chip immediately updates both the map pins and the card list to show only matching produce categories. Multiple filters are not stacked — selecting a new chip replaces the previous selection, with "All" resetting. The search bar supports free-text search across produce names, descriptions, and neighborhoods. Search results update the map and card list as the user types, with a short debounce delay.

### Pull to Refresh

On mobile, pulling down on the list view triggers a refresh of listings. On the map view, panning or zooming automatically refreshes visible listings.

### Empty States

If no listings exist in the current map view, the card panel shows a friendly illustration of an empty garden with the text "No produce posted nearby yet. Know a neighbor with a garden? Share YardCrop with them!" with a share button. If search or filter returns no results, the panel shows "No [produce type] found nearby. Try zooming out or clearing your filters."

---

## Visual Design Elements & Color Scheme

### Color Palette

- **Garden Green** (#4A7C59) — Primary brand color. Used for the top navigation bar background, active filter chips, map pin borders, focus states, and selected/highlighted card accents.
- **Soil Brown** (#8B6F47) — Secondary color. Used for grower profile elements, neighborhood labels, and secondary text that needs warmth.
- **Cream** (#FFF8F0) — Page background, card backgrounds, and input field backgrounds. Provides a warm off-white that avoids the clinical feel of pure white.
- **Harvest Gold** (#D4A843) — Accent and CTA color. Used for the "Post Your Produce" button, "Show Contact Info" button, availability badges, and interactive highlights.
- **Soft White** (#FFFFFF) — Listing cards and modal backgrounds, providing contrast against the cream page background.
- **Charcoal** (#2D2D2D) — Primary text color for headings and body copy.
- **Warm Gray** (#6B6B6B) — Secondary text, distance indicators, timestamps, and placeholder text.
- **Error Red** (#C0392B) — Form validation errors and report/flag actions.
- **Success Green** (#27AE60) — "Available Now" badges and success confirmations.

### Visual Texture and Feel

The overall aesthetic is clean and modern but warmed by natural color choices and organic touches. Card corners are gently rounded (8px). Shadows are soft and minimal (0 2px 8px rgba(0,0,0,0.08)) to create subtle depth without harshness. The map uses a muted, natural-toned map style (similar to Google Maps' terrain or Mapbox's outdoors style) rather than the default bright blue-and-white. Photography is the primary visual content — large, appetizing produce photos dominate listing cards and detail views. Where illustrations are used (empty states, onboarding), they follow a simple, hand-drawn line-art style in garden green and soil brown.

### Iconography

Icons are simple line-style (not filled) in a consistent 24px size, drawn with rounded stroke caps to feel friendly. Produce category icons are slightly more detailed to be recognizable at map-pin size: a simple apple for fruit, a carrot for vegetables, a leaf sprig for herbs, an egg for eggs, and a basket for other. All icons use garden green or charcoal depending on context.

### Borders and Dividers

Borders are used sparingly. Cards rely on shadow rather than borders for separation. When borders appear (input fields, inactive filter chips), they use a light warm gray (#E0D8CF) at 1px. Dividers between listing cards in list view are thin (1px) horizontal lines in the same warm gray, with generous vertical spacing (16px) between cards.

---

## Mobile, Web App, Desktop Considerations

### Mobile (below 768px)

The experience is optimized for one-handed use. The bottom tab bar (Map / List) is the primary navigation, with thumb-reachable tap targets. The floating "Post" button sits in the natural thumb zone (lower-right). All interactive elements meet a minimum 48px tap target size. The listing detail view is a full-screen slide-up sheet with a prominent back arrow. Photo uploads offer both camera capture and gallery selection. Phone numbers in contact info are tappable tel: links. The search bar collapses to an icon when not in use to maximize map visibility, expanding on tap. Filter chips are horizontally scrollable with the active chip auto-scrolled into view.

### Tablet (768px–1023px)

A transitional layout that uses the full-screen map as default with a toggleable list panel. The panel slides up from the bottom and can be dragged between half-screen and full-screen positions. Listing detail overlays the panel at full height. The "Post Your Produce" button moves to the top navigation bar (visible space allows it). Two-column card grid when the panel is at full height, single column at half height.

### Desktop (1024px+)

The side-by-side map-and-panel layout provides the richest browsing experience. Hover states on cards and pins provide visual feedback. The listing detail panel slides over the card grid as an overlay within the left panel, keeping the map always visible for spatial context. Keyboard navigation is supported: Tab through cards, Enter to open detail, Escape to close. The search bar is always visible and expanded. All filter chips display without scrolling.

### Progressive Web App Considerations

The site should be built as a responsive web app with PWA capabilities. A service worker caches the app shell and map tiles for faster repeat loads. On mobile browsers, a subtle "Add to Home Screen" prompt appears after the second visit. The app works offline in a limited capacity: previously loaded listings and map tiles are viewable, with a banner indicating "You're offline — some listings may be outdated."

### Performance

Map pins load progressively as the user pans, with clustering for zoomed-out views (e.g., "12 listings" cluster badge). Listing card photos use lazy loading and are served in responsive sizes (thumbnail for cards, full-size for detail view). The initial map load prioritizes the user's immediate area (5-mile radius) before loading surrounding regions.

---

## Typography

### Font Selection

- **Primary Font:** "Nunito" — a rounded sans-serif from Google Fonts. Its soft, rounded terminals feel friendly and approachable without being childish, and it maintains excellent legibility at all sizes. Used for all body text, buttons, labels, and navigation.
- **Heading Font:** "Nunito" Bold or ExtraBold — the same family at heavier weights for headings, keeping the design cohesive. The rounded forms complement the organic aesthetic.
- **Fallback Stack:** "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.

### Type Scale

- **Page Title / Hero:** 28px / Bold — used only for the landing tagline "What's growing near you?"
- **Section Headings:** 22px / Bold — used for "Nearby Produce," dashboard section headers.
- **Card Title (Produce Name):** 18px / Bold — the most prominent text on each listing card.
- **Card Subtitle (Grower + Neighborhood):** 14px / Regular — secondary info on cards.
- **Body Text:** 16px / Regular — descriptions, pickup instructions, form labels.
- **Small Text:** 13px / Regular — distance indicators, timestamps, badge labels, helper text.
- **Button Text:** 16px / SemiBold — all buttons and CTAs.

### Line Height and Spacing

All body text uses a 1.5 line height for readability. Headings use 1.3 line height. Card text uses tighter spacing (1.4) to keep cards compact. Paragraph spacing in description text is 12px between paragraphs.

### Emphasis and Hierarchy

Bold weight is reserved for headings, produce names, and CTAs. Regular weight handles all other text. Italic is not used anywhere in the interface. Color is the primary differentiation tool: charcoal for primary content, warm gray for secondary content, garden green for interactive text links, and soil brown for neighborhood/location labels.

---

## Accessibility

### Color Contrast

All text meets WCAG 2.1 AA contrast requirements. Charcoal (#2D2D2D) on cream (#FFF8F0) exceeds the 4.5:1 ratio for body text. Warm gray (#6B6B6B) on cream meets the 4.5:1 ratio for small text. White text on garden green (#4A7C59) meets AA for large text (buttons, navigation). Harvest gold (#D4A843) buttons use charcoal text rather than white to ensure sufficient contrast. No information is conveyed by color alone — all status badges include text labels, and map pins include category icons alongside color coding.

### Touch and Click Targets

All interactive elements maintain a minimum size of 48x48px on touch devices, following WCAG 2.5.5 guidelines. Filter chips have generous horizontal padding (16px) and vertical padding (12px). The floating action button is 56px diameter. Spacing between adjacent interactive elements is at least 8px to prevent mis-taps.

### Keyboard Navigation

The full interface is navigable via keyboard. Tab order follows a logical flow: search bar, filter chips (left to right), listing cards (top to bottom), then map controls. Enter opens a listing detail or activates a button. Escape closes modals, detail overlays, and expanded search. Focus indicators use a visible 2px garden green outline offset by 2px so it does not overlap the element. Skip links are provided to jump from the top navigation directly to the map or the listing panel.

### Screen Reader Support

All images include descriptive alt text (produce photos use the produce name and type, e.g., "Photo of ripe Meyer lemons in a bowl"). Map pins are accessible as a list of landmarks with produce name, distance, and availability announced. The map itself has an aria-label describing its purpose ("Map showing nearby produce listings"). Interactive state changes (filter selection, contact info reveal, listing detail open/close) are announced via aria-live regions. Form fields have associated labels and error messages are linked via aria-describedby.

### Motion and Animation

All animations (card hover, panel slide, pin bounce) respect the prefers-reduced-motion media query and are disabled when the user has indicated a preference for reduced motion. No content is hidden behind animations — all information is accessible even when animations are off. Transitions are kept brief (200–300ms) and use ease-out curves to feel natural without being distracting.

### Text Scaling

The layout supports browser text scaling up to 200% without horizontal scrolling or content overlap. All text is set in rem units relative to a 16px base. Card layouts reflow gracefully: at larger text sizes, two-column card grids collapse to single-column, and card content wraps naturally. The map controls and pins remain functional at all text sizes.

### Language and Readability

All interface copy is written at a 6th-grade reading level or below. Button labels are action-oriented and unambiguous ("Post Your Produce" not "Submit," "Show Contact Info" not "Reveal"). Error messages are specific and helpful ("Please select a produce type" not "Required field"). Placeholder text supplements but does not replace visible labels.

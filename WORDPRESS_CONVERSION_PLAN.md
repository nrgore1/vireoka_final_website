# Vireoka Website → WordPress Conversion Plan

This plan moves the public marketing site content into WordPress while keeping the NDA-gated investor workflow in Next.js.

## Option A (recommended): Headless WordPress + Next.js

- WordPress manages content.
- Next.js renders the UI using existing components and styling.
- Investor pages remain in Next.js because they include the gated workflow and session cookie logic.

### WordPress setup

Create these content types:

- Pages: Home, About, Resources, Trust
- CPT: Resource (whitepapers, guides, case studies)
- Taxonomies: Resource Type, Audience

Create these Gutenberg blocks (minimum set):

- Hero (title, subtitle, CTA)
- Feature grid (3–6 cards)
- FAQ accordion
- CTA band
- Trust artifacts list (links + short notes)

### Mapping from current routes

- `/` → WP Page: Home
- `/about` → WP Page: About
- `/resources` → WP Page: Resources hub
- `/resources/whitepaper` and `/resources/ethics` → WP Resource posts or WP Pages
- `/investors/*` → Keep in Next.js (application/NDA/approval/expiry + portal)

### URL strategy

- Preserve existing paths where possible.
- If a WP slug differs, create 301 redirects.

### Migration steps

1. Stand up WordPress with a minimal theme and Gutenberg enabled.
2. Create blocks that match the existing UI (cards, spacing, typography).
3. Create pages and resource posts in WordPress.
4. Connect Next.js to WordPress via REST or WPGraphQL.
5. Replace hard-coded copy with WP content fetches.
6. Keep investor gating and portal assets in Next.js.

## Option B: Full WordPress theme

Use this if you want WordPress to render everything.

Recommended structure:

- `themes/vireoka/`
  - `theme.json` for global styles
  - `templates/` for page templates
  - `parts/` for header/footer
  - `blocks/` for custom blocks
  - `assets/` for CSS/JS

Even in a full theme approach, keep the investor workflow separate (either via a small Next.js micro-frontend, a protected WP plugin, or signed links).

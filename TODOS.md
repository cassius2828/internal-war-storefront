# Internal War Storefront - Project Todos

> This document tracks ongoing work, completed tasks, and future plans.
> Updated as the project evolves.

## Current Sprint

### In Progress
- [ ] Cross-browser QA for design elevation changes

### Up Next
- [ ] Ensure we can get accurate data from the Shopify store
- [ ] Cart behavior is handled properly
- [ ] Ensure we handle failed payments

---

## Backlog

### High Priority

#### Design & UI
- [x] ~~Improve overall design of the website~~ (Completed - see Design Elevation below)
- [ ] Ensure buttons and icons render correctly and consistently

#### Performance
- [ ] Improve data fetching of images to ensure they are prefetched and ready to render for the client

#### Pages
- [ ] Improve contact page

### Medium Priority

#### SEO & Performance
- [ ] Improve SEO and statically rendered content
  - Meta tags optimization
  - Open Graph tags
  - Structured data
  - Static generation where possible

### Low Priority / Nice to Have
<!-- Future improvements -->

---

## Completed

### January 2026

#### Week of Jan 28 - Design Elevation
- [x] Created design tokens system (`app/styles/tokens.css`)
  - Spacing scale, typography, colors, shadows, transitions
  - CSS custom properties for consistent styling
- [x] Elevated Header component with premium navigation
  - Improved spacing and typography
  - Refined dropdown animations
  - Better hover states with underline animations
- [x] Enhanced homepage hero section
  - Full viewport video with gradient overlay
  - Premium typography and CTA styling
- [x] Improved homepage product grid and collections
  - Better section spacing and titles
  - Consistent padding using design tokens
- [x] Refined product page image gallery
  - Desktop: Thumbnail strip navigation with hover states
  - Mobile: Swipeable carousel with smooth transitions
  - Image counter and premium indicator styling
- [x] Elevated product info section
  - Premium size selector with visual states
  - Full-width add-to-cart with loading state
  - Smooth accordion animations for details
  - Better price typography hierarchy
- [x] Applied consistent spacing across pages
  - Added section and container utility classes
  - Consistent horizontal padding responsive scale
  - Section titles with proper hierarchy

#### Week of Jan 27
- [x] Created comprehensive documentation in `/docs`
  - README.md - Project overview
  - ARCHITECTURE.md - Project structure
  - SHOPIFY-CONNECTION.md - API setup guide
  - DEVELOPMENT.md - Local dev workflow
  - DEPLOYMENT.md - Oxygen deployment
  - COMPONENTS.md - Component reference
  - ROUTES.md - Route documentation
- [x] Fixed dev server startup issue (Node.js version incompatibility)
- [x] Added `.nvmrc` file to lock Node.js to v20
- [x] Set up agentic development foundation

---

## Known Issues

| Issue | Status | Notes |
|-------|--------|-------|
| Node v22/v24 incompatible with Shopify CLI | Workaround | Use Node v20 via `.nvmrc` |
| Duplicate `ProductItem` fragment name | Open | Warning only, doesn't break functionality |
| 36 npm vulnerabilities | Open | Run `npm audit fix` when time permits |

---

## Technical Debt

- [ ] Address npm security vulnerabilities
- [ ] Fix duplicate GraphQL fragment names
- [ ] Add Remix v7 future flags for migration prep
- [ ] Update to latest Hydrogen version (currently 2024.10.1, latest 2025.7.1)

---

## Notes

### Development Commands
```bash
nvm use           # Switch to Node 20
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
```

### Key URLs (Local Dev)
- App: http://localhost:3000/
- GraphiQL: http://localhost:3000/graphiql
- Subrequest Profiler: http://localhost:3000/subrequest-profiler

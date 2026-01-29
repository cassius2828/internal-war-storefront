# Internal War Storefront - Project Todos

> This document tracks ongoing work, completed tasks, and future plans.
> Updated as the project evolves.

## Current Sprint

### In Progress
- [ ] Project setup for agentic development workflow

### Up Next
<!-- Add tasks here as they are identified -->

---

## Backlog

### High Priority
<!-- Critical issues or features -->

### Medium Priority
<!-- Important but not urgent -->

### Low Priority / Nice to Have
<!-- Future improvements -->

---

## Completed

### January 2026

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

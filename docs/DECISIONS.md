# Architectural Decisions

> This document records significant architectural and technical decisions made during development.
> Each decision includes context, the decision made, and consequences.

---

## ADR-001: Node.js Version Pinning

**Date:** January 2026

**Status:** Accepted

### Context
The Shopify CLI (specifically mini-oxygen/workerd) hangs silently when running with Node.js v22 or v24. The CLI works correctly with Node.js v20.

### Decision
Pin the project to Node.js v20 using an `.nvmrc` file.

### Consequences
- Developers must use Node v20 for this project
- Added `.nvmrc` file to repository root
- Team members using nvm can run `nvm use` to switch automatically
- Updated documentation to reflect Node version requirement

---

## ADR-002: Documentation Structure

**Date:** January 2026

**Status:** Accepted

### Context
The project needed comprehensive documentation for onboarding, development, and maintenance.

### Decision
Create a `/docs` directory with focused documentation files:
- `README.md` - Overview and quick links
- `ARCHITECTURE.md` - Project structure
- `SHOPIFY-CONNECTION.md` - Shopify API setup
- `DEVELOPMENT.md` - Local development
- `DEPLOYMENT.md` - Production deployment
- `COMPONENTS.md` - Component reference
- `ROUTES.md` - Route documentation
- `DECISIONS.md` - This file (ADRs)
- `CHANGELOG.md` - Version history

### Consequences
- Clear separation of concerns in documentation
- Easy to find specific information
- Documents evolve independently
- New team members have structured onboarding path

---

## ADR-003: Agentic Development Workflow

**Date:** January 2026

**Status:** Accepted

### Context
The project will be developed using AI-assisted (agentic) coding workflows. Need structure to support this approach.

### Decision
Establish the following for agentic development:
1. `TODOS.md` at project root for task tracking
2. `docs/DECISIONS.md` for architectural decisions
3. `docs/CHANGELOG.md` for tracking changes
4. `.cursor/rules/` directory for AI coding rules (as needed)

### Consequences
- AI agents have context about project state
- Decisions are documented as they're made
- Progress is tracked in a consistent format
- Rules can be added incrementally as patterns emerge

---

<!-- Template for new decisions:

## ADR-XXX: Title

**Date:** Month Year

**Status:** Proposed | Accepted | Deprecated | Superseded

### Context
What is the issue that we're seeing that motivates this decision?

### Decision
What is the change that we're proposing and/or doing?

### Consequences
What becomes easier or more difficult as a result of this change?

-->

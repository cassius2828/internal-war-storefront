# Internal War Storefront Documentation

Welcome to the Internal War Storefront documentation. This is a **Shopify Hydrogen** storefront built on **Remix**, designed to run on **Shopify Oxygen** (Cloudflare Workers).

## Quick Links

| Document | Description |
|----------|-------------|
| [Architecture](./ARCHITECTURE.md) | Project structure and codebase organization |
| [Shopify Connection](./SHOPIFY-CONNECTION.md) | How to connect to Shopify APIs |
| [Development](./DEVELOPMENT.md) | Local development setup and workflow |
| [Deployment](./DEPLOYMENT.md) | Deployment to Shopify Oxygen |
| [Components](./COMPONENTS.md) | Component reference and usage |
| [Routes](./ROUTES.md) | Route structure and pages |

## Overview

### What is Hydrogen?

[Hydrogen](https://shopify.dev/custom-storefronts/hydrogen) is Shopify's React-based framework for building custom storefronts. It provides:

- **Storefront API Integration**: Pre-built utilities for querying Shopify's Storefront API
- **Cart Management**: Built-in cart state management with optimistic updates
- **Customer Accounts**: Customer Account API integration for authentication
- **Performance Optimizations**: Caching strategies, deferred loading, and edge deployment
- **SEO Tools**: Meta tag management, sitemaps, and analytics

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Remix | v2.14.0 | Full-stack web framework |
| Hydrogen | v2024.10.1 | Shopify storefront utilities |
| React | v18.3.1 | UI library |
| TypeScript | v5.6.3 | Type safety |
| Vite | v5.4.11 | Build tool |
| Tailwind CSS | v4.0.0-alpha.33 | Styling |
| Shopify Oxygen | - | Deployment platform (Cloudflare Workers) |

### UI Libraries

- **@headlessui/react** - Accessible UI primitives
- **@heroicons/react** - Icon library
- **@fortawesome/react-fontawesome** - FontAwesome icons

## Key Features

### E-commerce

- Product browsing and detail pages
- Collections with pagination
- Shopping cart with optimistic updates
- Variant selection
- Search (regular and predictive)
- Discount code handling

### Customer Accounts

- Login/logout with OAuth
- Profile management
- Order history
- Address book management

### Content

- Blog/articles
- Static pages
- Policies (privacy, terms, etc.)

### Performance

- Deferred data loading
- Critical vs. non-critical data separation
- Image optimization via Hydrogen Image component
- Edge caching strategies

### SEO

- Dynamic sitemap generation
- Robots.txt
- Per-route meta tags
- Shopify Analytics integration

## Project Structure (High-Level)

```
internal-war-storefront/
├── app/                    # Main application code
│   ├── components/         # React components
│   ├── graphql/           # GraphQL queries/mutations
│   ├── lib/               # Utility functions
│   ├── routes/            # Remix route files
│   └── styles/            # CSS files
├── docs/                   # Documentation (you are here)
├── guides/                 # Implementation guides
├── public/                 # Static assets
├── server.ts              # Oxygen worker entry point
└── vite.config.ts         # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js v18.0.0 or higher
- npm or yarn
- Shopify Partner account (for API access)

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

The application requires the following environment variables (see [Shopify Connection](./SHOPIFY-CONNECTION.md) for details):

### Required (from Shopify)

- `SESSION_SECRET`
- `PUBLIC_STOREFRONT_API_TOKEN`
- `PRIVATE_STOREFRONT_API_TOKEN`
- `PUBLIC_STORE_DOMAIN`
- `PUBLIC_STOREFRONT_ID`

### Customer Account API (Optional)

- `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID`
- `PUBLIC_CUSTOMER_ACCOUNT_API_URL`
- `PUBLIC_CHECKOUT_DOMAIN`

### Custom Variables

- `VITE_SWEATS_DROPDOWN_ONE/TWO/THREE` - Collection dropdown images
- `VITE_HOODIE_DROPDOWN_ONE/TWO/THREE` - Collection dropdown images
- `VITE_FALLBACK_LOGO` - Fallback logo URL

## Additional Resources

- [Hydrogen Documentation](https://shopify.dev/custom-storefronts/hydrogen)
- [Remix Documentation](https://remix.run/docs/en/v1)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Shopify Customer Account API](https://shopify.dev/docs/api/customer)

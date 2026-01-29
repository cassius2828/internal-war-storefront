# Architecture

This document describes the project structure and architectural decisions of the Internal War Storefront.

## Project Structure

```
internal-war-storefront/
├── .github/
│   └── workflows/
│       └── oxygen-deployment-*.yml    # GitHub Actions for Oxygen deployment
├── app/
│   ├── assets/                        # Static assets (favicon, etc.)
│   ├── components/                    # React components
│   │   └── Products/                  # Product-specific components
│   ├── entry.client.tsx               # Client-side entry point
│   ├── entry.server.tsx               # Server-side entry point
│   ├── graphql/                       # GraphQL queries/mutations
│   │   └── customer-account/          # Customer Account API queries
│   ├── lib/                           # Utility functions and context
│   ├── root.tsx                       # Root layout component
│   ├── routes/                        # Remix file-based routes
│   └── styles/                        # CSS files
├── docs/                              # Documentation
├── guides/                            # Implementation guides
├── public/                            # Public static assets
├── .graphqlrc.ts                      # GraphQL configuration
├── env.d.ts                           # TypeScript environment types
├── server.ts                          # Oxygen worker entry point
├── storefrontapi.generated.d.ts       # Generated Storefront API types
├── customer-accountapi.generated.d.ts # Generated Customer Account API types
├── tsconfig.json                      # TypeScript configuration
└── vite.config.ts                     # Vite + Hydrogen configuration
```

## Entry Points

### Server Entry (`server.ts`)

The main entry point for the Oxygen worker. It:

1. Creates the app load context with Shopify clients
2. Creates a Remix request handler
3. Handles session cookies
4. Manages 404 redirects via `storefrontRedirect`

```typescript
export default {
  async fetch(request, env, executionContext): Promise<Response> {
    const appLoadContext = await createAppLoadContext(request, env, executionContext);
    const handleRequest = createRequestHandler({ build: remixBuild, ... });
    return handleRequest(request);
  },
};
```

### App Load Context (`app/lib/context.ts`)

Creates the Hydrogen context with all Shopify clients:

```typescript
const hydrogenContext = createHydrogenContext({
  env,
  request,
  cache,
  waitUntil,
  session,
  i18n: getLocaleFromRequest(request),
  cart: { queryFragment: CART_QUERY_FRAGMENT },
});
```

**Available in Loader Context:**

- `storefront` - Storefront API client
- `customerAccount` - Customer Account API client
- `cart` - Cart handler
- `session` - Session management
- `env` - Environment variables
- `waitUntil` - Background task handler

### Root Component (`app/root.tsx`)

The root layout that:

- Loads critical data (header menu, shop info)
- Defers non-critical data (footer, cart, login status)
- Sets up the Shopify Analytics provider
- Configures SEO and meta tags
- Provides error boundaries

## Data Loading Strategy

### Critical vs. Deferred Data

```typescript
export async function loader({context}: LoaderFunctionArgs) {
  // Critical data - blocks render
  const header = await context.storefront.query(HEADER_QUERY, {...});
  
  // Deferred data - loads in background
  const footer = context.storefront.query(FOOTER_QUERY, {...});
  const cart = context.cart.get();
  
  return defer({
    header,                    // Critical
    footer,                    // Deferred
    cart,                      // Deferred
    isLoggedIn,               // Deferred
  });
}
```

### Caching

Hydrogen provides built-in caching strategies:

```typescript
const {cache} = await caches.open('hydrogen');

// In queries
context.storefront.query(QUERY, {
  cache: CacheShort(),  // or CacheLong(), CacheNone()
});
```

## Routing

Uses Remix file-based routing with locale support:

### Route Naming Convention

- `($locale)` - Optional locale prefix (e.g., `/en-us/products`)
- `_index` - Index route
- `$param` - Dynamic parameter
- `_.` - Pathless route (for layout inheritance)
- `.` - Nested route separator

### Examples

| File | URL |
|------|-----|
| `($locale)._index.tsx` | `/` or `/en-us/` |
| `($locale).products.$handle.tsx` | `/products/my-product` |
| `($locale).account_.login.tsx` | `/account/login` |
| `[robots.txt].tsx` | `/robots.txt` |

## Component Architecture

### Layout Components

```
PageLayout
├── Header
│   ├── Navigation (with dropdowns)
│   ├── SearchToggle
│   └── CartBadge
├── Main Content (children)
└── Footer
```

### Aside System

Uses a context-based aside system for drawers:

```typescript
// Aside types
type AsideType = 'search' | 'cart' | 'mobile' | 'closed';

// Usage
<Aside type="cart" heading="Cart">
  <CartMain />
</Aside>
```

### Product Components

Located in `app/components/Products/`:

| Component | Purpose |
|-----------|---------|
| `ProductList.tsx` | Grid/list display of products |
| `ProductForm.tsx` | Variant selection form |
| `ProductImage.tsx` | Single product image |
| `ProductImages.tsx` | Image gallery container |
| `ProductImagesCarousel.tsx` | Carousel view |
| `ProductImagesGrid.tsx` | Grid view |
| `ProductPrice.tsx` | Price with compare-at |

## GraphQL Architecture

### Configuration (`.graphqlrc.ts`)

Two GraphQL projects:

1. **default** - Storefront API queries (most queries)
2. **customer** - Customer Account API queries

```typescript
export default {
  projects: {
    default: {
      schema: getSchema('storefront'),
      documents: ['./app/**/*.{ts,tsx}', '!./app/graphql/**/*'],
    },
    customer: {
      schema: getSchema('customer-account'),
      documents: ['./app/graphql/customer-account/*.{ts,tsx}'],
    },
  },
};
```

### Code Generation

Types are auto-generated from GraphQL queries:

```bash
npm run codegen
```

Generated files:
- `storefrontapi.generated.d.ts`
- `customer-accountapi.generated.d.ts`

### Query Fragments

Reusable fragments in `app/lib/fragments.ts`:

- `CART_QUERY_FRAGMENT` - Complete cart data structure
- `HEADER_QUERY` - Header menu and shop info
- `FOOTER_QUERY` - Footer menu

## Internationalization (i18n)

Locale detection from URL path:

```typescript
// app/lib/i18n.ts
export function getLocaleFromRequest(request: Request): I18nLocale {
  // Parses /en-us/products → { language: 'EN', country: 'US' }
  const firstPathPart = url.pathname.split('/')[1];
  // ...
}
```

Supported format: `/{language}-{country}/path` (e.g., `/en-us/products`)

## Styling

### Tailwind CSS v4 (Alpha)

Configured via Vite plugin:

```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), ...],
});
```

### CSS Files

- `app/styles/app.css` - Application styles
- `app/styles/reset.css` - CSS reset
- `app/styles/tailwind.css` - Tailwind imports

### Custom Font

Uses "Newsreader" serif font for branding.

## Error Handling

### Error Boundaries

Root-level error boundary in `root.tsx`:

```typescript
export function ErrorBoundary() {
  const error = useRouteError();
  // Render error UI
}
```

### Server-Side Error Handling

In `server.ts`:

```typescript
catch (error) {
  console.error(error);
  return new Response('An unexpected error occurred', {status: 500});
}
```

## Performance Optimizations

1. **Edge Deployment** - Runs on Cloudflare Workers via Oxygen
2. **Deferred Loading** - Non-critical data loads in background
3. **Asset Optimization** - Images served via Shopify CDN
4. **Caching** - Built-in cache strategies for API responses
5. **Code Splitting** - Remix handles automatic code splitting

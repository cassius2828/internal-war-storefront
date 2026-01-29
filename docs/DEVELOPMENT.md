# Development Guide

This document covers local development setup and workflow for the Internal War Storefront.

## Prerequisites

- **Node.js v20** (required - v22/v24 cause CLI hangs)
- **npm** (comes with Node.js)
- **Git**
- **nvm** (recommended for Node version management)
- **Shopify Partner Account** (for API access)

> **Important:** This project requires Node.js v20. The Shopify CLI hangs silently with newer versions (v22, v24). An `.nvmrc` file is included - run `nvm use` before starting.

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd internal-war-storefront
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Session
SESSION_SECRET=your-random-secret-string

# Storefront API
PUBLIC_STOREFRONT_API_TOKEN=your-public-token
PRIVATE_STOREFRONT_API_TOKEN=your-private-token
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_ID=your-storefront-id

# Customer Account API (optional)
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID=shp_xxxxxxxx
PUBLIC_CUSTOMER_ACCOUNT_API_URL=https://shopify.com/xxxxxxxx
PUBLIC_CHECKOUT_DOMAIN=your-store.myshopify.com

# Custom variables
VITE_FALLBACK_LOGO=https://cdn.shopify.com/...
```

See [Shopify Connection](./SHOPIFY-CONNECTION.md) for details on obtaining these values.

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload and codegen |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run codegen` | Generate GraphQL types |

## Development Workflow

### Making Changes

1. **Start the dev server**: `npm run dev`
2. **Edit files** - Changes hot-reload automatically
3. **GraphQL changes** - Types regenerate automatically via codegen

### File Structure

```
app/
├── components/      # Create new components here
├── routes/          # Add new pages/routes here
├── lib/             # Add utility functions here
├── graphql/         # Add Customer Account API queries here
└── styles/          # Add CSS here
```

### Adding a New Route

Routes use Remix file-based routing. Create a new file in `app/routes/`:

```typescript
// app/routes/($locale).my-page.tsx
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';

export async function loader({context}: LoaderFunctionArgs) {
  // Fetch data
  return json({message: 'Hello World'});
}

export default function MyPage() {
  const {message} = useLoaderData<typeof loader>();
  return <div>{message}</div>;
}
```

### Adding a New Component

```typescript
// app/components/MyComponent.tsx
import {type FC} from 'react';

interface MyComponentProps {
  title: string;
}

export const MyComponent: FC<MyComponentProps> = ({title}) => {
  return <div className="my-component">{title}</div>;
};
```

### Adding a GraphQL Query

1. Write the query in your route or component:

```typescript
const MY_QUERY = `#graphql
  query MyQuery($handle: String!) {
    product(handle: $handle) {
      id
      title
    }
  }
` as const;
```

2. Types are auto-generated when you save

3. Use the query:

```typescript
const {product} = await context.storefront.query(MY_QUERY, {
  variables: {handle: 'my-product'},
});
```

### Styling with Tailwind

Use Tailwind utility classes directly in JSX:

```tsx
<div className="flex items-center justify-between p-4 bg-white shadow-md">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
</div>
```

For custom CSS, add to `app/styles/app.css`:

```css
.custom-class {
  /* Your styles */
}
```

## TypeScript

### Strict Mode

The project uses TypeScript in strict mode. Always type your components and functions.

### Generated Types

GraphQL types are auto-generated. Import them from the generated files:

```typescript
import type {ProductFragment} from 'storefrontapi.generated';
```

### Type Checking

Run type checking separately:

```bash
npm run typecheck
```

## Linting

### Running ESLint

```bash
npm run lint
```

### ESLint Configuration

The project uses:
- `@remix-run/eslint-config`
- `eslint-plugin-hydrogen`

### Auto-fix

```bash
npm run lint -- --fix
```

## Debugging

### Server-Side Debugging

Add `console.log` in loaders/actions. Output appears in the terminal.

```typescript
export async function loader({context}: LoaderFunctionArgs) {
  console.log('Request received');
  // ...
}
```

### Client-Side Debugging

Use browser DevTools. React DevTools extension recommended.

### GraphQL Debugging

View queries in the Network tab of DevTools. Look for requests to the Storefront API.

## Testing Locally

### Preview Production Build

```bash
npm run build
npm run preview
```

This runs the production build using Mini-Oxygen locally.

### Testing Customer Accounts

Customer Account API requires HTTPS and a public domain. For local testing:

1. Use ngrok or similar tunneling service:
   ```bash
   ngrok http 3000
   ```

2. Configure the ngrok URL in Shopify Admin as a redirect URI

3. Access your app via the ngrok URL

## Common Issues

### "Cannot find module" Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### GraphQL Type Errors

```bash
# Regenerate types
npm run codegen
```

### Port Already in Use

```bash
# Use a different port
npm run dev -- --port 3001
```

### Slow Hot Reload

If hot reload is slow:
1. Check for large node_modules in watched directories
2. Ensure you're not importing from node_modules in a way that triggers rebuilds

## Best Practices

### Performance

1. **Use deferred loading** for non-critical data
2. **Optimize images** using Hydrogen's Image component
3. **Lazy load** heavy components with React.lazy()

### Code Organization

1. **Keep routes thin** - Move logic to lib/ utilities
2. **Reuse fragments** - Define common GraphQL fragments in lib/fragments.ts
3. **Component composition** - Build small, reusable components

### Security

1. **Never expose private tokens** in client-side code
2. **Validate user input** in actions
3. **Use CSRF protection** (built into Remix forms)

## IDE Setup

### VS Code Extensions

Recommended extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GraphQL
- vscode-styled-components (for tagged template literals)

### Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["className\\s*=\\s*['\"`]([^'\"`]*)['\"`]"]
  ]
}
```

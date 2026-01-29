# Connecting to Shopify

This document explains how the storefront connects to Shopify APIs and how to configure the connection.

## Overview

The Internal War Storefront uses two Shopify APIs:

1. **Storefront API** - Public API for product data, collections, cart, search
2. **Customer Account API** - Authenticated API for customer accounts, orders, addresses

## Environment Variables

### Required Variables

These variables are automatically provided when deploying to Shopify Oxygen, but must be configured manually for local development.

```bash
# Session encryption key (generate a random string)
SESSION_SECRET=your-session-secret-here

# Storefront API tokens (from Shopify Admin > Settings > Apps and sales channels > Develop apps)
PUBLIC_STOREFRONT_API_TOKEN=your-public-token
PRIVATE_STOREFRONT_API_TOKEN=your-private-token

# Store configuration
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_ID=your-storefront-id
```

### Customer Account API Variables (Optional)

Required only if you want customer account functionality:

```bash
# Customer Account API configuration
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID=shp_xxxxxxxx
PUBLIC_CUSTOMER_ACCOUNT_API_URL=https://shopify.com/xxxxxxxx

# Checkout domain (usually same as store domain)
PUBLIC_CHECKOUT_DOMAIN=your-store.myshopify.com
```

### Custom Variables

These are project-specific environment variables:

```bash
# Collection dropdown images
VITE_SWEATS_DROPDOWN_ONE=https://cdn.shopify.com/...
VITE_SWEATS_DROPDOWN_TWO=https://cdn.shopify.com/...
VITE_SWEATS_DROPDOWN_THREE=https://cdn.shopify.com/...
VITE_HOODIE_DROPDOWN_ONE=https://cdn.shopify.com/...
VITE_HOODIE_DROPDOWN_TWO=https://cdn.shopify.com/...
VITE_HOODIE_DROPDOWN_THREE=https://cdn.shopify.com/...

# Fallback logo
VITE_FALLBACK_LOGO=https://cdn.shopify.com/...
```

## Setting Up Shopify API Access

### Step 1: Create a Custom App

1. Go to your Shopify Admin
2. Navigate to **Settings > Apps and sales channels**
3. Click **Develop apps** (you may need to enable development apps first)
4. Click **Create an app**
5. Name your app (e.g., "Hydrogen Storefront")

### Step 2: Configure API Scopes

1. In your app, click **Configure Storefront API scopes**
2. Enable the following scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_pickup_locations`
   - `unauthenticated_read_selling_plans`
   - `unauthenticated_read_content`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_read_customer_tags`

### Step 3: Install the App

1. Click **Install app**
2. Copy the **Storefront API access token**

### Step 4: Get Your Store Domain

Your store domain is typically: `your-store-name.myshopify.com`

You can find this in **Settings > Domains**.

## How the Connection Works

### Hydrogen Context Creation

The connection is established in `app/lib/context.ts`:

```typescript
import {createHydrogenContext} from '@shopify/hydrogen';

export async function createAppLoadContext(request, env, executionContext) {
  const hydrogenContext = createHydrogenContext({
    env,           // Contains all environment variables
    request,
    cache,
    waitUntil,
    session,
    i18n: getLocaleFromRequest(request),
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
    },
  });

  return {
    ...hydrogenContext,
  };
}
```

### Using the Storefront API

In route loaders, you access the storefront client via `context.storefront`:

```typescript
export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  // Query products
  const {products} = await storefront.query(PRODUCTS_QUERY, {
    variables: {first: 10},
  });
  
  return json({products});
}
```

### GraphQL Queries

Queries are written as tagged template literals:

```typescript
const PRODUCTS_QUERY = `#graphql
  query Products($first: Int!) {
    products(first: $first) {
      nodes {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
` as const;
```

## Customer Account API Setup

### Step 1: Set Up a Public Domain

For local development, you need a public domain. Follow [Shopify's guide](https://shopify.dev/docs/custom-storefronts/building-with-the-customer-account-api/hydrogen#step-1-set-up-a-public-domain-for-local-development).

### Step 2: Create a Customer Account API Client

1. In Shopify Admin, go to **Settings > Customer accounts**
2. Enable **New customer accounts**
3. Set up the redirect URIs for your application

### Step 3: Configure Environment Variables

```bash
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID=shp_xxxxxxxx
PUBLIC_CUSTOMER_ACCOUNT_API_URL=https://shopify.com/xxxxxxxx
```

### Using the Customer Account API

```typescript
export async function loader({context}: LoaderFunctionArgs) {
  const {customerAccount} = context;
  
  // Check if logged in
  const customer = await customerAccount.query(CUSTOMER_QUERY);
  
  return json({customer});
}
```

## Cart API

The cart is managed via Hydrogen's cart handler:

```typescript
export async function loader({context}: LoaderFunctionArgs) {
  const cart = await context.cart.get();
  return json({cart});
}

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const {cart} = context;
  
  // Add to cart
  const result = await cart.addLines([
    {merchandiseId: formData.get('variantId'), quantity: 1},
  ]);
  
  return json(result);
}
```

## GraphQL Code Generation

Types are automatically generated from your GraphQL queries:

```bash
# Generate types
npm run codegen

# Or during development (auto-generates on file changes)
npm run dev
```

### Configuration

The GraphQL configuration is in `.graphqlrc.ts`:

```typescript
export default {
  projects: {
    default: {
      schema: getSchema('storefront'),
      documents: ['./*.{ts,tsx}', './app/**/*.{ts,tsx}', '!./app/graphql/**/*'],
    },
    customer: {
      schema: getSchema('customer-account'),
      documents: ['./app/graphql/customer-account/*.{ts,tsx}'],
    },
  },
};
```

## Troubleshooting

### "SESSION_SECRET environment variable is not set"

Ensure you have set the `SESSION_SECRET` in your `.env` file or environment.

### "Invalid Storefront API token"

1. Verify your token is correct in Shopify Admin
2. Check that the app is installed
3. Ensure you're using the correct store domain

### "Customer Account API not working locally"

The Customer Account API requires a public domain with HTTPS. Use a tunneling service like ngrok:

```bash
ngrok http 3000
```

Then update your redirect URIs in Shopify Admin.

### CORS Errors

The Storefront API should work from any origin. If you encounter CORS errors:

1. Ensure you're using the public token for client-side requests
2. Use the private token only for server-side requests

## API Documentation

- [Storefront API Reference](https://shopify.dev/docs/api/storefront)
- [Customer Account API Reference](https://shopify.dev/docs/api/customer)
- [Hydrogen Documentation](https://shopify.dev/custom-storefronts/hydrogen)

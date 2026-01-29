# Routes Reference

This document describes all routes in the Internal War Storefront, their purpose, and implementation details.

## Route File Naming Convention

The storefront uses Remix file-based routing with special naming conventions:

| Pattern | Meaning | Example |
|---------|---------|---------|
| `($locale)` | Optional locale prefix | `/en-us/products` |
| `_index` | Index route | `/` |
| `$param` | Dynamic segment | `/products/:handle` |
| `_.` | Pathless layout | Layout without URL segment |
| `.` | Nested route | `/account/orders` |
| `[file.txt]` | Escaped route | `/robots.txt` |

## Route Overview

### Public Routes

| Route File | URL | Description |
|------------|-----|-------------|
| `($locale)._index.tsx` | `/` | Homepage |
| `($locale).products._index.tsx` | `/products` | All products |
| `($locale).products.$handle.tsx` | `/products/:handle` | Product detail |
| `($locale).collections._index.tsx` | `/collections` | All collections |
| `($locale).collections.$handle.tsx` | `/collections/:handle` | Collection page |
| `($locale).collections.all.tsx` | `/collections/all` | All products collection |
| `($locale).cart.tsx` | `/cart` | Cart page |
| `($locale).search.tsx` | `/search` | Search results |
| `($locale).pages.$handle.tsx` | `/pages/:handle` | Static pages |
| `($locale).blogs._index.tsx` | `/blogs` | Blog index |
| `($locale).blogs.$blogHandle._index.tsx` | `/blogs/:blogHandle` | Blog posts |
| `($locale).blogs.$blogHandle.$articleHandle.tsx` | `/blogs/:blog/:article` | Article detail |
| `($locale).policies._index.tsx` | `/policies` | Policies index |
| `($locale).policies.$handle.tsx` | `/policies/:handle` | Policy page |
| `($locale).discount.$code.tsx` | `/discount/:code` | Apply discount |

### Account Routes

| Route File | URL | Description |
|------------|-----|-------------|
| `($locale).account.tsx` | `/account` | Account layout |
| `($locale).account._index.tsx` | `/account` | Account dashboard |
| `($locale).account_.login.tsx` | `/account/login` | Login page |
| `($locale).account_.logout.tsx` | `/account/logout` | Logout action |
| `($locale).account_.authorize.tsx` | `/account/authorize` | OAuth callback |
| `($locale).account.profile.tsx` | `/account/profile` | Profile settings |
| `($locale).account.addresses.tsx` | `/account/addresses` | Address book |
| `($locale).account.orders._index.tsx` | `/account/orders` | Order history |
| `($locale).account.orders.$id.tsx` | `/account/orders/:id` | Order detail |

### Utility Routes

| Route File | URL | Description |
|------------|-----|-------------|
| `[robots.txt].tsx` | `/robots.txt` | Robots file |
| `($locale).[sitemap.xml].tsx` | `/sitemap.xml` | XML sitemap |
| `($locale).$.tsx` | `/*` | Catch-all 404 |

## Route Details

### Homepage (`($locale)._index.tsx`)

**URL:** `/` or `/:locale/`

**Features:**
- Hero video section
- Featured products
- Collection previews
- News carousel
- Marquee banners

**Loader Data:**
- Featured collection products
- Homepage content/metafields
- Blog articles for news section

### Product Detail (`($locale).products.$handle.tsx`)

**URL:** `/products/:handle`

**Features:**
- Product images (carousel/grid)
- Variant selection
- Add to cart
- Product description
- Related products

**Loader Data:**
- Product by handle
- Product variants
- Selected variant from URL params

**URL Parameters:**
- `?Size=XL&Color=Black` - Variant selection

### Collection (`($locale).collections.$handle.tsx`)

**URL:** `/collections/:handle`

**Features:**
- Collection header
- Product grid
- Pagination
- Filters (optional)
- Sorting

**Loader Data:**
- Collection by handle
- Paginated products
- Collection description

**URL Parameters:**
- `?cursor=xyz` - Pagination cursor
- `?direction=next|previous` - Page direction

### Cart (`($locale).cart.tsx`)

**URL:** `/cart`

**Features:**
- Cart line items
- Quantity adjustment
- Remove items
- Cart totals
- Checkout button

**Loader Data:**
- Current cart state

**Action Handlers:**
- `LinesUpdate` - Update quantities
- `LinesRemove` - Remove items
- `DiscountCodesUpdate` - Apply discounts

### Search (`($locale).search.tsx`)

**URL:** `/search`

**Features:**
- Regular search results
- Predictive search (AJAX)
- Product, page, and article results

**URL Parameters:**
- `?q=search+term` - Search query
- `?predictive` - Flag for predictive search

**Loader Data:**
- Search results by term
- Paginated products
- Pages and articles

### Account Dashboard (`($locale).account._index.tsx`)

**URL:** `/account`

**Features:**
- Customer info
- Recent orders
- Quick links to profile/addresses

**Loader Data:**
- Customer details
- Recent orders

**Authentication:**
- Requires logged-in customer
- Redirects to login if not authenticated

### Account Login (`($locale).account_.login.tsx`)

**URL:** `/account/login`

**Features:**
- OAuth login flow
- Redirect to Customer Account API

**Note:** Uses Shopify's Customer Account API for authentication.

### Order History (`($locale).account.orders._index.tsx`)

**URL:** `/account/orders`

**Features:**
- List of all orders
- Order status
- Order totals

**Loader Data:**
- Paginated order history

### Order Detail (`($locale).account.orders.$id.tsx`)

**URL:** `/account/orders/:id`

**Features:**
- Order line items
- Shipping info
- Order status
- Fulfillment tracking

**Loader Data:**
- Order by ID
- Line items
- Fulfillments

### Static Pages (`($locale).pages.$handle.tsx`)

**URL:** `/pages/:handle`

**Features:**
- Dynamic page content
- HTML rendering

**Loader Data:**
- Page by handle
- Page content/body

### Blog Index (`($locale).blogs._index.tsx`)

**URL:** `/blogs`

**Features:**
- List of all blogs

**Loader Data:**
- All blogs

### Blog Posts (`($locale).blogs.$blogHandle._index.tsx`)

**URL:** `/blogs/:blogHandle`

**Features:**
- Blog articles list
- Pagination

**Loader Data:**
- Blog by handle
- Paginated articles

### Article Detail (`($locale).blogs.$blogHandle.$articleHandle.tsx`)

**URL:** `/blogs/:blogHandle/:articleHandle`

**Features:**
- Article content
- Author info
- Published date
- Comments (if enabled)

**Loader Data:**
- Article by handle
- Blog info

### Policy Pages (`($locale).policies.$handle.tsx`)

**URL:** `/policies/:handle`

**Common handles:**
- `privacy-policy`
- `refund-policy`
- `shipping-policy`
- `terms-of-service`

**Loader Data:**
- Shop policies by handle

### Discount Application (`($locale).discount.$code.tsx`)

**URL:** `/discount/:code`

**Features:**
- Applies discount code to cart
- Redirects to cart

**Action:**
- Adds discount code to cart
- Redirects to `/cart`

### Sitemap (`($locale).[sitemap.xml].tsx`)

**URL:** `/sitemap.xml`

**Features:**
- Dynamic XML sitemap
- Products, collections, pages, articles

**Response:**
- Content-Type: `application/xml`

### Robots (`[robots.txt].tsx`)

**URL:** `/robots.txt`

**Features:**
- SEO robots directives
- Sitemap reference

**Response:**
- Content-Type: `text/plain`

## Route Implementation Patterns

### Typical Loader Pattern

```typescript
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {handle} = params;
  
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle},
  });
  
  if (!product) {
    throw new Response('Not Found', {status: 404});
  }
  
  return json({product});
}

export default function ProductRoute() {
  const {product} = useLoaderData<typeof loader>();
  return <ProductPage product={product} />;
}
```

### Action Pattern (Cart Updates)

```typescript
import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';

export async function action({request, context}: ActionFunctionArgs) {
  const {cart} = context;
  const formData = await request.formData();
  const action = String(formData.get('action'));
  
  switch (action) {
    case 'LinesUpdate':
      const lines = JSON.parse(String(formData.get('lines')));
      const result = await cart.updateLines(lines);
      return json(result);
      
    case 'LinesRemove':
      const lineIds = JSON.parse(String(formData.get('lineIds')));
      const removeResult = await cart.removeLines(lineIds);
      return json(removeResult);
      
    default:
      throw new Error('Invalid action');
  }
}
```

### Protected Route Pattern

```typescript
export async function loader({context}: LoaderFunctionArgs) {
  const {customerAccount} = context;
  
  // Check authentication
  await customerAccount.handleAuthStatus();
  
  // Fetch customer data
  const customer = await customerAccount.query(CUSTOMER_QUERY);
  
  return json({customer});
}
```

### Deferred Loading Pattern

```typescript
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';

export async function loader({context}: LoaderFunctionArgs) {
  // Critical data (awaited)
  const products = await context.storefront.query(PRODUCTS_QUERY);
  
  // Non-critical data (deferred)
  const recommendations = context.storefront.query(RECOMMENDATIONS_QUERY);
  
  return defer({
    products,           // Immediately available
    recommendations,    // Streamed later
  });
}

export default function Page() {
  const {products, recommendations} = useLoaderData<typeof loader>();
  
  return (
    <div>
      <ProductGrid products={products} />
      
      <Suspense fallback={<Loading />}>
        <Await resolve={recommendations}>
          {(data) => <Recommendations data={data} />}
        </Await>
      </Suspense>
    </div>
  );
}
```

## SEO & Meta Tags

Each route can export a `meta` function:

```typescript
import {type MetaFunction} from '@shopify/remix-oxygen';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: data?.product?.title ?? 'Product'},
    {name: 'description', content: data?.product?.description},
  ];
};
```

## Error Handling

### Route Error Boundary

```typescript
import {isRouteErrorResponse, useRouteError} from '@remix-run/react';

export function ErrorBoundary() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status} {error.statusText}</h1>
      </div>
    );
  }
  
  return <div>An error occurred</div>;
}
```

### 404 Handling

The catch-all route `($locale).$.tsx` handles 404s:

```typescript
export async function loader({request, context}: LoaderFunctionArgs) {
  throw new Response('Not Found', {status: 404});
}
```

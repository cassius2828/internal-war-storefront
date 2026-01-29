# Component Reference

This document provides a reference for all components in the Internal War Storefront.

## Component Directory Structure

```
app/components/
├── About.tsx                    # About page content
├── Accordion.tsx                # Collapsible accordion
├── AddToCartButton.tsx          # Add to cart button
├── Aside.tsx                    # Side drawer system
├── BreadCrumbs.tsx              # Breadcrumb navigation
├── CartLineItem.tsx             # Cart line item
├── CartMain.tsx                 # Cart container
├── CartSummary.tsx              # Cart totals
├── CollectionPreviewGrid.tsx    # Collection preview
├── Contact.tsx                  # Contact page content
├── DefaultCard.tsx              # Default card component
├── Footer.tsx                   # Footer
├── Header.tsx                   # Header navigation
├── Loaders.jsx                  # Loading spinners
├── Marquees.tsx                 # Marquee animations
├── NewsCarousel.tsx             # News/blog carousel
├── PageLayout.tsx               # Main layout wrapper
├── PaginatedResourceSection.tsx # Pagination wrapper
├── Products/                    # Product components
│   ├── ProductForm.tsx
│   ├── ProductImage.tsx
│   ├── ProductImages.tsx
│   ├── ProductImagesCarousel.tsx
│   ├── ProductImagesGrid.tsx
│   ├── ProductList.tsx
│   └── ProductPrice.tsx
├── SearchForm.tsx               # Regular search form
├── SearchFormPredictive.tsx     # Predictive search form
├── SearchResults.tsx            # Regular search results
└── SearchResultsPredictive.tsx  # Predictive search results
```

## Layout Components

### PageLayout

Main layout wrapper that provides the header, footer, and aside system.

```tsx
import {PageLayout} from '~/components/PageLayout';

<PageLayout
  header={headerData}
  footer={footerData}
  cart={cartPromise}
  isLoggedIn={isLoggedInPromise}
>
  {children}
</PageLayout>
```

**Props:**
- `header` - Header menu and shop data
- `footer` - Footer menu data (deferred)
- `cart` - Cart promise (deferred)
- `isLoggedIn` - Login status promise (deferred)
- `children` - Page content

### Header

Navigation header with dropdowns, search, and cart.

```tsx
import {Header} from '~/components/Header';

<Header
  header={headerData}
  cart={cartPromise}
  isLoggedIn={isLoggedInPromise}
/>
```

**Features:**
- Desktop navigation with dropdown menus
- Mobile hamburger menu
- Search toggle
- Cart badge with item count
- Responsive design

### Footer

Site footer with navigation links.

```tsx
import {Footer} from '~/components/Footer';

<Footer menu={menuData} shop={shopData} />
```

### Aside

Side drawer system for cart, search, and mobile menu.

```tsx
import {Aside, useAside} from '~/components/Aside';

// Define aside types
type AsideType = 'search' | 'cart' | 'mobile' | 'closed';

// Usage
<Aside type="cart" heading="Shopping Cart">
  <CartMain />
</Aside>

// Hook to control
const {open, close, type} = useAside();
```

**Props:**
- `type` - Aside type to match against
- `heading` - Drawer heading
- `children` - Drawer content

## Cart Components

### CartMain

Main cart container that renders cart content or empty state.

```tsx
import {CartMain} from '~/components/CartMain';

<CartMain cart={cart} layout="aside" />
```

**Props:**
- `cart` - Cart data from Hydrogen cart handler
- `layout` - 'aside' | 'page' - Display layout

### CartLineItem

Individual cart line item with quantity controls.

```tsx
import {CartLineItem} from '~/components/CartLineItem';

<CartLineItem line={cartLine} layout="aside" />
```

**Props:**
- `line` - Cart line data
- `layout` - 'aside' | 'page'

**Features:**
- Product image
- Title and variant info
- Price display
- Quantity selector
- Remove button

### CartSummary

Cart totals and checkout button.

```tsx
import {CartSummary} from '~/components/CartSummary';

<CartSummary cart={cart} layout="aside" />
```

**Props:**
- `cart` - Cart data
- `layout` - 'aside' | 'page'

### AddToCartButton

Button component for adding items to cart.

```tsx
import {AddToCartButton} from '~/components/AddToCartButton';

<AddToCartButton
  lines={[{merchandiseId: variantId, quantity: 1}]}
  disabled={!availableForSale}
>
  Add to Cart
</AddToCartButton>
```

**Props:**
- `lines` - Array of cart line items to add
- `disabled` - Disable button
- `children` - Button content
- `analytics` - Analytics data

## Product Components

### ProductList

Grid or list display of products.

```tsx
import {ProductList} from '~/components/Products/ProductList';

<ProductList products={products} />
```

**Props:**
- `products` - Array of product data

### ProductForm

Variant selection form with options.

```tsx
import {ProductForm} from '~/components/Products/ProductForm';

<ProductForm
  product={product}
  selectedVariant={selectedVariant}
  variants={variants}
/>
```

**Props:**
- `product` - Product data
- `selectedVariant` - Currently selected variant
- `variants` - All product variants

**Features:**
- Option selection (size, color, etc.)
- Add to cart button
- Out of stock handling

### ProductImage

Single product image display.

```tsx
import {ProductImage} from '~/components/Products/ProductImage';

<ProductImage image={image} />
```

**Props:**
- `image` - Image data with url, altText, width, height

### ProductImages

Image gallery container that renders carousel or grid.

```tsx
import {ProductImages} from '~/components/Products/ProductImages';

<ProductImages images={product.images} />
```

### ProductImagesCarousel

Carousel view for product images.

```tsx
import {ProductImagesCarousel} from '~/components/Products/ProductImagesCarousel';

<ProductImagesCarousel images={images} />
```

### ProductImagesGrid

Grid view for product images.

```tsx
import {ProductImagesGrid} from '~/components/Products/ProductImagesGrid';

<ProductImagesGrid images={images} />
```

### ProductPrice

Price display with compare-at pricing.

```tsx
import {ProductPrice} from '~/components/Products/ProductPrice';

<ProductPrice
  price={variant.price}
  compareAtPrice={variant.compareAtPrice}
/>
```

**Features:**
- Regular price display
- Sale price with strikethrough
- Currency formatting

## Search Components

### SearchForm

Regular search form for the search page.

```tsx
import {SearchForm} from '~/components/SearchForm';

<SearchForm>
  {({inputRef}) => (
    <input
      ref={inputRef}
      name="q"
      placeholder="Search..."
      type="search"
    />
  )}
</SearchForm>
```

**Props:**
- `children` - Render prop with `{inputRef}`

### SearchFormPredictive

Predictive search form with real-time results.

```tsx
import {SearchFormPredictive} from '~/components/SearchFormPredictive';

<SearchFormPredictive>
  {({fetchResults, goToSearch, inputRef}) => (
    <input
      ref={inputRef}
      name="q"
      onChange={fetchResults}
      onFocus={fetchResults}
      placeholder="Search..."
      type="search"
    />
  )}
</SearchFormPredictive>
```

**Props:**
- `children` - Render prop with `{fetchResults, goToSearch, inputRef}`

### SearchResults

Regular search results display.

```tsx
import {SearchResults} from '~/components/SearchResults';

<SearchResults result={result} term={searchTerm}>
  {({articles, pages, products, term}) => (
    <div>
      <SearchResults.Products products={products} term={term} />
      <SearchResults.Pages pages={pages} term={term} />
      <SearchResults.Articles articles={articles} term={term} />
    </div>
  )}
</SearchResults>
```

**Compound Components:**
- `SearchResults.Products`
- `SearchResults.Pages`
- `SearchResults.Articles`
- `SearchResults.Empty`

### SearchResultsPredictive

Predictive search results with real-time updates.

```tsx
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

<SearchResultsPredictive>
  {({items, total, term, state, closeSearch}) => (
    <>
      <SearchResultsPredictive.Queries queries={items.queries} />
      <SearchResultsPredictive.Products products={items.products} />
      <SearchResultsPredictive.Collections collections={items.collections} />
      <SearchResultsPredictive.Pages pages={items.pages} />
      <SearchResultsPredictive.Articles articles={items.articles} />
    </>
  )}
</SearchResultsPredictive>
```

**Compound Components:**
- `SearchResultsPredictive.Products`
- `SearchResultsPredictive.Collections`
- `SearchResultsPredictive.Pages`
- `SearchResultsPredictive.Articles`
- `SearchResultsPredictive.Queries`
- `SearchResultsPredictive.Empty`

## UI Components

### Accordion

Collapsible accordion component for product details.

```tsx
import {Accordion} from '~/components/Accordion';

<Accordion title="Description">
  <p>Product description...</p>
</Accordion>
```

**Props:**
- `title` - Accordion header text
- `children` - Collapsed content
- `defaultOpen` - Start expanded (optional)

### BreadCrumbs

Breadcrumb navigation component.

```tsx
import {BreadCrumbs} from '~/components/BreadCrumbs';

<BreadCrumbs items={[
  {label: 'Home', href: '/'},
  {label: 'Products', href: '/products'},
  {label: 'T-Shirt'},
]} />
```

### CollectionPreviewGrid

Grid preview of collection products.

```tsx
import {CollectionPreviewGrid} from '~/components/CollectionPreviewGrid';

<CollectionPreviewGrid collections={collections} />
```

### PaginatedResourceSection

Pagination wrapper for product/collection lists.

```tsx
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

<PaginatedResourceSection
  connection={products}
  resourcesClassName="products-grid"
>
  {({node, index}) => (
    <ProductCard key={node.id} product={node} />
  )}
</PaginatedResourceSection>
```

**Props:**
- `connection` - Paginated connection data
- `children` - Render function for each item
- `resourcesClassName` - CSS class for container

### NewsCarousel

Carousel for news/blog articles.

```tsx
import {NewsCarousel} from '~/components/NewsCarousel';

<NewsCarousel articles={articles} />
```

### Marquees

Animated marquee component.

```tsx
import {Marquees} from '~/components/Marquees';

<Marquees text="FREE SHIPPING ON ORDERS OVER $100" />
```

### Loaders

Loading spinner components.

```tsx
import {Spinner, PageLoader} from '~/components/Loaders';

<Spinner />
<PageLoader />
```

## Usage Examples

### Complete Product Page

```tsx
export default function ProductPage() {
  const {product, selectedVariant} = useLoaderData<typeof loader>();

  return (
    <div className="product-page">
      <BreadCrumbs items={[
        {label: 'Products', href: '/products'},
        {label: product.title},
      ]} />
      
      <div className="product-grid">
        <ProductImages images={product.images} />
        
        <div className="product-info">
          <h1>{product.title}</h1>
          <ProductPrice
            price={selectedVariant.price}
            compareAtPrice={selectedVariant.compareAtPrice}
          />
          
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={product.variants}
          />
          
          <Accordion title="Description">
            <div dangerouslySetInnerHTML={{__html: product.descriptionHtml}} />
          </Accordion>
        </div>
      </div>
    </div>
  );
}
```

### Cart Aside

```tsx
function CartAside() {
  const {cart} = useRootLoaderData();
  
  return (
    <Aside type="cart" heading="Shopping Cart">
      <Suspense fallback={<Spinner />}>
        <Await resolve={cart}>
          {(cart) => <CartMain cart={cart} layout="aside" />}
        </Await>
      </Suspense>
    </Aside>
  );
}
```

### Search Aside

```tsx
function SearchAside() {
  return (
    <Aside type="search" heading="Search">
      <SearchFormPredictive>
        {({fetchResults, inputRef}) => (
          <input
            ref={inputRef}
            onChange={fetchResults}
            placeholder="Search products..."
          />
        )}
      </SearchFormPredictive>
      
      <SearchResultsPredictive>
        {({items, total, closeSearch}) => (
          total ? (
            <SearchResultsPredictive.Products
              products={items.products}
              closeSearch={closeSearch}
            />
          ) : (
            <SearchResultsPredictive.Empty />
          )
        )}
      </SearchResultsPredictive>
    </Aside>
  );
}
```

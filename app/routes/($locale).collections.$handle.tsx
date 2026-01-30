import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction, useSearchParams, useNavigate} from '@remix-run/react';
import {
  getPaginationVariables,
  Image,
  Money,
  Analytics,
} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';

import {useVariantUrl} from '~/lib/variants';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import BreadCrumbs from '../components/BreadCrumbs';
import {ProductCard} from '~/components/Products/ProductList';
import {useState} from 'react';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return {
    collection,
  };
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  const {env} = context;

  return {
    env: {
      VITE_SWEATS_DROPDOWN_ONE: env.VITE_SWEATS_DROPDOWN_ONE,
      VITE_SWEATS_DROPDOWN_TWO: env.VITE_SWEATS_DROPDOWN_TWO,
      VITE_SWEATS_DROPDOWN_THREE: env.VITE_SWEATS_DROPDOWN_THREE,
      VITE_HOODIE_DROPDOWN_ONE: env.VITE_HOODIE_DROPDOWN_ONE,
      VITE_HOODIE_DROPDOWN_TWO: env.VITE_HOODIE_DROPDOWN_TWO,
      VITE_HOODIE_DROPDOWN_THREE: env.VITE_HOODIE_DROPDOWN_THREE,
      VITE_FALLBACK_LOGO: env.VITE_FALLBACK_LOGO,
    },
  };
}

// Collection metadata for descriptions
const collectionDescriptions: Record<string, string> = {
  sweats: 'Premium sweatpants designed for ultimate comfort and style. Perfect for any occasion.',
  hoodies: 'Elevated hoodie designs featuring bold graphics and premium materials for lasting comfort.',
  sweatsuits: 'Complete matching sets that make a statement. Coordinated style from head to toe.',
  bottoms: 'Essential bottoms crafted with attention to detail and superior comfort.',
  'full-sets': 'Full coordinated sets for the complete Internal War look.',
  't-shirts': 'Premium tees with signature Internal War designs.',
  headwear: 'Top off your look with our collection of headwear.',
  accessories: 'Complete your outfit with our curated accessories.',
};

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const [sortOpen, setSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const productCount = collection.products.nodes.length;
  const description = collectionDescriptions[collection.handle] || collection.description || '';

  return (
    <div className="collection-page">
      {/* Breadcrumbs */}
      <div className="collection-breadcrumbs">
        <BreadCrumbs pageType="collections" />
      </div>

      {/* Collection Header */}
      <div className="collection-header">
        <div className="collection-header-content">
          <h1 className="collection-page-title">{collection.title}</h1>
          {description && (
            <p className="collection-page-description">{description}</p>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="collection-toolbar">
        <div className="collection-toolbar-inner">
          <div className="collection-count">
            <span className="collection-count-number">{productCount}</span>
            <span className="collection-count-label">
              {productCount === 1 ? 'Product' : 'Products'}
            </span>
          </div>

          <div className="collection-filters">
            {/* Sort Dropdown */}
            <div className="collection-sort">
              <button
                type="button"
                className="collection-sort-btn"
                onClick={() => setSortOpen(!sortOpen)}
                aria-expanded={sortOpen}
              >
                <SortIcon />
                <span>Sort</span>
                <ChevronIcon isOpen={sortOpen} />
              </button>
              {sortOpen && (
                <div className="collection-sort-dropdown">
                  <button className="collection-sort-option active">Featured</button>
                  <button className="collection-sort-option">Price: Low to High</button>
                  <button className="collection-sort-option">Price: High to Low</button>
                  <button className="collection-sort-option">Newest</button>
                </div>
              )}
            </div>

            {/* View Toggle */}
            <div className="collection-view-toggle">
              <button 
                className={`collection-view-btn ${viewMode === 'grid' ? 'active' : ''}`} 
                aria-label="Grid view"
                onClick={() => setViewMode('grid')}
              >
                <GridIcon />
              </button>
              <button 
                className={`collection-view-btn ${viewMode === 'list' ? 'active' : ''}`} 
                aria-label="List view"
                onClick={() => setViewMode('list')}
              >
                <ListIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="collection-products">
        <PaginatedResourceSection
          connection={collection.products}
          resourcesClassName={viewMode === 'grid' ? 'collection-products-grid' : 'collection-products-list'}
        >
          {({node: product, index}) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 8 ? 'eager' : undefined}
              viewMode={viewMode}
            />
          )}
        </PaginatedResourceSection>
      </div>

      {/* Analytics */}
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

function ProductItem({
  product,
  loading,
  viewMode = 'grid',
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
  viewMode?: 'grid' | 'list';
}) {
  if (viewMode === 'list') {
    return <ProductListItem product={product} />;
  }
  return <ProductCard product={product} />;
}

function ProductListItem({product}: {product: ProductItemFragment}) {
  const formattedPrice = product.priceRange.minVariantPrice?.amount
    ? `$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}`
    : '';

  return (
    <Link
      to={`/products/${product.handle}?Size=M`}
      prefetch="intent"
      className="product-list-item"
    >
      <div className="product-list-image" style={{ aspectRatio: '1 / 1' }}>
        {product.featuredImage && (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            loading="lazy"
            className="w-full h-full object-cover object-center"
          />
        )}
      </div>
      <div className="product-list-content">
        <div className="product-list-info">
          <h3 className="product-list-title">{product.title}</h3>
          <p className="product-list-description">
            {product.options?.[0]?.optionValues?.map(v => v.name).join(', ')}
          </p>
        </div>
        <div className="product-list-meta">
          <span className="product-list-price">{formattedPrice}</span>
          <span className="product-list-cta">
            View Product
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

// Icon Components
function SortIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 16 4 4 4-4" />
      <path d="M7 20V4" />
      <path d="m21 8-4-4-4 4" />
      <path d="M17 4v16" />
    </svg>
  );
}

function ChevronIcon({isOpen}: {isOpen: boolean}) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease',
      }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}

export const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    media(first: 6) {
      edges {
        node {
          ... on MediaImage {
            image {
              id
              altText
              url
              width
              height
            }
          }
        }
      }
    }
    variants(first: 10) {
      nodes {  
        id
        selectedOptions {
          name
          value
        }
      }
    }
    options {
      name
      optionValues {
        name
      }
    }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;

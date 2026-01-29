import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import ProductList from '../components/Products/ProductList';
import CollectionPreviewGrid from '../components/CollectionPreviewGrid';
import {Image, Money, Video} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import NewsCarousel from '../components/NewsCarousel';
import {PRODUCT_ITEM_FRAGMENT} from './($locale).collections.$handle';
const heroVideoUrl = `https://cdn.shopify.com/videos/c/o/v/a78e9be02a6840ad9378f5ac9976801d.mp4`;
export const meta: MetaFunction = () => {
  return [{title: 'Internal War | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);
  const allProducts = await context.storefront
    .query(ALL_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    featuredCollection: collections.nodes[0],
    allProducts,
    storefront: context.storefront,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
async function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = await context.storefront
    .query(ALL_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

interface HeroVideoProps {
  url: string;
}
function HeroVideo({url}: HeroVideoProps) {
  return (
    <div className="hero-video relative h-screen w-full overflow-hidden">
      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
      
      {/* Hero content */}
      <div className="absolute inset-0 z-20 flex items-end justify-center pb-24 md:pb-32 lg:pb-40">
        <div className="text-center text-white px-6">
          <p className="uppercase tracking-[0.25em] text-sm md:text-base font-light mb-4 opacity-90">
            Welcome to the Store
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.1em] uppercase mb-6 newsreader">
            Internal War
          </h1>
          <p className="text-base md:text-lg font-light mb-10 opacity-80 tracking-wide">
            Shop our collections now
          </p>
          <Link to="/collections">
            <button
              type="button"
              className="border border-white px-10 py-4 text-sm uppercase tracking-[0.2em] font-light
                         transition-all duration-300 hover:bg-white hover:text-black
                         focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Shop Now
            </button>
          </Link>
        </div>
      </div>
      
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover object-center"
        src={url}
        autoPlay
        muted
        loop
        playsInline
      >
        <img
          src={import.meta.env.VITE_FALLBACK_LOGO}
          alt={import.meta.env.VITE_FALLBACK_LOGO ? 'fallback logo' : 'hero'}
          className="w-full h-full object-cover"
        />
      </video>
    </div>
  );
}
export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <HeroVideo url={heroVideoUrl} />
      
      {/* Featured Products Section */}
      <section className="section-spacing page-wrapper">
        <div className="max-w-[1600px] mx-auto">
          <h2 className="section-title text-center mb-10 md:mb-14">New Arrivals</h2>
          <ProductList products={data.allProducts?.products?.nodes} />
        </div>
      </section>
      
      {/* Collections Section */}
      <section className="section-spacing page-wrapper bg-neutral-50">
        <div className="max-w-[1600px] mx-auto">
          <h2 className="section-title text-center mb-10 md:mb-14">Shop Collections</h2>
          <CollectionPreviewGrid />
        </div>
      </section>
      
      <NewsCarousel />
    </div>
  );
}
// temp do not need
function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products p-5">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <Link
                      key={product.id}
                      className="recommended-product"
                      to={`/products/${product.handle}`}
                    >
                      <Image
                        data={product.images.nodes[0]}
                        aspectRatio="1/1"
                        sizes="(min-width: 45em) 20vw, 50vw"
                      />
                      <h4>{product.title}</h4>
                      <small>
                        <Money data={product.priceRange.minVariantPrice} />
                      </small>
                    </Link>
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 6, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

const ALL_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}

  query AllProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 6, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductItem
      }
    }
  }
` as const;

import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
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

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
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
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
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
const pages = [{name: 'Hoodies', href: '/collections/hoodies', current: false}];
/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
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

// ! where to edit collection UI
export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  return (
    <div className="collection mt-24 md:mt-40 flex flex-col items-center">
      {/* <h1>{collection.title}</h1> */}
      {/* breadcrubms */}
      <BreadCrumbs pageType="collections" />
      <div className="flex items-center gap-4 w-3/4">
        <span>{collection.title}</span>
        <span className="text-xs text-gray-500">
          {collection.products.nodes.length} products
        </span>
      </div>
      {/* <p className="collection-description">{collection.description}</p> */}
      <PaginatedResourceSection
        connection={collection.products}
        resourcesClassName=" grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
      >
        {({node: product, index}) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>
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
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);

  return <ProductCard product={product} />;
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

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
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

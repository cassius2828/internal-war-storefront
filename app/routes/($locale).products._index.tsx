import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';

import ProductCardList from '~/components/Products/ProductList';

import {PRODUCT_ITEM_FRAGMENT} from './($locale).collections.$handle';

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: `Internal War | Products`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const allProducts = await context.storefront
    .query(ALL_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    allProducts,
  };
}

export default function Products() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className=" mt-32 flex flex-col items-center">
      <h1>All Products</h1>
      <ProductCardList products={data.allProducts?.products?.nodes} />
    </div>
  );
}

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

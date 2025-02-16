import {Suspense, useState} from 'react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction} from '@remix-run/react';

import type {ProductFragment} from 'storefrontapi.generated';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
} from '@shopify/hydrogen';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
//TODO: Understand the variants and variant urls
import {getVariantUrl} from '~/lib/variants';
import {ProductPrice} from '~/components/Products/ProductPrice';
import Accordion from '~/components/Accordion';
import {ProductForm} from '~/components/Products/ProductForm';
import Breadcrumbs from '~/components/BreadCrumbs';
import {TwoToneLoader} from '~/components/Loaders';
import type {Product} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import ProductCardList from '~/components/Products/ProductList';
import {BasicMarquee} from '~/components/Marquees';
import NewsCarousel from '~/components/NewsCarousel';
import type {MediaImage} from 'customTypes';
import ProductImages from '~/components/Products/ProductImages';
import {useAside} from '~/components/Aside';
export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Internal War | ${data?.product.title ?? ''}`}];
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

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  return {
    product,
  };
}
const pages = [{name: 'Hoodies', href: '/collections/hoodies', current: false}];

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = context.storefront
    .query(VARIANTS_QUERY, {
      variables: {handle: params.handle!},
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  const productDataWithMedia = context.storefront
    .query(VARIANTS_PRODUCT_ITEM_QUERY, {
      variables: {handle: params.handle!},
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
  const allProducts = context.storefront
    .query(ALL_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    variants,
    productDataWithMedia,
    allProducts,
  };
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

const sampleShippingDetails = `
  <ul class="list-disc pl-5 space-y-2 text-gray-700">
    <li>Free shipping on orders over $50</li>
    <li>Standard shipping: 3-5 business days</li>
    <li>Express shipping: 1-2 business days</li>
    <li>International shipping available</li>
    <li>Tracking numbers will be provided once the order ships</li>
    <li>We currently do not offer Saturday or Sunday delivery.</li>
    <li>Shipping rates are calculated at checkout based on your location and selected shipping method.</li>
    <li>If your order is delayed or there is an issue with your shipment, please contact our support team for assistance.</li>
  </ul>
`;

export default function Product() {
  const {product, variants, productDataWithMedia, allProducts} =
    useLoaderData<typeof loader>();
  const selectedVariant = useOptimisticVariant(
    product.selectedVariant,
    variants,
  );
  const {title, descriptionHtml} = product;
  const [focusedImage, setFocusedImage] = useState<MediaImage>(
    selectedVariant?.image, // This is allowed to be undefined
  );
  const {open} = useAside();
  return (
    <div className="mt-12 md:mt-32 flex flex-col items-center">
      <div className="flex flex-col md:flex-row justify-start gap-12 w-full">
        {/* gallery */}
        <Suspense
          fallback={
            <div className="flex flex-col gap-5 items-center justify-start">
              <TwoToneLoader />
              <span>loading images...</span>
            </div>
          }
        >
          <Await resolve={productDataWithMedia}>
            {(data) => (
              <>
                <ProductImages
                  setFocusedImage={setFocusedImage}
                  product={product}
                  variants={variants}
                  selectedVariant={selectedVariant}
                  productDataWithMedia={data}
                />

                {/* Product Info Section*/}
                <div className="flex flex-col min-w-96 ">
                  <div className="w-full flex flex-col p-3 md:p-0 md:sticky md:top-32 ">
                    {' '}
                    {/* <div className="my-5 flex justify-start">
                      <Breadcrumbs pageType="products" />
                    </div> */}
                    <div className="flex flex-col justify-between items-start ">
                      <div className="w-1/2">
                        <span aria-label={`Product title: ${title}`}>
                          {title}
                        </span>
                        <ProductPrice
                          price={selectedVariant?.price}
                          compareAtPrice={selectedVariant?.compareAtPrice}
                        />
                      </div>
                      {/* Sizing */}

                      <Suspense
                        fallback={
                          <ProductForm
                            product={product}
                            selectedVariant={selectedVariant}
                            variants={[]}
                          />
                        }
                      >
                        <Await
                          errorElement="There was a problem loading product variants"
                          resolve={variants}
                        >
                          {(data) => (
                            <ProductForm
                              product={product}
                              selectedVariant={selectedVariant}
                              variants={data?.product?.variants.nodes || []}
                            />
                          )}
                        </Await>
                      </Suspense>
                    </div>
                    <AddToCartButton
                      disabled={
                        !selectedVariant || !selectedVariant.availableForSale
                      }
                      onClick={() => {
                        open('cart');
                      }}
                      lines={
                        selectedVariant
                          ? [
                              {
                                merchandiseId: selectedVariant.id,
                                quantity: 1,
                                selectedVariant,
                              },
                            ]
                          : []
                      }
                    >
                      {selectedVariant?.availableForSale
                        ? 'Add to cart'
                        : 'Sold out'}
                    </AddToCartButton>
                    {/* detials */}
                    <div className=" flex flex-col-reverse  items-center md:justify-between  gap-3 my-12 ">
                      {/* shipping and description */}
                      <Accordion
                        title="Shipping Details"
                        descriptionHtml={sampleShippingDetails}
                      />{' '}
                      <Accordion
                        title="Product Details"
                        descriptionHtml={descriptionHtml}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </Await>
        </Suspense>
      </div>

      {/* //* end */}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
      <Suspense
        fallback={
          <div className="flex flex-col gap-5 items-center justify-start">
            <TwoToneLoader />
            <span>loading images...</span>
          </div>
        }
      >
        {/* Await resolves the productDataWithMedia promise */}
        <Await resolve={allProducts}>
          {(data) => (
            // Ensure that the resolved data is passed correctly
            <>
              <h3 className="text-xl mt-12 newsreader">More Styles</h3>
              <ProductCardList products={data?.products?.nodes || []} />
            </>
          )}
        </Await>
      </Suspense>
      <BasicMarquee />
      <NewsCarousel />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    # metafield(key:'details')y
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    options {
        name
        optionValues {
          name
        }
      }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;

const PRODUCT_ITEM_FRAGMENT = `#graphql
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
        selectedOptions  {
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

const VARIANTS_PRODUCT_ITEM_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT} 

  query ProductItemFragment($handle: String!) {
    product(handle: $handle) {
      ...ProductItem
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

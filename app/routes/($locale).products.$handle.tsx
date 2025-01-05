import {Suspense, useState} from 'react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction} from '@remix-run/react';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Radio,
  RadioGroup,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react';
import {StarIcon} from '@heroicons/react/20/solid';
import {HeartIcon, MinusIcon, PlusIcon} from '@heroicons/react/24/outline';
import type {ProductFragment} from 'storefrontapi.generated';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  Image,
} from '@shopify/hydrogen';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
//TODO: Understand the variants and variant urls
import {getVariantUrl} from '~/lib/variants';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import Accordion from '~/components/Accordion';
import {ProductForm} from '~/components/ProductForm';
import Breadcrumbs from '~/components/BreadCrumbs';
import {TwoToneLoader} from '~/components/Loaders';
import type {Product, ProductVariant} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import ProductCardList from '~/components/ProductList';
import {BasicMarquee} from '~/components/Marquees';
import NewsCarousel from '~/components/NewsCarousel';

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
// Type for the image object inside media.edges.node
type MediaImage = {
  id: string;
  altText?: string;
  url: string;
  width: number;
  height: number;
};

// Type for the edges inside the product media
type MediaEdge = {
  node: {
    image: MediaImage;
  };
};

// Type for the product data, which includes media and variants
type ProductDataWithMedia = {
  product: {
    media: {
      edges: MediaEdge[];
    };
  };
};

// Type for the selected variant, which contains price and compareAtPrice
type SelectedVariant = {
  price: string; // You will need to convert this to MoneyV2 type later
  compareAtPrice: string | null; // Same as above
};
// Type for the function that sets the focused image
type SetFocusedImage = (imageId: string) => void;
// Type for the props for ProductImages
type ProductImagesProps = {
  productDataWithMedia: ProductDataWithMedia;
  product: Product; // Add this to match the product prop passed to ProductImages
  selectedVariant: ProductVariant; // Use ProductVariant for selectedVariant
  setFocusedImage: SetFocusedImage;
};

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
  const [focusedImage, setFocusedImage] = useState<string>(
    selectedVariant?.image,
  );
  return (
    <div className=" mt-32 flex flex-col items-center">
      <div className="flex flex-col-reverse md:flex-row justify-around w-full">
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

                {/* product hero image */}
                <div className="flex flex-col w-full md:w-1/2 ">
                  <ProductImage full image={focusedImage} />
                </div>
              </>
            )}
          </Await>
        </Suspense>
      </div>
      {/* detials */}
      <div className=" flex flex-col-reverse md:flex-row items-center md:justify-between  gap-12 my-12 w-full ">
        {/* shipping and description */}
        <Accordion
          title="Shipping Details"
          descriptionHtml={sampleShippingDetails}
        />{' '}
        <Accordion title="Product Details" descriptionHtml={descriptionHtml} />
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

const ProductImages: React.FC<ProductImagesProps> = ({
  productDataWithMedia,
  product,
  selectedVariant,
  variants,
  setFocusedImage,
}) => {
  const {title, descriptionHtml} = product;
  const mediaLength = productDataWithMedia.product?.media.edges.length;
  const {open} = useAside();

  // Determine the grid class based on the media length
  let gridClassName: string;
  let extraMargin: string;
  switch (true) {
    case mediaLength >= 5:
      gridClassName = 'grid-cols-3'; // for 6 or more images
      extraMargin = 'md:ml-20';
      break;
    case mediaLength === 4:
      gridClassName = 'grid-cols-2'; // for 4 to 5 images
      extraMargin = '';

      break;
    default:
      gridClassName = 'grid-cols-1'; // for fewer than 3 images
      extraMargin = '';
  }

  return (
    <div className={extraMargin}>
      <div className={`flex flex-wrap md:grid ${gridClassName} bg-gray-100`}>
        {productDataWithMedia.product.media?.edges.map((item: MediaEdge) => (
          <>
            {/* mobile */}
            <Image
              onMouseEnter={() => setFocusedImage(item.node.image)}
              key={item.node.image.id + 'mobile'}
              style={{borderRadius: 0, width: '50%'}}
              src={item.node.image.url}
              alt={item.node.image.altText || 'Product Image'}
              className="h-72 object-cover md:hidden"
              sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 100vw"
            />
            {/* desktop */}
            <Image
              onMouseEnter={() => setFocusedImage(item.node.image)}
              key={item.node.image.id + 'desktop'}
              style={{borderRadius: 0, width: '100%'}}
              src={item.node.image.url}
              alt={item.node.image.altText || 'Product Image'}
              className="h-72 object-cover hidden md:block"
              sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 100vw"
            />
          </>
        ))}
      </div>
      {/* breadcrumbs */}
      <div className="my-5 flex justify-center md:justify-start">
        <Breadcrumbs pageType="products" />
      </div>
      <div className="mt-8 w-full  flex flex-col p-3 md:p-0  ">
        <div className="flex flex-col md:flex-row justify-between items-start ">
          <div className="w-1/2">
            <h1>{title}</h1>
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
          disabled={!selectedVariant || !selectedVariant.availableForSale}
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
          {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
        </AddToCartButton>
      </div>
    </div>
  );
};

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

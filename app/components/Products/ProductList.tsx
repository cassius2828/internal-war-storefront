import {Link, useLoaderData} from '@remix-run/react';
import {VariantSelector} from '@shopify/hydrogen';
import {formatPrice, getAvailableSizeVariants} from '~/lib/utils';
import type {
  CartLine,
  Product,
  ProductOption,
  ProductOptionValue,
} from '@shopify/hydrogen/storefront-api-types';
import {ProductCardProps} from 'customTypes';
import {useEffect, useState} from 'react';
import {AddToCartButton, AddToCartButtonNoSubmit} from '../AddToCartButton';
import {useAside} from '../Aside';

export default function ProductCardList({products}: {products: Product[]}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 md:px-16 lg:px-24">
        <h2 className="text-2xl md:text-3xl font-light tracking-wide text-neutral-900 mb-10 md:mb-14 newsreader">
          Featured Products
        </h2>
        <div className="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4 lg:gap-10">
          {products?.map((product: Product) => {
            return (
              <ProductCard
                key={product.id}
                lines={lines}
                setLines={setLines}
                product={product}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  loading = 'lazy',
  lines,
  setLines,
}) => {
  const formattedPrice = formatPrice(
    product.priceRange.maxVariantPrice?.amount ||
      product.priceRange.minVariantPrice?.amount,
  );
  const {storefront} = useLoaderData<any>();
  const availableSizes = getAvailableSizeVariants(product);
  const [showAddToCart, setShowAddToCart] = useState<boolean>(false);
  const [activeArr, setActiveArr] = useState<string[]>([]);
  const {open} = useAside();
  // if no buttons are selected then remove add to cart btn
  const handleShowAddToCart = () => {
    if (activeArr.length === 0) {
      setShowAddToCart(false);
    } else {
      setShowAddToCart(true);
    }
  };
  useEffect(() => {
    // ensures we are using a fresh state to reflect the value of the array
    handleShowAddToCart();
  }, [activeArr]);
  return (
    <div className="group relative flex flex-col">
      <Link prefetch="intent" to={`/products/${product.handle}?Size=M`}>
        <div className="relative w-full overflow-hidden rounded-sm bg-neutral-100" style={{ aspectRatio: '1 / 1' }}>
          {/* Primary image - fades out on hover */}
          <img
            src={product.media?.edges[0]?.node.image.url}
            alt={product.featuredImage?.altText || product.title}
            className="absolute inset-0 w-full h-full object-cover object-center
                       transition-opacity duration-300 ease-out
                       opacity-100 group-hover:opacity-0"
          />
          {/* Hover image - fades in on hover, preloaded */}
          {product.media?.edges[1] && (
            <img
              src={product.media.edges[1].node.image.url}
              alt={product.featuredImage?.altText || product.title}
              className="absolute inset-0 w-full h-full object-cover object-center
                         transition-opacity duration-300 ease-out
                         opacity-0 group-hover:opacity-100"
            />
          )}
        </div>
        <div className="mt-4 flex justify-between items-start gap-2">
          <h3 className="text-sm md:text-base font-light text-neutral-900 leading-snug">
            {product.title}
          </h3>
          <p className="text-sm md:text-base font-medium text-neutral-900 whitespace-nowrap">
            ${formattedPrice}
          </p>
        </div>
      </Link>
      {/* Size Selector using VariantSelector */}
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={product.variants}
        setActiveArr={setActiveArr}
        lines={lines}
        setLines={setLines}

        // handleShowAddToCart={handleShowAddToCart}
      >
        {({option}) => {
          // console.log(option, ' <-- option');
          // console.log(option.values, ' <-- option.values');
          // console.log(
          //   option.values[0].isActive,
          //   ' <-- option.vales[0].isActive',
          // );

          return (
            <div className="mt-4">
              <div className="flex gap-2 md:gap-3 items-center justify-center">
                {option.values.map((item) => {
                  const {value, isAvailable, to, isActive} = item;
                  const variantId = item?.variant?.id;
                  const linkIsInActiveArr = activeArr.includes(variantId);
                  // toggles active arr size btns
                  const handleAddToActiveArr = async () => {
                    if (!linkIsInActiveArr && variantId) {
                      const data = await fetchProductByVariantId(
                        variantId,
                        storefront,
                      );

                      setActiveArr((prev) => [...prev, variantId]);
                      setLines((prev) => [...prev, {data}]);
                    } else {
                      setActiveArr((prev) =>
                        prev.filter((value) => value !== variantId),
                      );
                      setLines((prev) =>
                        prev.filter((value) => value.id !== variantId),
                      );
                    }
                  };
                  return (
                    <button
                      onClick={() => {
                        handleAddToActiveArr();
                      }}
                      key={value}
                      type="button"
                      disabled={!isAvailable}
                      className={`
                        min-w-8 md:min-w-10 px-2 py-1.5 text-xs md:text-sm font-medium
                        border rounded-sm transition-all duration-200
                        ${linkIsInActiveArr
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : isAvailable
                            ? 'bg-white text-neutral-900 border-neutral-300 hover:border-neutral-900'
                            : 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                        }
                      `}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }}
      </VariantSelector>

      <div className="flex justify-center items-center h-12 ">
        {showAddToCart && (
          <AddToCartButtonNoSubmit
            onClick={() => open('cart')}
            lines={
              activeArr.length > 0
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
            add to cart
          </AddToCartButtonNoSubmit>
        )}
      </div>

      {/* <SizeBtnGroup product={product} sizes={availableSizes} /> */}
    </div>
  );
};
export async function fetchProductByVariantId(id: string, storefront) {
  const query = `
    ${PRODUCT_VARIANT_BY_ID_QUERY}
  `;

  const variables = {id};
console.log(storefront)
  const response = await storefront?.query(query, {variables});
  console.log(response, ' <-- RESPONSE');
  return response?.product;
}
export const PRODUCT_VARIANT_BY_ID_QUERY = `#graphql
  query ProductById($id: ID!){

      variants(id: $id) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  
` as const;

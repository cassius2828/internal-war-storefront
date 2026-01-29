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
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div className=" grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
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
  console.log(storefront, ",-- SF")
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
    console.log(activeArr);
    // ensures we are using a fresh state to reflect the value of the array
    handleShowAddToCart();
  }, [activeArr]);
  return (
    <div className="group relative flex flex-col justify-between">
      {/* //TODO: when no query it auto adds ?Size=S; locate origin and find out if this could be change to not include a query by default */}
      <Link prefetch="intent" to={`/products/${product.handle}?Size=M`}>
        <div>
          <img
            alt={product.featuredImage?.altText}
            src={product.media?.edges[0].node.image.url}
            className="group-hover:hidden fade-in-quick aspect-square w-full md:min-w-70 rounded-md bg-gray-200 object-cover lg:aspect-auto lg:h-80"
          />
          {/* later loading since these are hidden wihtout hover */}
          <img
            loading={loading}
            fetchPriority="low"
            alt={product.featuredImage?.altText}
            src={product.media?.edges[1].node.image.url}
            className="group-hover:block fade-in-quick hidden aspect-square w-full md:min-w-70 rounded-md bg-gray-200 object-cover lg:aspect-auto lg:h-80"
          />
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-sm text-gray-700">
                <a href={product.onlineStoreUrl || ''}>
                  <span aria-hidden="true" className="absolute inset-0" />
                  {product.title}
                </a>
              </h3>
            </div>
            <p className="text-sm font-medium text-gray-900">
              ${formattedPrice}
            </p>
          </div>
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
            <>
              <div className="mt-4">
                <div className="flex gap-4 items-center  my-3 relative   justify-center ">
                  {option.values.map((item) => {
                    const {value, isAvailable, to, isActive} = item;
                    const variantId = item?.variant?.id;
                    const linkIsInActiveArr = activeArr.includes(variantId);
                    // console.log(item);
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
                          // this logic needs to check for one true value in isactivearr
                          handleAddToActiveArr();
                        }}
                        key={value}
                        type="button"
                        className={`${
                          linkIsInActiveArr
                            ? 'active bg-neutral-950 text-gray-100'
                            : isAvailable
                            ? ''
                            : 'opacity-80'
                        } rounded-sm bg-gray-200 drop-shadow-md md:min-w-8 px-2 py-1 text-xs md:text-sm font-semibold text-neautral-800 shadow-sm hover:bg-black hover:text-gray-100 transition-colors duration-200 newsreader`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
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

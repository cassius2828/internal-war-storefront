import {Link} from '@remix-run/react';
import {VariantSelector} from '@shopify/hydrogen';
import {formatPrice, getAvailableSizeVariants} from '~/lib/utils';
import type {
  Product,
  ProductOption,
  ProductOptionValue,
} from '@shopify/hydrogen/storefront-api-types';
import {ProductCardProps} from 'customTypes';
import {useEffect, useState} from 'react';

export default function ProductCardList({products}: {products: Product[]}) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div className=" grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products?.map((product: Product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      </div>
    </div>
  );
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  loading = 'lazy',
}) => {
  const formattedPrice = formatPrice(
    product.priceRange.maxVariantPrice?.amount ||
      product.priceRange.minVariantPrice?.amount,
  );
  const availableSizes = getAvailableSizeVariants(product);
  const [showAddToCart, setShowAddToCart] = useState<boolean>(false);
  const [activeArr, setActiveArr] = useState<string[]>([]);
  console.log(product, ' <-- product');

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
    <div className="group relative flex flex-col justify-between relative">
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
                  {option.values.map(({value, isAvailable, to, isActive}) => {
                    console.log(activeArr);
                    const linkIsInActiveArr = activeArr.includes(to);
                    console.log(linkIsInActiveArr, ' <-- lisar');

                    // toggles active arr size btns
                    const handleAddToActiveArr = () => {
                      if (!linkIsInActiveArr) {
                        setActiveArr((prev) => [...prev, to]);
                      } else {
                        setActiveArr((prev) =>
                          prev.filter((value) => value !== to),
                        );
                      }
                    };
                    return (
                      <button
                        onClick={() => {
                          // this logic needs to check for one true value in isactivearr
                          // handleShowAddToCart();
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
          <button className=" bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-700 uppercase min-w-40 mt-6">
            add to cart
          </button>
        )}
      </div>

      {/* <SizeBtnGroup product={product} sizes={availableSizes} /> */}
    </div>
  );
};

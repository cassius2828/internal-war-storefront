import {Link} from '@remix-run/react';
import {VariantSelector} from '@shopify/hydrogen';
import {formatPrice, getAvailableSizeVariants} from '~/lib/utils';
import type {
  Product,
  ProductOption,
} from '@shopify/hydrogen/storefront-api-types';

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

type ProductCardProps = {
  product: Product;
  loading?: 'lazy' | 'eager';
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  loading = 'lazy',
}) => {
  const formattedPrice = formatPrice(
    product.priceRange.maxVariantPrice?.amount ||
      product.priceRange.minVariantPrice?.amount,
  );
  const availableSizes = getAvailableSizeVariants(product);

  return (
    <div className="group relative flex flex-col justify-between">
      <div>
        <img
          alt={product.featuredImage?.altText}
          src={product.media?.edges[0].node.image.url}
          className="group-hover:hidden aspect-square w-full rounded-md bg-gray-200 object-cover lg:aspect-auto lg:h-80"
        />
        <img
          alt={product.featuredImage?.altText}
          src={product.media?.edges[1].node.image.url}
          className="group-hover:block hidden aspect-square w-full rounded-md bg-gray-200 object-cover lg:aspect-auto lg:h-80"
        />
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700">
              <a href={product.onlineStoreUrl || ''}>
                <span aria-hidden="true" className="absolute inset-0" />
                {product.title}
              </a>
            </h3>
            {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
          </div>
          <p className="text-sm font-medium text-gray-900">${formattedPrice}</p>
        </div>
      </div>
      {/* Size Selector using VariantSelector */}
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={product.variants}
      >
        {({option}) => {
          return (
            <>
              <div className="mt-4">
                <div>{option.name}</div>
                <div className="flex gap-4 items-center  my-3 relative   justify-center ">
                  {option.values.map(({value, isAvailable, to, isActive}) => (
                    <Link
                      to={to}
                      prefetch="intent"
                      className={`${
                        isActive ? 'active' : isAvailable ? '' : 'opacity-80'
                      }`}
                      key={value}
                    >
                      <button
                        type="button"
                        className="rounded-sm bg-gray-200 drop-shadow-md md:min-w-8 px-2 py-1 text-xs md:text-sm font-semibold text-neautral-800 shadow-sm hover:bg-black hover:text-gray-100 transition-colors duration-200 newsreader"
                      >
                        {value}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          );
        }}
      </VariantSelector>
      {/* <SizeBtnGroup product={product} sizes={availableSizes} /> */}
    </div>
  );
};

import {Link} from '@remix-run/react';
import {type VariantOption, VariantSelector} from '@shopify/hydrogen';
import {Radio, RadioGroup} from '@headlessui/react';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {useState} from 'react';

export function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  return (
    <div className="product-form w-full">
      <VariantSelector
        handle={product.handle}
        options={product.options.filter((option) => option.values.length > 1)}
        variants={variants}
      >
        {({option}) => <SizePicker key={option.name} option={option} />}
      </VariantSelector>
    </div>
  );
}
type DeepObject = Record<string, any>; // A generic type for deeply nested objects

interface Option {
  name: string;
  value: string;
  values: DeepObject[]; // Array of objects with unknown structure
}
export const SizePicker = ({option}: {option: Option}) => {
  const [selectedSize, setSelectedSize] = useState(option.values[0] || 'S');

  return (
    <div>
      <div className="flex items-center justify-start gap-12">
        <h2 className="text-sm font-medium text-gray-900">{option.name}</h2>
      </div>

      <fieldset aria-label={`Choose a ${option.name}`} className="mt-3">
        <RadioGroup
          value={selectedSize}
          onChange={setSelectedSize}
          className="flex gap-8"
        >
          {reorderSizingArray(option.values).map(
            ({value, isAvailable, isActive, to}) => (
              <Link
                className={'p-0 max-w-32'}
                key={option.name + value}
                prefetch="intent"
                preventScrollReset
                replace
                to={to}
              >
                <Radio
                  key={value}
                  value={value}
                  disabled={!isAvailable}
                  className={classNames(
                    isAvailable
                      ? 'cursor-pointer focus:outline-none'
                      : 'cursor-not-allowed opacity-25 text-9xl',
                    'flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-3 text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 data-[checked]:border-transparent data-[checked]:bg-neutral-900 data-[checked]:text-white data-[focus]:ring-2 data-[focus]:ring-neutral-500 data-[focus]:ring-offset-2 data-[checked]:hover:bg-neutral-700 sm:flex-1',
                  )}
                >
                  {value || 'N/A'}
                </Radio>
              </Link>
            ),
          )}
        </RadioGroup>
      </fieldset>
      {/* <a
        href="/"
        className="text-xs font-medium text-neutral-600 hover:text-neutral-500"
      >
        See sizing chart
      </a> */}
    </div>
  );
};

// utils
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
const reorderSizingArray = (
  sizingArr: {value: string; [key: string]: any}[],
) => {
  if (!sizingArr) return [];

  const expectedOrder =
    sizingArr.length === 4
      ? ['S', 'M', 'L', 'XL']
      : sizingArr.length === 5
      ? ['S', 'M', 'L', 'XL', 'XXL']
      : sizingArr.map((item) => item.value);

  const sizeMap = new Map(sizingArr.map((item) => [item.value, {...item}])); // Deep copy objects

  // Return reordered array using the expected order
  return expectedOrder.map((size) => sizeMap.get(size)).filter(Boolean);
};

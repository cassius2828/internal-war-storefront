import {Link} from '@remix-run/react';

import {Radio, RadioGroup} from '@headlessui/react';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {useState} from 'react';
import {VariantSelector} from '@shopify/hydrogen';

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
        options={product.options.filter(
          (option) => option.optionValues.length > 1,
        )}
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
  optionValues: DeepObject[]; // Array of objects with unknown structure
}
// temp deleting option?.optionValues[0]
export const SizePicker = ({option}: {option: Option}) => {
  const [selectedSize, setSelectedSize] = useState(option?.values[0] || 'S');

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
                    `flex items-center justify-center rounded-md border  px-3 py-3 text-sm font-medium uppercase sm:flex-1 ${
                      isActive
                        ? 'border-transparent bg-neutral-900 text-white ring-2 ring-neutral-500 ring-offset-2 hover:bg-neutral-700'
                        : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50 '
                    }`,
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

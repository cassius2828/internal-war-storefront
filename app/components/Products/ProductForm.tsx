import {Link} from '@remix-run/react';

import {Radio, RadioGroup} from '@headlessui/react';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {useState} from 'react';
import {VariantSelector} from '@shopify/hydrogen';
import type {ProductVariant} from '@shopify/hydrogen';

type ProductOptionValueCustom = {
  value: string;
  optionValue: {name: string};
  search: string;
  isActive: boolean;
  isAvailable: boolean;
  to: string;
  variant: ProductVariant;
};
interface Option {
  name: string;
  values: ProductOptionValueCustom[];
}

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

export const SizePicker = ({option}: {option: Option}) => {
  const [selectedSize, setSelectedSize] = useState(option?.values[0] || 'S');

  return (
    <div className="w-full">
      {/* Option label */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-light tracking-wide text-neutral-600 uppercase">
          {option.name}
        </span>
        <button
          type="button"
          className="text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-900 transition-colors"
        >
          Size guide
        </button>
      </div>

      <fieldset aria-label={`Choose a ${option.name}`}>
        <RadioGroup
          value={selectedSize}
          onChange={setSelectedSize}
          className="grid grid-cols-4 gap-2"
        >
          {option.values.map(({value, isAvailable, isActive, to}) => (
            <Link
              className="block"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
            >
              <Radio
                value={value}
                disabled={!isAvailable}
                className={`
                  relative flex items-center justify-center py-3 text-sm font-light tracking-wide
                  transition-all duration-200 ease-out
                  ${
                    isAvailable
                      ? 'cursor-pointer'
                      : 'cursor-not-allowed opacity-40'
                  }
                  ${
                    isActive
                      ? 'bg-neutral-900 text-white border border-neutral-900'
                      : 'bg-white text-neutral-900 border border-neutral-300 hover:border-neutral-900'
                  }
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1
                `}
              >
                {value || 'N/A'}
                {/* Strikethrough for unavailable */}
                {!isAvailable && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-full h-px bg-neutral-400 rotate-[-20deg]" />
                  </span>
                )}
              </Radio>
            </Link>
          ))}
        </RadioGroup>
      </fieldset>
    </div>
  );
};

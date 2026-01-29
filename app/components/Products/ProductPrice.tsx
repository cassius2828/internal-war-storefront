import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {comparePrice} from '~/lib/utils';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  const result = compareAtPrice
    ? comparePrice(price?.amount, compareAtPrice?.amount)
    : null;
  const hasDiscount = result?.isBasePriceLessThanComparedPrice;

  return (
    <div className="flex items-baseline gap-3">
      {price ? (
        <span
          className={`
            text-lg font-light tracking-wide
            ${hasDiscount ? 'text-red-600' : 'text-neutral-900'}
          `}
        >
          <Money data={price} />
        </span>
      ) : (
        <span className="text-lg font-light tracking-wide text-neutral-400">
          —
        </span>
      )}

      {hasDiscount && compareAtPrice && (
        <span className="text-sm font-light text-neutral-400 line-through">
          <Money data={compareAtPrice} />
        </span>
      )}
    </div>
  );
}

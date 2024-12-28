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
  if (!compareAtPrice)
    return (
      <div className="product-price">
        {price ? <Money data={price} /> : <span>&nbsp;</span>}
      </div>
    );
  const result = comparePrice(price?.amount, compareAtPrice?.amount);

  return (
    <div className="product-price">
      {compareAtPrice ? (
        <div className="product-price-on-sale">
          {price ? <Money data={price} /> : null}
          {result.isBasePriceLessThanComparedPrice && (
            <s>
              <Money data={compareAtPrice} />
            </s>
          )}
        </div>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}

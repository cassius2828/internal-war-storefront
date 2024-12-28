import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Await, Link} from '@remix-run/react';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faExclamationCircle} from '@fortawesome/free-solid-svg-icons';
import {Suspense} from 'react';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise, quantity} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  console.log(line, ' <-- line cart line');
  console.log(product, ' <-- product cart line');
  return (
    <>
      <li key={product.id} className="flex py-6">
        <div className="shrink-0">
          {image && (
            <Image
              alt={product.title}
              aspectRatio="1/1"
              data={image}
              height={100}
              loading="lazy"
              width={100}
            />
          )}
        </div>

        <div className="ml-4 flex flex-1 flex-col sm:ml-6">
          <div>
            <div className="flex justify-between">
              <h4 className="text-sm">
                {selectedOptions.map((option, index) => (
                  <Link
                    key={index}
                    prefetch="intent"
                    to={lineItemUrl}
                    onClick={() => {
                      if (layout === 'aside') {
                        close();
                      }
                    }}
                  >
                    <strong>{product.title}</strong>
                  </Link>
                ))}
              </h4>

              <ProductPrice
                price={
                  line?.cost?.totalAmount || {
                    amount: (
                      Number(merchandise.price.amount.slice(0, 2)) * quantity
                    ).toString(),
                    currencyCode: merchandise.price.currencyCode,
                  }
                }
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Size: {selectedOptions[0].value}
            </p>
            <CartLineQuantity line={line} />
          </div>

          <div className="mt-4 flex flex-1 items-end justify-between">
            <p className="flex items-center space-x-2 text-sm text-gray-700">
              {line.merchandise.availableForSale ? (
                <FontAwesomeIcon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-green-500"
                  icon={faCheck}
                />
              ) : (
                <FontAwesomeIcon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-gray-300"
                  icon={faExclamationCircle}
                />
              )}

              <span>
                {line.merchandise.availableForSale
                  ? 'In stock'
                  : 'Out of stock'}
              </span>
            </p>
            <div className="ml-4">
              <button
                type="button"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                <CartLineRemoveButton
                  lineIds={[line.id]}
                  disabled={!!line.isOptimistic}
                />
              </button>
            </div>
          </div>
        </div>
      </li>
    </>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center space-x-2">
      <small className="text-sm text-gray-600">Quantity: {quantity}</small>

      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
          className="flex items-center justify-center p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-all duration-200 disabled:opacity-50"
        >
          <span className="text-xl">&#8722;</span>
        </button>
      </CartLineUpdateButton>

      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
          className="flex items-center justify-center p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-all duration-200 disabled:opacity-50"
        >
          <span className="text-xl">&#43;</span>
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button disabled={disabled} type="submit">
        Remove
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, Money, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from '@remix-run/react';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

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
  const {id, merchandise, quantity, cost} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const isOptimistic = !!line.isOptimistic;

  return (
    <div className={`cart-line-item ${isOptimistic ? 'cart-line-optimistic' : ''}`}>
      {/* Product Image */}
      <Link
        to={lineItemUrl}
        onClick={() => layout === 'aside' && close()}
        className="cart-line-image"
      >
        {image && (
          <Image
            alt={product.title}
            aspectRatio="1/1"
            data={image}
            height={100}
            width={100}
            loading="lazy"
          />
        )}
      </Link>

      {/* Product Details */}
      <div className="cart-line-details">
        <div className="cart-line-header">
          <div className="cart-line-info">
            <Link
              to={lineItemUrl}
              onClick={() => layout === 'aside' && close()}
              className="cart-line-title"
            >
              {product.title}
            </Link>
            <div className="cart-line-options">
              {selectedOptions.map((option, index) => (
                <span key={index} className="cart-line-option">
                  {option.name}: {option.value}
                </span>
              ))}
            </div>
          </div>
          <div className="cart-line-price">
            {cost?.totalAmount ? (
              <Money data={cost.totalAmount} />
            ) : (
              <Money data={merchandise.price} />
            )}
          </div>
        </div>

        {/* Quantity and Actions */}
        <div className="cart-line-actions">
          <CartLineQuantity line={line} />
          <div className="cart-line-meta">
            <span className={`cart-line-stock ${merchandise.availableForSale ? 'in-stock' : 'out-of-stock'}`}>
              {merchandise.availableForSale ? (
                <>
                  <CheckIcon />
                  In stock
                </>
              ) : (
                <>
                  <AlertIcon />
                  Out of stock
                </>
              )}
            </span>
            <CartLineRemoveButton lineIds={[line.id]} disabled={isOptimistic} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 */
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-quantity-selector">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          className="cart-quantity-btn"
          type="submit"
        >
          <MinusIcon />
        </button>
      </CartLineUpdateButton>

      <span className="cart-quantity-value">{quantity}</span>

      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          disabled={!!isOptimistic}
          className="cart-quantity-btn"
          type="submit"
        >
          <PlusIcon />
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

/**
 * A button that removes a line item from the cart.
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
      <button
        disabled={disabled}
        type="submit"
        className="cart-remove-btn"
        aria-label="Remove item"
      >
        <TrashIcon />
        <span>Remove</span>
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

// Icon Components
function MinusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

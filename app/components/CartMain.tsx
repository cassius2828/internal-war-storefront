import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const cartHasItems = cart?.totalQuantity! > 0;

  return (
    <div className="cart-modern">
      <CartEmpty hidden={linesCount} layout={layout} />
      {linesCount && (
        <div className="cart-content">
          {/* Cart Items Header */}
          <div className="cart-items-header">
            <span className="cart-items-count">
              {cart?.totalQuantity} {cart?.totalQuantity === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Cart Items List */}
          <div className="cart-items-list">
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </div>

          {/* Cart Summary */}
          {cartHasItems && (
            <CartSummary cart={cart} layout={layout} withDiscount={withDiscount} />
          )}
        </div>
      )}
    </div>
  );
}

function CartEmpty({
  hidden = false,
  layout,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();

  if (hidden) return null;

  return (
    <div className="cart-empty">
      <div className="cart-empty-icon">
        <CartEmptyIcon />
      </div>
      <h3 className="cart-empty-title">Your cart is empty</h3>
      <p className="cart-empty-text">
        Looks like you haven't added anything to your cart yet. Browse our collection and find something you love.
      </p>
      <button onClick={close} className="cart-empty-btn">
        Continue Shopping
        <ArrowRightIcon />
      </button>
    </div>
  );
}

function CartEmptyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useState} from 'react';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
  withDiscount?: boolean | null;
};

export function CartSummary({cart, layout, withDiscount}: CartSummaryProps) {
  return (
    <div className="cart-summary">
      {/* Discount Section */}
      <CartDiscounts discountCodes={cart.discountCodes} />

      {/* Order Summary */}
      <div className="cart-summary-totals">
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span className="cart-summary-value">
            {cart.cost?.subtotalAmount?.amount ? (
              <Money data={cart.cost.subtotalAmount} />
            ) : (
              '—'
            )}
          </span>
        </div>

        {withDiscount && cart.cost?.totalAmount && (
          <div className="cart-summary-row cart-summary-discount">
            <span>Discount</span>
            <span className="cart-summary-value discount-value">
              -<Money
                data={{
                  amount: String(
                    Number(cart.cost.subtotalAmount?.amount || 0) -
                      Number(cart.cost.totalAmount?.amount || 0)
                  ),
                  currencyCode: cart.cost.subtotalAmount?.currencyCode || 'USD',
                }}
              />
            </span>
          </div>
        )}

        <div className="cart-summary-row cart-summary-shipping">
          <span>Shipping</span>
          <span className="cart-summary-value shipping-note">Calculated at checkout</span>
        </div>

        <div className="cart-summary-row cart-summary-total">
          <span>Total</span>
          <span className="cart-summary-value">
            {cart.cost?.totalAmount?.amount ? (
              <Money data={cart.cost.totalAmount} />
            ) : (
              '—'
            )}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />

      {/* Security Note */}
      <div className="cart-security-note">
        <LockIcon />
        <span>Secure checkout powered by Shopify</span>
      </div>
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <a href={checkoutUrl} target="_self" className="cart-checkout-btn">
      <span>Continue to Checkout</span>
      <ArrowRightIcon />
    </a>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="cart-discount-section">
      {/* Applied Discounts */}
      {codes.length > 0 && (
        <div className="cart-applied-discounts">
          {codes.map((code) => (
            <div key={code} className="cart-discount-tag">
              <TagIcon />
              <span>{code}</span>
              <UpdateDiscountForm>
                <button type="submit" className="cart-discount-remove" aria-label="Remove discount">
                  <CloseIcon />
                </button>
              </UpdateDiscountForm>
            </div>
          ))}
        </div>
      )}

      {/* Add Discount Toggle */}
      <button
        type="button"
        className="cart-discount-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <TagIcon />
        <span>Add discount code</span>
        <ChevronIcon isExpanded={isExpanded} />
      </button>

      {/* Discount Input Form */}
      {isExpanded && (
        <UpdateDiscountForm discountCodes={codes}>
          <div className="cart-discount-form">
            <input
              type="text"
              name="discountCode"
              placeholder="Enter code"
              className="cart-discount-input"
              autoComplete="off"
            />
            <button type="submit" className="cart-discount-apply">
              Apply
            </button>
          </div>
        </UpdateDiscountForm>
      )}
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

// Icon Components
function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ChevronIcon({isExpanded}: {isExpanded: boolean}) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease',
      }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

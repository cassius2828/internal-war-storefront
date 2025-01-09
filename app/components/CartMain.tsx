import {useOptimisticCart} from '@shopify/hydrogen';
import {Link, useFetcher} from '@remix-run/react';
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
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity! > 0;
  return (
    <div className={className + ' mt-20'}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details">
        <div aria-labelledby="cart-lines">
          <ul className="divide-y divide-gray-200 border-b border-t border-gray-200 h-96">
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const fetcher = useFetcher();
  const {close} = useAside();
  const handleNavigateToCollections = async () => {
    close();

    // Trigger fetcher to load the cart from the server
    fetcher.load('/cart'); // Replace '/cart' with the endpoint for loading your cart

    // Use a short delay to wait for fetcher to complete (optional)
    setTimeout(() => {
      console.log(fetcher.data, '<-- Fetched cart data'); // Log the cart data
    }, 1000); // Adjust the delay as needed
  };
  return (
    <div className="newsreader" hidden={hidden}>
      <br />
      <p>
        Your cart is waiting for its first items. Explore our collection and add
        some bold new pieces.
      </p>
      <br />
      {/* when i navigate to a new page, i need to ensure the cart stays updated */}

      <button
        onClick={close}
        type="button"
        className=" bg-neutral-800 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Continue shopping →
      </button>
    </div>
  );
}

import {Suspense, useState} from 'react';
import {Await, Link, NavLink, useAsyncValue} from '@remix-run/react';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faShoppingCart,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

// import {json, LoaderFunction} from '@remix-run/node';
import {Storefront} from '@shopify/hydrogen';
interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

// export const loader: LoaderFunction = async ({params, context}) => {
//   const collectionHandle = params.collectionHandle; // Assuming the collection handle is passed via route params

//   if (!collectionHandle) {
//     throw new Response('Collection handle is required', {status: 400});
//   }

//   const query = `
//     query($handle: String!) {
//       collectionByHandle(handle: $handle) {
//         id
//         title
//         description
//         products(first: 3) {
//           edges {
//             node {
//               id
//               title
//               featuredImage {
//                 url
//               }
//             }
//           }
//         }
//       }
//     }
//   `;

//   try {
//     // Here we use the Storefront instance to execute the query
//     const response = await Storefront.query({
//       query,
//       variables: {
//         handle: collectionHandle,
//       },
//     });

//     const collection = response.data.collectionByHandle;

//     if (!collection) {
//       throw new Response('Collection not found', {status: 404});
//     }

//     return json({collection});
//   } catch (error) {
//     console.error('Error fetching collection:', error);
//     throw new Response('Error fetching collection', {status: 500});
//   }
// };

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const {showDropdown} = useAside();
  return (
    <header className="header fixed z-10 flex justify-between items-center w-full px-5 md:px-20 bg-neutral-100  transition-colors duration-200">
      <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
        <h1 className="uppercase font-light text-3xl">{shop.name}</h1>
      </NavLink>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      {showDropdown && <DropdownHeaderMenu />}
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport} uppercase font-thin`;
  const {close, setShowDropdown} = useAside();

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            onMouseEnter={() => setShowDropdown(true)}
            className="header-menu-item relative"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}
export function DropdownHeaderMenuSqrFull() {
  const [showShopBtn, setShowShopBtn] = useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setShowShopBtn(true)}
      onMouseLeave={() => setShowShopBtn(false)}
      className=" h-full bg-neutral-200 cursor-pointer relative"
    >
      <img
        className="w-full h-full object-contain"
        src="https://cdn.shopify.com/s/files/1/0640/4082/9110/files/rmblackhoodieback-Photoroom-4.png?v=1710190227"
        alt=""
      />
      {showShopBtn && <ShopBtnDropdownNav />}
    </div>
  );
}

export function DropdownHeaderMenuSqrHalf() {
  const [showShopBtn, setShowShopBtn] = useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setShowShopBtn(true)}
      onMouseLeave={() => setShowShopBtn(false)}
      className=" h-[48.75%] bg-neutral-300 cursor-pointer relative"
    >
      <img
        className="w-full h-full object-contain"
        src="https://cdn.shopify.com/s/files/1/0640/4082/9110/files/rmhoodiepinkfront-Photoroom-2.png?v=1710191440"
        alt=""
      />
      {showShopBtn && <ShopBtnDropdownNav />}
    </div>
  );
}
export function DropdownHeaderMenu() {
  const {showDropdown, setShowDropdown} = useAside();

  return (
    <div
      onMouseLeave={() => setShowDropdown(false)}
      className="w-full h-[20rem] px-20 py-2 bg-neutral-100 flex justify-start gap-2 absolute top-24 left-0"
    >
      {/* col 1 */}
      <DropdownHeaderMenuSqrFull />
      {/* col 2 */}
      <div className="flex flex-col gap-2">
        {/* col 2 row 1 */}
        <DropdownHeaderMenuSqrHalf />
        {/* col 2 row 2 */}
        <DropdownHeaderMenuSqrHalf />
      </div>
      <button
        onClick={() => setShowDropdown(false)}
        className="absolute right-2 top-0 text-3xl font-thin"
      >
        x
      </button>
    </div>
  );
}

export function ShopBtnDropdownNav({collectionPath}: {collectionPath: string}) {
  return (
    <Link to={collectionPath}>
      <div className="bg-black opacity-40 w-full h-full absolute top-0 left-0"></div>
      <button className="text-gray-100 border px-4 py-2 rounded-sm absolute top-1/2 left-1/2 -translate-1/2 cursor-pointer">
        SHOP
      </button>
    </Link>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <NavLink prefetch="intent" to="/account">
        <Suspense fallback="Sign in">
          {/* <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await> */}
          <FontAwesomeIcon icon={faUser} />
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
      <HeaderMenuMobileToggle />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      <FontAwesomeIcon icon={faSearch} />
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <FontAwesomeIcon icon={faShoppingCart} />{' '}
      {count === null ? (
        <span>&nbsp;</span>
      ) : (
        <span className="absolute top-4">{count}</span>
      )}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : undefined,
  };
}

import {Suspense, useEffect, useState} from 'react';
import {
  Await,
  Link,
  NavLink,
  useAsyncValue,
  useFetcher,
  useLoaderData,
  useLocation,
} from '@remix-run/react';
import {
  type CartViewPayload,
  Image,
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

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const {showDropdown} = useAside();

  return (
    <header className="header fixed z-10 flex justify-between items-center w-full px-5 py-4 md:py-0 md:px-20 bg-neutral-100  transition-colors duration-200">
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
  const className = `header-menu-${viewport} uppercase font-thin my-10`;
  const {close, setHoveredHandle, setShowDropdown, setHoveredCollectionUrl} =
    useAside();
  const fetcher = useFetcher();
  const handleHoverNavItem = (title: string, url: string) => {
    setHoveredHandle(title?.toLocaleLowerCase());
    setHoveredCollectionUrl(url);
    setShowDropdown(true);
  };
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
            // onMouseEnter={() => handleShowDropdown(hoveredHandle)}
            onMouseEnter={() => handleHoverNavItem(item.title, url)}
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
export function DropdownHeaderMenuSqrFull({
  img,
  url,
}: {
  img: string;
  url: string;
}) {
  const [showShopBtn, setShowShopBtn] = useState<boolean>(false);
  return (
    <div
      onMouseEnter={() => setShowShopBtn(true)}
      onMouseLeave={() => setShowShopBtn(false)}
      className="h-full bg-neutral-200 cursor-pointer relative max-w-50"
    >
      <Image className="w-full h-full object-contain" src={img} alt="" />
      {showShopBtn && <ShopBtnDropdownNav actionDescription={null} url={url} />}
    </div>
  );
}

export function DropdownHeaderMenuSqrHalf({
  img,
  url,
}: {
  img: string;
  url: string;
}) {
  const [showShopBtn, setShowShopBtn] = useState<boolean>(false);

  return (
    <div
      style={{height: '48.75%'}}
      onMouseEnter={() => setShowShopBtn(true)}
      onMouseLeave={() => setShowShopBtn(false)}
      // added max-w for safari compatibility
      className="  bg-neutral-300 cursor-pointer relative max-w-28"
    >
      <Image className="w-full h-full object-contain" src={img} alt="" />
      <ShopBtnDropdownNav actionDescription={null} url={url} />
    </div>
  );
}

export function DropdownHeaderMenu() {
  const {showDropdown, setShowDropdown, hoveredHandle, hoveredCollectionUrl} =
    useAside();

  const imagesMap: Record<string, string[]> = {
    sweats: [
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_6698.jpg?v=1732660142',
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5325.jpg?v=1732660175',
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5409.jpg?v=1732660163',
    ],
    hoodies: [
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/20240314_000227_6F9902.jpg?v=1718668026',
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5579.jpg?v=1732660168',
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5422.jpg?v=1732660168',
    ],
    default: [
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IW_Candle_logo_black-Photoroom.png?v=1710189976',
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IW_Candle_logo_black-Photoroom.png?v=1710189976',
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IW_Candle_logo_black-Photoroom.png?v=1710189976',
    ],
  };

  const imagePath = imagesMap[hoveredHandle || ''] || imagesMap.default;

  if (
    hoveredCollectionUrl === '/pages/about' ||
    hoveredCollectionUrl === '/pages/contact'
  )
    return <></>;
  return (
    <div
      style={{height: '20rem'}}
      onMouseLeave={() => setShowDropdown(false)}
      className="hidden md:flex w-full px-20 py-2 bg-neutral-100 justify-start gap-2 absolute top-24 left-0"
    >
      {/* col 1 */}
      <DropdownHeaderMenuSqrFull
        url={hoveredCollectionUrl}
        img={imagePath[0]}
      />
      {/* col 2 */}
      <div className="flex flex-col gap-2">
        {/* col 2 row 1 */}
        <DropdownHeaderMenuSqrHalf
          url={hoveredCollectionUrl}
          img={imagePath[1]}
        />
        {/* col 2 row 2 */}
        <DropdownHeaderMenuSqrHalf
          url={hoveredCollectionUrl}
          img={imagePath[2]}
        />
      </div>
      <button
        onClick={() => setShowDropdown(true)}
        className="absolute right-2 top-0 text-3xl font-thin"
      >
        x
      </button>
    </div>
  );
}

export function ShopBtnDropdownNav({
  url,
  actionDescription = 'shop',
}: {
  url: string;
  actionDescription: string | null;
}) {
  return (
    <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
      <Link to={url}>
        <div className="bg-black opacity-40  w-full h-full absolute top-0 left-0"></div>
        <button className=" text-gray-100 border px-4 py-2 rounded-sm absolute top-1/2 left-1/2 -translate-1/2 cursor-pointer uppercase">
          {actionDescription || 'shop'}
        </button>
      </Link>
    </div>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <NavLink prefetch="intent" to="/account">
        {/* <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
          <FontAwesomeIcon icon={faUser} />
        </Suspense> */}
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
        <span className="absolute -top-4">{count}</span>
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

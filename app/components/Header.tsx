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
  const {showDropdown, open, type} = useAside();

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (type !== 'search') {
          open('search');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, type]);

  return (
    <header className="header fixed z-30 flex justify-between items-center w-full px-6 py-5 md:py-6 md:px-16 lg:px-24 bg-neutral-100 transition-all duration-300">
      <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
        <h1 className="uppercase font-light text-2xl md:text-3xl tracking-[0.15em]">
          {shop.name}
        </h1>
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
  const isMobile = viewport === 'mobile';
  const className = isMobile
    ? 'header-menu-mobile flex flex-col gap-6 my-10'
    : 'header-menu-desktop hidden md:flex items-center gap-8 lg:gap-10';
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
          className="uppercase text-sm tracking-widest font-light"
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
            onMouseEnter={() => handleHoverNavItem(item.title, url)}
            className="header-menu-item relative py-2 uppercase text-sm tracking-widest font-light 
                       after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 
                       after:bg-current after:transition-all after:duration-300 
                       hover:after:w-full"
            end
            key={item.id}
            onClick={() => {
              close();
              setShowDropdown(false);
            }}
            prefetch="intent"
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
  setShowDropdown,
}: {
  img: string;
  url: string;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [showShopBtn, setShowShopBtn] = useState<boolean>(false);
  return (
    <div
      onMouseEnter={() => setShowShopBtn(true)}
      onMouseLeave={() => setShowShopBtn(false)}
      onClick={() => setShowDropdown(false)}
      onKeyDown={() => setShowDropdown(false)}
      role="button"
      tabIndex={0}
      className="h-full aspect-square bg-neutral-200 cursor-pointer relative overflow-hidden group"
    >
      <Image 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        src={img} 
        alt="" 
      />
      {showShopBtn && <ShopBtnDropdownNav actionDescription={null} url={url} />}
    </div>
  );
}

export function DropdownHeaderMenuSqrHalf({
  img,
  url,
  setShowDropdown,
}: {
  img: string;
  url: string;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [showShopBtn, setShowShopBtn] = useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setShowShopBtn(true)}
      onMouseLeave={() => setShowShopBtn(false)}
      onClick={() => setShowDropdown(false)}
      onKeyDown={() => setShowDropdown(false)}
      role="button"
      tabIndex={0}
      className="flex-1 bg-neutral-300 cursor-pointer relative overflow-hidden group aspect-square"
    >
      <Image 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        src={img} 
        alt="" 
      />
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
    hoveredCollectionUrl === '/collections' ||
    hoveredCollectionUrl === '/pages/contact'
  )
    return <></>;
  return (
    <div
      onMouseLeave={() => setShowDropdown(false)}
      className="hidden md:flex w-full h-80 px-16 lg:px-24 py-4 bg-neutral-100 justify-start gap-3 absolute top-full left-0 animate-fade-in-down shadow-lg"
    >
      {/* col 1 */}
      <DropdownHeaderMenuSqrFull
        url={hoveredCollectionUrl}
        img={imagePath[0]}
        setShowDropdown={setShowDropdown}
      />
      {/* col 2 */}
      <div className="flex flex-col gap-3 h-full">
        {/* col 2 row 1 */}
        <DropdownHeaderMenuSqrHalf
          url={hoveredCollectionUrl}
          img={imagePath[1]}
          setShowDropdown={setShowDropdown}
        />
        {/* col 2 row 2 */}
        <DropdownHeaderMenuSqrHalf
          url={hoveredCollectionUrl}
          img={imagePath[2]}
          setShowDropdown={setShowDropdown}
        />
      </div>
      <button
        onClick={() => setShowDropdown(false)}
        className="absolute right-6 lg:right-8 top-4 text-2xl font-light text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
        aria-label="Close dropdown"
      >
        ×
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
    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
      <Link to={url} className="absolute inset-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40"></div>
        <span className="relative z-10 text-white border border-white px-6 py-3 text-sm uppercase tracking-widest font-light hover:bg-white hover:text-black transition-all duration-300">
          {actionDescription || 'shop'}
        </span>
      </Link>
    </div>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-center gap-5 lg:gap-6" role="navigation">
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
      className="md:hidden text-neutral-900 hover:text-neutral-600 transition-colors duration-200 text-xl"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <span className="sr-only">Menu</span>
      ☰
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button 
      className="text-neutral-900 hover:text-neutral-600 transition-colors duration-200" 
      onClick={() => open('search')}
      aria-label="Search"
    >
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
      className="relative text-neutral-900 hover:text-neutral-600 transition-colors duration-200"
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
      <FontAwesomeIcon icon={faShoppingCart} />
      {count !== null && count > 0 && (
        <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
          {count}
        </span>
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

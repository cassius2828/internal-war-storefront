import {useFetcher, useLoaderData} from '@remix-run/react';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
  showDropdown: boolean;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  setHoveredHandle: React.Dispatch<React.SetStateAction<string>>;
  setHoveredCollectionUrl: React.Dispatch<React.SetStateAction<string>>;
  hoveredHandle: string | null;
  handleShowDropdown: (handle: string) => void;
  hoveredCollectionUrl: string;
};

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      aria-modal
      className={`overlay ${expanded ? 'expanded' : ''}`}
      role="dialog"
    >
      <button className="close-outside" onClick={close} />
      <aside>
        <header>
          <h3>{heading}</h3>
          <button className="close reset" onClick={close}>
            &times;
          </button>
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [hoveredHandle, setHoveredHandle] = useState<string>('/');
  const [hoveredCollectionUrl, setHoveredCollectionUrl] = useState<string>('/');
  const fetcher = useFetcher();
  // TODO: Implement caching
  const handleShowDropdown = (handle: string | null) => {
    setShowDropdown(true);
    setHoveredHandle(handle || '/');
    fetcher.load(`${handle}`);
  };

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
        showDropdown,
        setShowDropdown,
        hoveredHandle,
        setHoveredHandle,
        handleShowDropdown,
        setHoveredCollectionUrl,
        hoveredCollectionUrl,
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}

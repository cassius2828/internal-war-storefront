import {Link, useFetcher, useNavigate} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type KeyboardEvent,
} from 'react';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
  type PredictiveSearchReturn,
} from '~/lib/search';
import {useAside} from './Aside';

const SEARCH_ENDPOINT = '/search';

// Debounce hook for search input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function SearchModal() {
  const {type, close} = useAside();
  const isOpen = type === 'search';
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search'});
  const navigate = useNavigate();

  const {items, total} =
    fetcher?.data?.result ?? getEmptyPredictiveSearchResult();
  const {products, collections, pages, articles} = items;

  const isLoading = fetcher.state === 'loading';
  const hasResults = total > 0;
  const showResults = searchTerm.length > 0;

  // Fetch results when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetcher.submit(
        {q: debouncedSearchTerm, limit: 6, predictive: true},
        {method: 'GET', action: SEARCH_ENDPOINT},
      );
    }
  }, [debouncedSearchTerm]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setSearchTerm('');
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Global keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          close();
        } else {
          // This will be handled by the Aside context
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  const handleClose = useCallback(() => {
    close();
  }, [close]);

  const goToSearch = useCallback(() => {
    if (searchTerm) {
      navigate(`${SEARCH_ENDPOINT}?q=${encodeURIComponent(searchTerm)}`);
      handleClose();
    }
  }, [searchTerm, navigate, handleClose]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      goToSearch();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < products.length + collections.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    }
  };

  const handleProductClick = useCallback(() => {
    handleClose();
  }, [handleClose]);

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={handleClose}>
      <div
        className="search-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="search-modal-header">
          <div className="search-input-wrapper">
            <SearchIcon className="search-input-icon" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products, collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="search-modal-input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            {searchTerm && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                <CloseIcon />
              </button>
            )}
          </div>
          <button
            className="search-close-btn"
            onClick={handleClose}
            aria-label="Close search"
          >
            <span className="search-close-text">ESC</span>
          </button>
        </div>

        {/* Search Results */}
        <div className="search-modal-results" ref={resultsRef}>
          {!showResults && (
            <div className="search-empty-state">
              <div className="search-empty-icon">
                <SearchIcon />
              </div>
              <p className="search-empty-title">Search our store</p>
              <p className="search-empty-subtitle">
                Find products, collections, and more
              </p>
              <div className="search-keyboard-hint">
                <kbd>⌘</kbd>
                <span>+</span>
                <kbd>K</kbd>
                <span className="search-hint-text">to open search anytime</span>
              </div>
            </div>
          )}

          {showResults && isLoading && (
            <div className="search-loading">
              <div className="search-loading-grid">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="search-skeleton-item">
                    <div className="search-skeleton-image" />
                    <div className="search-skeleton-content">
                      <div className="search-skeleton-title" />
                      <div className="search-skeleton-price" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showResults && !isLoading && !hasResults && (
            <div className="search-no-results">
              <div className="search-no-results-icon">
                <SearchOffIcon />
              </div>
              <p className="search-no-results-title">
                No results for "{searchTerm}"
              </p>
              <p className="search-no-results-subtitle">
                Try searching for something else or check your spelling
              </p>
            </div>
          )}

          {showResults && !isLoading && hasResults && (
            <div className="search-results-content">
              {/* Products Section */}
              {products.length > 0 && (
                <div className="search-results-section">
                  <div className="search-results-section-header">
                    <h3>Products</h3>
                    <span className="search-results-count">
                      {products.length} found
                    </span>
                  </div>
                  <div className="search-products-grid">
                    {products.map((product, index) => {
                      const productUrl = urlWithTrackingParams({
                        baseUrl: `/products/${product.handle}`,
                        trackingParams: product.trackingParameters,
                        term: searchTerm,
                      });
                      const image = product?.variants?.nodes?.[0]?.image;
                      const price = product?.variants?.nodes?.[0]?.price;

                      return (
                        <Link
                          key={product.id}
                          to={productUrl}
                          onClick={handleProductClick}
                          className={`search-product-card ${selectedIndex === index ? 'selected' : ''}`}
                        >
                          <div className="search-product-image">
                            {image ? (
                              <Image
                                alt={image.altText ?? product.title}
                                src={image.url}
                                width={120}
                                height={120}
                                className="search-product-img"
                              />
                            ) : (
                              <div className="search-product-placeholder">
                                <ImageIcon />
                              </div>
                            )}
                          </div>
                          <div className="search-product-info">
                            <p className="search-product-title">
                              {product.title}
                            </p>
                            {price && (
                              <p className="search-product-price">
                                <Money data={price} />
                              </p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Collections Section */}
              {collections.length > 0 && (
                <div className="search-results-section">
                  <div className="search-results-section-header">
                    <h3>Collections</h3>
                  </div>
                  <div className="search-collections-list">
                    {collections.map((collection) => {
                      const collectionUrl = urlWithTrackingParams({
                        baseUrl: `/collections/${collection.handle}`,
                        trackingParams: collection.trackingParameters,
                        term: searchTerm,
                      });

                      return (
                        <Link
                          key={collection.id}
                          to={collectionUrl}
                          onClick={handleProductClick}
                          className="search-collection-item"
                        >
                          {collection.image?.url && (
                            <Image
                              alt={collection.image.altText ?? collection.title}
                              src={collection.image.url}
                              width={48}
                              height={48}
                              className="search-collection-img"
                            />
                          )}
                          <span className="search-collection-title">
                            {collection.title}
                          </span>
                          <ArrowRightIcon className="search-collection-arrow" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pages Section */}
              {pages.length > 0 && (
                <div className="search-results-section">
                  <div className="search-results-section-header">
                    <h3>Pages</h3>
                  </div>
                  <div className="search-pages-list">
                    {pages.map((page) => {
                      const pageUrl = urlWithTrackingParams({
                        baseUrl: `/pages/${page.handle}`,
                        trackingParams: page.trackingParameters,
                        term: searchTerm,
                      });

                      return (
                        <Link
                          key={page.id}
                          to={pageUrl}
                          onClick={handleProductClick}
                          className="search-page-item"
                        >
                          <PageIcon className="search-page-icon" />
                          <span>{page.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Articles Section */}
              {articles.length > 0 && (
                <div className="search-results-section">
                  <div className="search-results-section-header">
                    <h3>Articles</h3>
                  </div>
                  <div className="search-articles-list">
                    {articles.map((article) => {
                      const articleUrl = urlWithTrackingParams({
                        baseUrl: `/blogs/${article.blog.handle}/${article.handle}`,
                        trackingParams: article.trackingParameters,
                        term: searchTerm,
                      });

                      return (
                        <Link
                          key={article.id}
                          to={articleUrl}
                          onClick={handleProductClick}
                          className="search-article-item"
                        >
                          {article.image?.url && (
                            <Image
                              alt={article.image.altText ?? article.title}
                              src={article.image.url}
                              width={64}
                              height={64}
                              className="search-article-img"
                            />
                          )}
                          <span>{article.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* View All Results */}
              {searchTerm && (
                <div className="search-view-all">
                  <Link
                    to={`${SEARCH_ENDPOINT}?q=${encodeURIComponent(searchTerm)}`}
                    onClick={handleProductClick}
                    className="search-view-all-btn"
                  >
                    View all results for "{searchTerm}"
                    <ArrowRightIcon />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Icon Components
function SearchIcon({className = ''}: {className?: string}) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CloseIcon() {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SearchOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
      <path d="m9 9 4 4" />
      <path d="m13 9-4 4" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function ArrowRightIcon({className = ''}: {className?: string}) {
  return (
    <svg
      className={className}
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

function PageIcon({className = ''}: {className?: string}) {
  return (
    <svg
      className={className}
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

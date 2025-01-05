import {Link} from '@remix-run/react';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';
import {formatPrice} from '~/lib/utils';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>Articles</h2>
      <div>
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={article.id}>
              <Link prefetch="intent" to={articleUrl}>
                {article.title}
              </Link>
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>Pages</h2>
      <div>
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={page.id}>
              <Link prefetch="intent" to={pageUrl}>
                {page.title}
              </Link>
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div className="flex gap-12 mt-12 p-3">
      {products.nodes.map((product) => {
        return (
          <Link
            className="collection-item shadow-md rounded-md p-3 transition-all duration-300 hover:shadow-lg hover:bg-transparent"
            key={product.id}
            to={`/products/${product.handle}`}
            prefetch="intent"
          >
            <span aria-hidden="true" className="inset-0">
              <Image
                className={`object-cover fade-in`}
                alt={product.variants.nodes[0].image?.altText || product.title}
                aspectRatio="1/1"
                src={product?.variants?.nodes[0]?.image?.url}
                loading="lazy"
                width={300}
                sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </span>
            <div className="flex flex-col items-start ">
              <span className="relative mt-auto text-center text-xs my-2 md:my-auto sm:text-lg md:text-xl text-neutral-900 ">
                {product.title}
              </span>
              <span className="relative mt-auto text-center md:text-xl font-bold text-neutral-900 ">
                ${formatPrice(product.variants.nodes[0].price.amount)}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function SearchResultsEmpty() {
  return <p>No results, try a different search.</p>;
}

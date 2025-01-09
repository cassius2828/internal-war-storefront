import {useLoaderData, Link} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {useState} from 'react';
import NewsCarousel from '~/components/NewsCarousel';

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {collections};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <>
      <div className="mt-20 md:mt-40 flow-root collections">
        <h1 style={{marginBottom: '2rem'}} className="text-center">
          All Collections
        </h1>
        <div className="-my-2">
          <div className="flex justify-center relative box-content  py-2 mb-12 md:mb-24 ">
            <div
              style={{maxWidth: '80rem'}}
              className="  grid grid-cols-1 md:grid-cols-3 w-full gap-6"
            >
              {collections.nodes
                .slice(1)
                .map((collection: CollectionFragment, index: number) => (
                  <CollectionItem
                    key={collection.id}
                    collection={collection}
                    index={index}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      <NewsCarousel />
    </>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  let secondaryImgUrl = '';

  switch (collection.handle) {
    case 'sweatsuits':
      secondaryImgUrl =
        'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/20240218_145459_E3FD09.jpg?v=1708490463';
      break;
    case 'hoodies':
      secondaryImgUrl =
        'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_6553.jpg?v=1733445542';
      break;
    case 'sweats':
      secondaryImgUrl =
        'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_6691.jpg?v=1732660138';
      break;
    default:
      secondaryImgUrl = '';
  }
  return (
    <Link
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="collection-item shadow-md rounded-none p-3 transition-all duration-300 hover:shadow-lg hover:bg-transparent"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      <span aria-hidden="true" className=" inset-0">
        <Image
          style={{borderRadius: '0'}}
          className={isHovered ? 'hidden' : ''}
          alt={collection.image?.altText || collection.title}
          aspectRatio="1/1"
          data={collection.image}
          loading={index < 3 ? 'eager' : undefined}
          sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <Image
          className={`${!isHovered ? 'hidden ' : ''} object-cover fade-in `}
          style={{borderRadius: '0'}}
          alt={collection.title}
          aspectRatio="1/1"
          src={secondaryImgUrl}
          loading={index < 3 ? 'eager' : undefined}
          sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </span>

      <span className="relative mt-auto text-center text-xl font-bold text-neutral-900 ">
        {collection.title}
      </span>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;

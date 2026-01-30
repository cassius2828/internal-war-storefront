import {useLoaderData, Link} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {useState} from 'react';
import NewsCarousel from '~/components/NewsCarousel';

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
  ]);

  return {collections};
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();
  const displayCollections = collections.nodes.slice(1);

  return (
    <div className="collections-page">
      {/* Page Header */}
      <div className="collections-header">
        <h1 className="collections-title">Our Collections</h1>
        <p className="collections-subtitle">
          Explore our curated collections of premium streetwear designed for those who dare to stand out.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="collections-grid-modern">
        {displayCollections.map((collection: CollectionFragment, index: number) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            index={index}
            featured={index === 0}
          />
        ))}
      </div>

      {/* Newsletter/News Section */}
      <NewsCarousel />
    </div>
  );
}

// Collection metadata for enhanced display
const collectionMeta: Record<string, { description: string; productCount: string; secondaryImage: string }> = {
  sweatsuits: {
    description: 'Complete matching sets for the ultimate look',
    productCount: '6 products',
    secondaryImage: 'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/20240218_145459_E3FD09.jpg?v=1708490463',
  },
  hoodies: {
    description: 'Premium hoodies for everyday comfort',
    productCount: '8 products',
    secondaryImage: 'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_6553.jpg?v=1733445542',
  },
  sweats: {
    description: 'Comfortable sweats with signature style',
    productCount: '5 products',
    secondaryImage: 'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_6691.jpg?v=1732660138',
  },
  bottoms: {
    description: 'Bottoms that complete any outfit',
    productCount: '4 products',
    secondaryImage: '',
  },
  'full-sets': {
    description: 'Head-to-toe coordinated looks',
    productCount: '3 products',
    secondaryImage: '',
  },
};

function CollectionCard({
  collection,
  index,
  featured = false,
}: {
  collection: CollectionFragment;
  index: number;
  featured?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const meta = collectionMeta[collection.handle] || {
    description: 'Explore this collection',
    productCount: 'View all',
    secondaryImage: '',
  };

  return (
    <Link
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className={`collection-card ${featured ? 'collection-card-featured' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="collection-card-image">
        {collection.image && (
          <>
            <Image
              alt={collection.image?.altText || collection.title}
              aspectRatio="4/5"
              data={collection.image}
              loading={index < 3 ? 'eager' : 'lazy'}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`collection-card-img ${isHovered && meta.secondaryImage ? 'opacity-0' : 'opacity-100'}`}
            />
            {meta.secondaryImage && (
              <Image
                alt={collection.title}
                aspectRatio="4/5"
                src={meta.secondaryImage}
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`collection-card-img collection-card-img-secondary ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
          </>
        )}
        
        {/* Overlay */}
        <div className="collection-card-overlay" />
        
        {/* Content */}
        <div className="collection-card-content">
          <div className="collection-card-badge">{meta.productCount}</div>
          <h2 className="collection-card-title">{collection.title}</h2>
          <p className="collection-card-description">{meta.description}</p>
          <span className="collection-card-cta">
            Shop Collection
            <ArrowIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="collection-card-arrow"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
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

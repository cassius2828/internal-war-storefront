import {Link} from '@remix-run/react';

const CollectionPreviewGrid = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-16 lg:px-24">
      <div className="flex items-baseline justify-between mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-light tracking-wide text-neutral-900 newsreader">
          Shop by Collection
        </h2>
        <Link
          to="/collections"
          className="hidden text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors duration-200 sm:flex items-center gap-1"
        >
          Browse all
          <span aria-hidden="true" className="text-lg">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Collection 1 - Bottoms */}
        <CollectionCard
          title="Bottoms"
          href="/collections/sweats"
          imageSrc="https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_6691.jpg?v=1732660138"
          imageAlt="Bottoms collection"
          className="sm:row-span-2 aspect-[3/4] lg:aspect-auto"
        />
        {/* Collection 2 - Hoodies */}
        <CollectionCard
          title="Hoodies"
          href="/collections/hoodies"
          imageSrc="https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5076.jpg?v=1732660176"
          imageAlt="Hoodies collection"
          className="aspect-[3/4] lg:aspect-auto"
        />
        {/* Collection 3 - Full Sets */}
        <CollectionCard
          title="Full Sets"
          href="/collections/sweatsuits"
          imageSrc="https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5300.jpg?v=1732660176"
          imageAlt="Full sets collection"
          className="aspect-[3/4] lg:aspect-auto"
        />
      </div>

      <div className="mt-8 sm:hidden">
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
        >
          Browse all collections
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
};

interface CollectionCardProps {
  title: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

function CollectionCard({title, href, imageSrc, imageAlt, className = ''}: CollectionCardProps) {
  return (
    <Link
      to={href}
      className={`group relative overflow-hidden bg-neutral-900 ${className}`}
    >
      <img
        alt={imageAlt}
        src={imageSrc}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
      />
      <div className="absolute inset-0 flex items-end p-6 md:p-8">
        <div>
          <h3 className="text-xl md:text-2xl font-light text-white tracking-wide uppercase">
            {title}
          </h3>
          <p className="mt-2 text-sm text-white/80 flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
            Shop now
            <span aria-hidden="true" className="text-lg">→</span>
          </p>
        </div>
      </div>
    </Link>
  );
}

export default CollectionPreviewGrid;

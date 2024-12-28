import {Link} from '@remix-run/react';

const CollectionPreviewGrid = () => {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="sm:flex sm:items-baseline sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Shop by Collection
          </h2>
          <Link
            to="/collections"
            className="hidden text-sm font-semibold text-neutral-600 hover:text-neutral-500 sm:block"
          >
            Browse all collections
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
          {/* group 1 */}
          <div className="group bg-neutral-900 relative aspect-[2/1] overflow-hidden rounded-lg sm:row-span-2 sm:aspect-square">
            <img
              alt="Two models wearing women's black cotton crewneck tee and off-white cotton crewneck tee."
              src="https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_6691.jpg?v=1732660138"
              className="absolute size-full object-cover group-hover:opacity-75"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"
            />
            <div className="absolute inset-0 flex items-end p-6">
              <div>
                <h3 className="font-semibold text-white">
                  <Link to="/collections/sweats">
                    <span className="absolute inset-0" />
                    Bottoms
                  </Link>
                </h3>
                <p aria-hidden="true" className="mt-1 text-sm text-white">
                  Shop now
                </p>
              </div>
            </div>
          </div>
          {/* group 2 */}
          <div className="group bg-neutral-900 relative aspect-[2/1] overflow-hidden rounded-lg sm:row-span-2 sm:aspect-square">
            <img
              alt="Two models wearing women's black cotton crewneck tee and off-white cotton crewneck tee."
              src="https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5076.jpg?v=1732660176"
              className="absolute size-full object-cover group-hover:opacity-75"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"
            />
            <div className="absolute inset-0 flex items-end p-6">
              <div>
                <h3 className="font-semibold text-white">
                  <a href="/collections/hoodies">
                    <span className="absolute inset-0" />
                    Hoodies
                  </a>
                </h3>
                <p aria-hidden="true" className="mt-1 text-sm text-white">
                  Shop now
                </p>
              </div>
            </div>
          </div>
          {/* groupo 3 */}
          <div className="group bg-neutral-900 relative overflow-hidden rounded-lg sm:col-span-2 sm:row-span-2 sm:aspect-video">
            <img
              alt="Walnut desk organizer set with white modular trays, next to porcelain mug on wooden desk."
              src="https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5300.jpg?v=1732660176"
              className="absolute size-full object-cover group-hover:opacity-75"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"
            />
            <div className="absolute inset-0 flex items-end p-6">
              <div>
                <h3 className="font-semibold text-white">
                  <Link to="/collections/black-sweatsuits">
                    <span className="absolute inset-0" />
                    Full Sets
                  </Link>
                </h3>
                <p aria-hidden="true" className="mt-1 text-sm text-white">
                  Shop now
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:hidden">
          <Link
            to="/collections"
            className="block text-sm font-semibold text-neutral-600 hover:text-neutral-500"
          >
            Browse all categories
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default CollectionPreviewGrid;

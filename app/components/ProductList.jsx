const products = [
  {
    id: 1,
    name: 'Basic Tee',
    href: '#',
    imageSrc:
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_6711.jpg?v=1732660146',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Black',
  },
  {
    id: 2,
    name: 'Basic Tee',
    href: '#',
    imageSrc:
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_6711.jpg?v=1732660146',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Black',
  },
  {
    id: 12,
    name: 'Basic Tee',
    href: '#',
    imageSrc:
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_6711.jpg?v=1732660146',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Black',
  },
  {
    id: 122,
    name: 'Basic Tee',
    href: '#',
    imageSrc:
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_6711.jpg?v=1732660146',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Black',
  },
  {
    id: 12222,
    name: 'Basic Tee',
    href: '#',
    imageSrc:
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_6711.jpg?v=1732660146',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Black',
  },
  {
    id: 11,
    name: 'Basic Tee',
    href: '#',
    imageSrc:
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_6711.jpg?v=1732660146',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Black',
  },
  // More products...
];

export default function Example() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div className=" grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <img
                alt={product.imageAlt}
                src={product.imageSrc}
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
              />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={product.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {product.price}
                </p>
              </div>
              <SizeBtnGroup />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const SizeBtnGroup = () => {
  return (
    <div className="flex gap-6 items-center justify-around my-3">
      <SizeBtn />
      <SizeBtn />
      <SizeBtn />
      <SizeBtn />
      <SizeBtn />
    </div>
  );
};

export const SizeBtn = () => {
  return (
    <button
      type="button"
      className="rounded bg-white/10 px-2 py-1 text-sm font-semibold text-black shadow-sm hover:bg-white/20"
    >
      XL
    </button>
  );
};

const products = [
  {
    id: 1,
    name: 'Basic Tee',
    href: '#',
    imageSrc:
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_6711.jpg?v=1732660146',
    imageSrcHovered:
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/rmhoodiepinkfront-Photoroom-2.png?v=1710191440',
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
    imageSrcHovered:
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/rmhoodiepinkfront-Photoroom-2.png?v=1710191440',
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
    imageSrcHovered:
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/rmhoodiepinkfront-Photoroom-2.png?v=1710191440',
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
    imageSrcHovered:
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/rmhoodiepinkfront-Photoroom-2.png?v=1710191440',
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
    imageSrcHovered:
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/rmhoodiepinkfront-Photoroom-2.png?v=1710191440',
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
    imageSrcHovered:
      'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/rmhoodiepinkfront-Photoroom-2.png?v=1710191440',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Black',
  },
];

export default function ProductCardList() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div className=" grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard
              href={product.href}
              key={product.id}
              id={product.id}
              imageAlt={product.imageAlt}
              imageSrc={product.imageSrc}
              imageSrcHovered={product.imageSrcHovered}
              // color={product.color}
              // price={product.price}
              // name={product.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
type ProductCardProps = {
  id: string | number;
  imageAlt: string;
  imageSrc: string;
  imageSrcHovered: string;
  href: string;
  color: string;
  name: string;
  price: string;
  loading?: 'lazy' | 'eager';
};
export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  imageAlt,
  imageSrc,
  imageSrcHovered,
  // href,
  // color,
  name,
  price,
  loading = 'lazy',
}) => {
  return (
    <div className="group relative">
      <img
        alt={imageAlt}
        src={imageSrc}
        className="group-hover:hidden aspect-square w-full rounded-md bg-gray-200 object-cover lg:aspect-auto lg:h-80"
      />
      <img
        alt={imageAlt}
        src={imageSrcHovered}
        className="group-hover:block hidden aspect-square w-full rounded-md bg-gray-200 object-cover lg:aspect-auto lg:h-80"
      />
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <a href={`#`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {name}
            </a>
          </h3>
          <p className="mt-1 text-sm text-gray-500">color</p>
        </div>
        <p className="text-sm font-medium text-gray-900">${price}</p>
      </div>
      <SizeBtnGroup />
    </div>
  );
};

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

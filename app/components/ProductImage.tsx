import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';
import {TwoToneLoader} from './Loaders';
// Type for the function that sets the focused image
type SetFocusedImage = (imageId: string) => void;
export function ProductImage({
  image,
  full,
}: {
  image: ProductVariantFragment['image'];
  full: boolean;
}) {
  if (!image) {
    return (
      <div className="product-image">
        <TwoToneLoader />
      </div>
    );
  }
  return (
    <div className={`product-image ${full ? 'w-10/12' : 'w-1/2'} mx-auto`}>
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        srcSet={`
    ${image.url}?w=320&h=320&fit=cover 320w,
    ${image.url}?w=640&h=640&fit=cover 640w,
    ${image.url}?w=1024&h=1024&fit=cover 1024w,
    ${image.url}?w=1600&h=1600&fit=cover 1600w
  `}
        sizes="(min-width: 45em) 50vw, 100vw"
        className="object-cover w-full"
      />
    </div>
  );
}

import {Image} from '@shopify/hydrogen';
import type {CustomMediaEdge, ProductImagesGridProps} from 'customTypes';

const ProductImagesGrid: React.FC<ProductImagesGridProps> = ({
  productDataWithMedia,
  setFocusedImage,
}) => {
  return (
    <div style={{maxWidth: '70rem'}} className={`w-full hidden md:block ml-5`}>
      <div className={`grid grid-cols-1 md:grid-cols-2  bg-gray-100`}>
        {productDataWithMedia.product.media?.edges.map(
          (item: CustomMediaEdge) => (
            <>
              {/* desktop */}
              <Image
                fetchPriority="high"
                loading="eager"
                onMouseEnter={() => setFocusedImage(item.node.image)}
                key={item.node.image.id}
                style={{borderRadius: 0, width: '100%'}}
                src={item.node.image.url}
                alt={item.node.image.altText || 'Product Image'}
                className="h-full lg:h-screen w-full object-cover hidden md:block"
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 16vw, (min-width: 1280px) 45vw, 50vw"
              />
            </>
          ),
        )}
      </div>
    </div>
  );
};

export default ProductImagesGrid;

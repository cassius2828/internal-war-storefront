import {Image} from '@shopify/hydrogen';
import type {CustomMediaEdge, ProductImagesGridProps} from 'customTypes';

const ProductImagesGrid: React.FC<ProductImagesGridProps> = ({
  productDataWithMedia,
  setFocusedImage,
}) => {
  return (
    <div style={{maxWidth: '70rem'}} className={` hidden md:block ml-5`}>
      <div className={`grid grid-cols-1 md:grid-cols-2  bg-gray-100`}>
        {productDataWithMedia.product.media?.edges.map(
          (item: CustomMediaEdge) => (
            <>
              {/* desktop */}
              <Image
                onMouseEnter={() => setFocusedImage(item.node.image)}
                key={item.node.image.id}
                style={{borderRadius: 0, width: '100%'}}
                src={item.node.image.url}
                alt={item.node.image.altText || 'Product Image'}
                className="h-screen w-full object-cover hidden md:block"
                sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 100vw"
              />
            </>
          ),
        )}
      </div>
    </div>
  );
};

export default ProductImagesGrid;

import {Image} from '@shopify/hydrogen';
import type {CustomMediaEdge, ProductImagesGridProps} from 'customTypes';
import {useState} from 'react';

const ProductImagesGrid: React.FC<ProductImagesGridProps> = ({
  productDataWithMedia,
  setFocusedImage,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const mediaEdges = productDataWithMedia.product.media?.edges || [];

  const handleThumbnailClick = (index: number, image: any) => {
    setActiveIndex(index);
    setFocusedImage(image);
  };

  return (
    <div className="hidden md:flex gap-4 w-full max-w-5xl">
      {/* Thumbnail Strip - Vertical navigation */}
      <div className="flex flex-col gap-2 w-20 flex-shrink-0">
        {mediaEdges.map((item: CustomMediaEdge, index: number) => (
          <button
            key={`thumb-${item.node.image.id}`}
            onClick={() => handleThumbnailClick(index, item.node.image)}
            className={`
              relative aspect-[3/4] overflow-hidden transition-all duration-300
              ${activeIndex === index 
                ? 'ring-1 ring-neutral-900 ring-offset-1' 
                : 'opacity-60 hover:opacity-100'
              }
            `}
            aria-label={`View image ${index + 1}`}
          >
            <Image
              src={item.node.image.url}
              alt={item.node.image.altText || `Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main Image Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-2 gap-2">
          {mediaEdges.map((item: CustomMediaEdge, index: number) => (
            <div
              key={item.node.image.id}
              className="relative overflow-hidden bg-neutral-50 group cursor-pointer"
            >
              <Image
                fetchPriority={index < 2 ? 'high' : 'low'}
                loading={index < 2 ? 'eager' : 'lazy'}
                onMouseEnter={() => {
                  setActiveIndex(index);
                  setFocusedImage(item.node.image);
                }}
                src={item.node.image.url}
                alt={item.node.image.altText || 'Product Image'}
                className="w-full h-auto aspect-[3/4] object-cover transition-all duration-500 ease-out group-hover:scale-[1.03]"
                sizes="(min-width: 1280px) 35vw, (min-width: 1024px) 40vw, 50vw"
              />
              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductImagesGrid;

import {Image} from '@shopify/hydrogen';
import type {CustomMediaEdge, ProductDataWithMedia} from 'customTypes';
import {useState, useRef, useCallback} from 'react';

const ProductImagesCarousel = ({
  productDataWithMedia,
}: {
  productDataWithMedia: ProductDataWithMedia;
}) => {
  const numOfImages: number = productDataWithMedia.product.media.edges.length;
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleSlideChange = useCallback(
    (newIndex: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setActiveSlide(newIndex);
      setTimeout(() => setIsTransitioning(false), 400);
    },
    [isTransitioning],
  );

  const handleNextSlide = () => {
    const nextIndex = activeSlide === numOfImages - 1 ? 0 : activeSlide + 1;
    handleSlideChange(nextIndex);
  };

  const handlePrevSlide = () => {
    const prevIndex = activeSlide === 0 ? numOfImages - 1 : activeSlide - 1;
    handleSlideChange(prevIndex);
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
  };

  return (
    <div
      id="product-carousel"
      className="relative w-full md:hidden"
      data-carousel="slide"
    >
      {/* Carousel wrapper */}
      <div
        className="relative aspect-[3/4] overflow-hidden bg-neutral-50"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {productDataWithMedia.product.media?.edges.map(
          (item: CustomMediaEdge, idx: number) => (
            <div
              key={item.node.image.id}
              className={`
                absolute inset-0 transition-all duration-400 ease-out
                ${activeSlide === idx 
                  ? 'opacity-100 translate-x-0' 
                  : idx < activeSlide 
                    ? 'opacity-0 -translate-x-full' 
                    : 'opacity-0 translate-x-full'
                }
              `}
              data-carousel-item
              aria-hidden={activeSlide !== idx}
            >
              <Image
                className="w-full h-full object-cover"
                src={item.node.image.url}
                alt={item.node.image.altText || 'Product Image'}
                sizes="100vw"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ),
        )}
      </div>

      {/* Image counter */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs tracking-wider font-light">
        {activeSlide + 1} / {numOfImages}
      </div>

      {/* Slider indicators - minimal line style */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {productDataWithMedia.product.media?.edges.map(
          (_: CustomMediaEdge, idx: number) => (
            <button
              key={`indicator-${idx}`}
              type="button"
              onClick={() => handleSlideChange(idx)}
              className={`
                h-0.5 transition-all duration-300 ease-out
                ${idx === activeSlide 
                  ? 'w-6 bg-neutral-900' 
                  : 'w-3 bg-neutral-400 hover:bg-neutral-600'
                }
              `}
              aria-current={idx === activeSlide}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ),
        )}
      </div>

      {/* Slider controls - premium minimal style */}
      <button
        type="button"
        className="absolute top-1/2 left-3 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:bg-white active:scale-95"
        onClick={handlePrevSlide}
        disabled={isTransitioning}
        aria-label="Previous image"
      >
        <svg
          className="w-4 h-4 text-neutral-900"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            d="M5 1 1 5l4 4"
          />
        </svg>
      </button>

      <button
        type="button"
        className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:bg-white active:scale-95"
        onClick={handleNextSlide}
        disabled={isTransitioning}
        aria-label="Next image"
      >
        <svg
          className="w-4 h-4 text-neutral-900"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            d="m1 9 4-4-4-4"
          />
        </svg>
      </button>
    </div>
  );
};

export default ProductImagesCarousel;

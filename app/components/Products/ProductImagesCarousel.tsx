import {Image} from '@shopify/hydrogen';
import type {CustomMediaEdge, ProductDataWithMedia} from 'customTypes';
import {useState} from 'react';

const ProductImagesCarousel = ({
  productDataWithMedia,
}: {
  productDataWithMedia: ProductDataWithMedia;
}) => {
  const numOfImages: number = productDataWithMedia.product.media.edges.length;
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const handleNextSlide = (imageIdx: number) => {
    if (imageIdx < numOfImages - 1) {
      setActiveSlide((prev) => prev + 1);
    }
    if (imageIdx === numOfImages - 1) {
      setActiveSlide(0);
    }
  };
  const handlePrevSlide = (imageIdx: number) => {
    if (imageIdx > 0) {
      setActiveSlide((prev) => prev - 1);
    }
    if (imageIdx === 0) {
      setActiveSlide(numOfImages - 1);
    }
  };
  return (
    <div
      id="default-carousel"
      className="relative w-full z-0 md:hidden mt-3"
      data-carousel="slide"
    >
      {/* Carousel wrapper */}
      <div style={{height: '35rem'}} className="relative overflow-hidden">
        {productDataWithMedia.product.media?.edges.map(
          (item: CustomMediaEdge, idx: number) => {
            return (
              <div
                key={item.node.image.id}
                className={`${
                  activeSlide === idx ? 'block' : 'hidden'
                } 'duration-700 ease-in-out`}
                data-carousel-item
              >
                <Image
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  src={item.node.image.url}
                  alt={item.node.image.altText || 'Product Image'}
                  sizes="100vw"
                />
              </div>
            );
          },
        )}
      </div>
      {/* Slider indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {productDataWithMedia.product.media?.edges.map(
          (_: any, idx: number) => {
            return (
              <button
                key={_}
                type="button"
                className={`w-3 h-3 rounded-full ${
                  idx === activeSlide ? 'bg-gray-400' : 'bg-gray-100'
                }`}
                aria-current={idx === activeSlide}
                aria-label={`Slide ${idx}`}
                data-carousel-slide-to={idx}
              ></button>
            );
          },
        )}
      </div>
      {/* Slider controls */}
      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={() => handlePrevSlide(activeSlide)}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={() => handleNextSlide(activeSlide)}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default ProductImagesCarousel;

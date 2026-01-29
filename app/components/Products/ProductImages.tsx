import type {ProductImagesProps} from 'customTypes';
import ProductImagesGrid from './ProductImagesGrid';
import ProductImagesCarousel from './ProductImagesCarousel';

const ProductImages: React.FC<ProductImagesProps> = ({
  productDataWithMedia,
  setFocusedImage,
}) => {
  return (
    <div className="w-full lg:w-3/5 lg:sticky lg:top-24 lg:self-start">
      {/* Desktop: Grid with thumbnail navigation */}
      <ProductImagesGrid
        productDataWithMedia={productDataWithMedia}
        setFocusedImage={setFocusedImage}
      />
      {/* Mobile: Swipeable carousel */}
      <ProductImagesCarousel productDataWithMedia={productDataWithMedia} />
    </div>
  );
};

export default ProductImages;

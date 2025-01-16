import type {ProductImagesProps} from 'customTypes';
import ProductImagesGrid from './ProductImagesGrid';
import ProductImagesCarousel from './ProductImagesCarousel';

const ProductImages: React.FC<ProductImagesProps> = ({
  productDataWithMedia,
  product,
  selectedVariant,
  variants,
  setFocusedImage,
}) => {
  const {title, descriptionHtml} = product;
  const mediaLength = productDataWithMedia.product?.media.edges.length;

  return (
    <>
      <ProductImagesGrid
        productDataWithMedia={productDataWithMedia}
        setFocusedImage={setFocusedImage}
      />
      <ProductImagesCarousel productDataWithMedia={productDataWithMedia} />
    </>
  );
};

export default ProductImages;

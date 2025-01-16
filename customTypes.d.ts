import type {Product, ProductVariant} from '@shopify/hydrogen';

// Type for the image object inside media.edges.node
export type MediaImage = {
  id: string;
  altText?: string;
  url: string;
  width: number;
  height: number;
};

// Type for the edges inside the product media
export type CustomMediaEdge = {
  node: {
    image: MediaImage;
  };
};

// Type for the product data, which includes media and variants
export type ProductDataWithMedia = {
  product: {
    media: {
      edges: CustomMediaEdge[];
    };
  };
};

// Type for the selected variant, which contains price and compareAtPrice
export type SelectedVariant = {
  price: string; // You will need to convert this to MoneyV2 export type later
  compareAtPrice: string | null; // Same as above
};

export type ProductVariants = {
  product: Product;
};

// export Type for the function that sets the focused image
export type SetFocusedImage = (mediaImage: MediaImage) => void;
// export Type for the props for ProductImages
export type ProductImagesProps = {
  productDataWithMedia: ProductDataWithMedia;
  product: Product; // Add this to match the product prop passed to ProductImages
  selectedVariant: ProductVariant; // Use ProductVariant for selectedVariant
  setFocusedImage: SetFocusedImage;
  variants: ProductVariants;
};
export type ProductImagesGridProps = {
  productDataWithMedia: ProductDataWithMedia;
  setFocusedImage: SetFocusedImage;
};

export type ProductCardProps = {
  product: Product;
  loading?: 'lazy' | 'eager';
};

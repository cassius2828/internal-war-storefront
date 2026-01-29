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
  setFocusedImage: SetFocusedImage;
};
export type ProductImagesGridProps = {
  productDataWithMedia: ProductDataWithMedia;
  setFocusedImage: SetFocusedImage;
};

export type ProductCardProps = {
  product: Product;
  loading?: 'lazy' | 'eager';
};


export const GET_PRODUCT_VARIANT_QUERY = `#graphql
  query getProductVariant($id: ID!) {
    productVariant(id: $id) {
      id
      title
      availableForSale
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      requiresShipping
      image {
        id
        url
        altText
        width
        height
      }
      product {
        handle
        title
        id
        vendor
      }
      selectedOptions {
        name
        value
      }
    }
  }
`;
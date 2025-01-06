// Function to format price ensuring two decimal places
export function formatPrice(price: string): string | void {
  if (price == undefined) return;
  const centsFromPrice = price.split('.')[1];
  return centsFromPrice && centsFromPrice.length === 1 ? price + '0' : price;
}

// Define the types for the selectedOptions and variant nodes
interface Variant {
  selectedOptions: {name: string; value: string}[];
}

interface Product {
  variants: {
    nodes: Variant[];
  };
}

// Function to get available size variants from a product
export function getAvailableSizeVariants(product: Product): string[] {
  const availableSizes = new Set<string>();

  // Filter variants and extract size options
  product.variants.nodes
    .filter((variant) =>
      variant.selectedOptions.some((option) => option.name === 'Size'),
    )
    .forEach((variant) => {
      const sizeOption = variant.selectedOptions.find(
        (option) => option.name === 'Size',
      );
      if (sizeOption) {
        availableSizes.add(sizeOption.value); // Add size value to the Set (ensures uniqueness)
      }
    });

  // Convert Set to array and return
  return Array.from(availableSizes);
}
type ComparePrice = {
  basePrice: string;
  comparedPrice: string;
  isBasePriceLessThanComparedPrice: boolean; // New field for the comparison result
};

export function comparePrice(
  basePrice: string,
  comparedPrice: string,
): ComparePrice {
  const baseNum = Number(basePrice?.slice(0, 2));
  const comparedNum = Number(comparedPrice?.slice(0, 2));

  return {
    basePrice,
    comparedPrice,
    isBasePriceLessThanComparedPrice: baseNum < comparedNum,
  };
}

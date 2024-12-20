export function formatPrice(price: string) {
  const centsFromPrice = price.split('.')[1];
  if (centsFromPrice.length === 1) {
    return price + '0';
  } else return price;
}

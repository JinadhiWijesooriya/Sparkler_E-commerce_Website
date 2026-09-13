export const formatPrice = (
  value: number,
  currency: string = "USD"
) => {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(value);
};

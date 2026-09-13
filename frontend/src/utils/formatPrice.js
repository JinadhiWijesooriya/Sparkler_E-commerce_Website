export const formatPrice = (value, currency = "USD") => {
    return new Intl.NumberFormat("en", {
        style: "currency",
        currency,
    }).format(value);
};

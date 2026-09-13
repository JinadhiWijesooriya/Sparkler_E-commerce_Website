export interface ProductImageType {
    image: string;
    alt_text: string | null;
}
export interface CartItemType {
    id: number;
    name: string;
    price: number;
    quantity: number;
    total_price: number;
    product_shop?: number | null;
    product_set?: number | null;
    product_gem?: number | null;
    product_images: ProductImageType[];
    image?: string;
}
export interface CartType {
    id: number;
    user?: number | null;
    session_key?: string | null;
    items: CartItemType[];
    created_at: string;
}
export interface CountryOrderSettingsType {
    shipping_cost: number;
    tax_rate: number;
    vat_rate: number;
}
export interface CountryType {
    id: number;
    name: string;
    order_settings?: CountryOrderSettingsType | null;
}
export interface OrderType {
    order_id: string;
    user?: number | null;
    cart?: CartType | null;
    full_name: string;
    email: string;
    phone?: string | null;
    address_1: string;
    address_2?: string | null;
    city: string;
    state?: string | null;
    country?: CountryType | null;
    subtotal: number;
    shipping_cost: number;
    tax: number;
    vat: number;
    total: number;
    status: string;
    payment_method: string;
    created_at: string;
}
export declare const CartAPI: {
    getCart: () => Promise<CartType>;
    addToCart: (product_id: number, product_type: "shop" | "set" | "gem", quantity?: number) => Promise<CartType>;
    updateCartItem: (item_id: number, quantity: number) => Promise<CartType>;
    removeCartItem: (item_id: number) => Promise<CartType>;
    checkout: (orderData: {
        full_name: string;
        email: string;
        phone?: string;
        address_1: string;
        address_2?: string;
        city: string;
        state?: string;
        country: string;
        payment_method: string;
    }) => Promise<{
        checkout_url: string;
        order_id: string;
    }>;
    verifyPayment: (order_id: string, session_id: string) => Promise<{
        status: string;
        message: string;
    }>;
    getOrder: (order_id: string) => Promise<OrderType>;
    getCountries: () => Promise<CountryType[]>;
    getPendingOrders: () => Promise<OrderType[]>;
    getAllOrders: () => Promise<OrderType[]>;
};

import type { CartItemType, OrderType, CountryType } from "../api/cartApi";
export interface CartItemTypeExtended extends CartItemType {
    metal?: string;
    gem?: string;
    variant?: string;
    image?: string;
}
export interface CartContextType {
    items: CartItemTypeExtended[];
    loading: boolean;
    orders?: OrderType[];
    fetchAllOrders?: () => Promise<void>;
    fetchOrderById?: (order_id: string) => Promise<OrderType | undefined>;
    fetchCart: () => Promise<void>;
    addToCart: (product_id: number, product_type: "shop" | "set" | "gem", quantity?: number) => Promise<void>;
    updateCartItem: (id: number, quantity: number) => Promise<void>;
    removeCartItem: (id: number) => Promise<void>;
    countries: CountryType[];
    getCountrySettings: (countryName?: string) => {
        shipping_cost: number;
        tax_rate: number;
        vat_rate: number;
    };
    getCartSubtotal: () => number;
    getCartTotal: (countryName?: string) => number;
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
        cart?: CartItemTypeExtended[];
    }) => Promise<{
        checkout_url: string;
        order_id: string;
    } | undefined>;
}
export declare const CartContext: import("react").Context<CartContextType | undefined>;
